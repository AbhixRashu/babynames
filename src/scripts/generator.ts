import type { BabyName } from '../lib/types';
import { NAMES, ORIGINS, STYLES, LETTERS, filterNames, pickBatch, similarNames, byName, EMPTY_FILTER, type FilterState } from '../lib/names';
import { toggleSaved, isSaved } from '../lib/shortlist';

const BATCH_SIZE = 12;

interface MountOptions {
  root: HTMLElement;
  defaultGender?: 'all' | 'boy' | 'girl' | 'unisex';
  defaultOrigin?: string;
  defaultQuery?: string;
  defaultStyle?: string;
}

export function mountGenerator(opts: MountOptions) {
  const root = opts.root;
  const state: FilterState = {
    ...EMPTY_FILTER,
    gender: opts.defaultGender ?? 'all',
    origin: opts.defaultOrigin ?? 'All origins',
    query: opts.defaultQuery ?? '',
    style: opts.defaultStyle ?? 'All styles',
  };
  let batch: BabyName[] = [];
  let seen: string[] = [];

  // ---- DOM refs ----
  const genderChips = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-gender]'));
  const originSelect = root.querySelector<HTMLSelectElement>('[data-origin]');
  const letterSelect = root.querySelector<HTMLSelectElement>('[data-letter]');
  const styleSelect = root.querySelector<HTMLSelectElement>('[data-style]');
  const queryInput = root.querySelector<HTMLInputElement>('[data-query]');
  const generateBtn = root.querySelector<HTMLButtonElement>('[data-generate]');
  const shuffleBtn = root.querySelector<HTMLButtonElement>('[data-shuffle]');
  const resultsEl = root.querySelector<HTMLElement>('[data-results]');
  const countEl = root.querySelector<HTMLElement>('[data-count]');
  const emptyEl = root.querySelector<HTMLElement>('[data-empty]');
  const modal = root.querySelector<HTMLElement>('[data-modal]');

  const letterPlaceholder = 'Any letter';

  // ---- populating selects ----
  if (originSelect) {
    ORIGINS.forEach((o) => {
      const opt = document.createElement('option');
      opt.value = o;
      opt.textContent = o === 'All origins' ? 'All origins' : o;
      if (o === state.origin) opt.selected = true;
      originSelect.appendChild(opt);
    });
  }
  if (letterSelect) {
    const anyOpt = document.createElement('option');
    anyOpt.value = '';
    anyOpt.textContent = letterPlaceholder;
    letterSelect.appendChild(anyOpt);
    LETTERS.forEach((l) => {
      const opt = document.createElement('option');
      opt.value = l;
      opt.textContent = l;
      letterSelect.appendChild(opt);
    });
  }
  if (styleSelect) {
    STYLES.forEach((s) => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      if (s === state.style) opt.selected = true;
      styleSelect.appendChild(opt);
    });
  }

  // ---- set active gender chip ----
  const syncGenderChips = () => {
    genderChips.forEach((c) => {
      const on = c.dataset.gender === state.gender;
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', String(on));
    });
  };
  syncGenderChips();

  // ---- rendering ----
  function renderResults() {
    const saved = getSavedSet();
    if (!resultsEl) return;
    resultsEl.innerHTML = '';
    if (!batch.length) {
      if (emptyEl) emptyEl.hidden = false;
      if (countEl) countEl.textContent = '';
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (countEl) countEl.textContent = `${batch.length} names`;
    const frag = document.createDocumentFragment();
    batch.forEach((n, i) => {
      frag.appendChild(buildCard(n, saved.has(n.name), i));
    });
    resultsEl.appendChild(frag);
  }

  function buildCard(n: BabyName, saved: boolean, index: number): HTMLElement {
    const card = document.createElement('article');
    card.className = 'name-card animate-pop-in';
    card.style.animationDelay = `${Math.min(index * 35, 300)}ms`;
    card.dataset.name = n.name;

    const favBtn = document.createElement('button');
    favBtn.type = 'button';
    favBtn.className = `fav-btn ${saved ? 'on' : ''}`;
    favBtn.setAttribute('aria-label', saved ? `Remove ${n.name} from shortlist` : `Save ${n.name} to shortlist`);
    favBtn.innerHTML = `
      <svg viewBox="0 0 24 24" class="h-4 w-4 heart-outline" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
      <svg viewBox="0 0 24 24" class="h-4 w-4 heart-fill" fill="currentColor" aria-hidden="true">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
    `;

    const body = document.createElement('div');
    body.className = 'flex items-start justify-between gap-3';
    const info = document.createElement('div');
    const nameEl = document.createElement('h3');
    nameEl.className = 'text-lg font-bold tracking-tight text-ink';
    nameEl.textContent = n.name;
    const meaningEl = document.createElement('p');
    meaningEl.className = 'mt-0.5 text-sm leading-relaxed text-mute line-clamp-2';
    meaningEl.textContent = n.meaning;
    info.appendChild(nameEl);
    info.appendChild(meaningEl);
    body.appendChild(info);
    body.appendChild(favBtn);
    card.appendChild(body);

    const meta = document.createElement('div');
    meta.className = 'mt-3 flex flex-wrap items-center gap-1.5';
    meta.innerHTML = `
      <span class="badge-gender badge-${n.gender}">${n.gender}</span>
      <span class="pill">${n.origin}</span>
      ${n.style ? `<span class="badge-style badge-style-${n.style.replace(/ /g, '-')}">${n.style}</span>` : ''}
      ${n.rank ? `<span class="pill">#${n.rank} popular</span>` : ''}
    `;
    card.appendChild(meta);

    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nowSaved = toggleSaved(n.name);
      favBtn.classList.toggle('on', nowSaved);
      favBtn.classList.remove('fav-pop');
      void favBtn.offsetWidth;
      favBtn.classList.add('fav-pop');
      favBtn.setAttribute('aria-label', nowSaved ? `Remove ${n.name} from shortlist` : `Save ${n.name} to shortlist`);
      showToast(nowSaved ? `Saved ${n.name} to shortlist` : `Removed ${n.name} from shortlist`);
    });

    card.addEventListener('click', () => openModal(n.name));
    return card;
  }

  // ---- modal ----
  function openModal(name: string) {
    const n = byName(name);
    if (!n || !modal) return;
    const similar = similarNames(n, 6);
    const panel = modal.querySelector<HTMLElement>('[data-modal-panel]');
    if (!panel) return;
    const saved = isSaved(n.name);
    panel.innerHTML = `
      <div class="flex items-start justify-between gap-4 p-6 pb-0">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="badge-gender badge-${n.gender}">${n.gender}</span>
            <span class="pill">${n.origin}</span>
            ${n.style ? `<span class="badge-style badge-style-${n.style.replace(/ /g, '-')}">${n.style}</span>` : ''}
            ${n.rank ? `<span class="pill">#${n.rank} in popularity</span>` : ''}
          </div>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-ink">${n.name}</h2>
        </div>
        <button type="button" data-modal-close class="btn btn-ghost h-10 w-10 shrink-0" aria-label="Close">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <div class="p-6">
        <p class="text-[15px] leading-relaxed text-ink-soft">
          <strong class="text-ink">Meaning:</strong> ${n.meaning}
        </p>
        <p class="mt-3 text-sm leading-relaxed text-mute">
          <strong class="text-ink">Origin:</strong> ${n.origin} · <strong class="text-ink">Gender:</strong> ${n.gender}
          ${n.rank ? ` · <strong class="text-ink">Popularity:</strong> #${n.rank}` : ''}
        </p>
        <button type="button" data-modal-fav class="btn ${saved ? 'btn-ghost' : 'btn-pink'} mt-5 w-full px-4 py-3 text-sm">
          ${saved ? '♥ Saved to shortlist — tap to remove' : '♡ Save to my shortlist'}
        </button>
      </div>
      <div class="border-t border-line p-6">
        <h3 class="text-sm font-bold uppercase tracking-widest text-mute">Similar names</h3>
        <div class="mt-3 flex flex-wrap gap-2">
          ${similar.map((s) => `<button type="button" data-similar="${s.name}" class="chip">${s.name}</button>`).join('')}
        </div>
      </div>
    `;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    const close = () => {
      modal.hidden = true;
      document.body.style.overflow = '';
    };
    modal.querySelector('[data-modal-close]')?.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    modal.querySelector('[data-modal-fav]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const nowSaved = toggleSaved(n.name);
      const btn = e.currentTarget as HTMLButtonElement;
      btn.classList.toggle('btn-pink', !nowSaved);
      btn.classList.toggle('btn-ghost', nowSaved);
      btn.textContent = nowSaved ? '♥ Saved to shortlist — tap to remove' : '♡ Save to my shortlist';
      showToast(nowSaved ? `Saved ${n.name} to shortlist` : `Removed ${n.name} from shortlist`);
    });
    modal.querySelectorAll<HTMLButtonElement>('[data-similar]').forEach((b) => {
      b.addEventListener('click', () => openModal(b.dataset.similar || ''));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  // ---- actions ----
  function runGenerate(scrollToResults = true) {
    const matches = filterNames(NAMES, state);
    if (!matches.length) {
      batch = [];
      seen = [];
      renderResults();
      return;
    }
    const pick = pickBatch(matches, BATCH_SIZE, seen);
    if (pick.length < BATCH_SIZE) {
      seen = [];
      batch = pickBatch(matches, BATCH_SIZE, seen);
    } else {
      batch = pick;
    }
    seen = seen.concat(batch.map((b) => b.name));
    renderResults();
    if (scrollToResults && resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function runShuffle() {
    const matches = filterNames(NAMES, state);
    if (!matches.length) {
      batch = [];
      renderResults();
      return;
    }
    batch = pickBatch(matches, BATCH_SIZE);
    renderResults();
  }

  // ---- wiring ----
  genderChips.forEach((c) => {
    c.addEventListener('click', () => {
      state.gender = (c.dataset.gender as FilterState['gender']) || 'all';
      syncGenderChips();
    });
  });
  originSelect?.addEventListener('change', (e) => {
    state.origin = (e.target as HTMLSelectElement).value;
  });
  letterSelect?.addEventListener('change', (e) => {
    state.letter = (e.target as HTMLSelectElement).value;
  });
  styleSelect?.addEventListener('change', (e) => {
    state.style = (e.target as HTMLSelectElement).value;
  });
  queryInput?.addEventListener('input', (e) => {
    state.query = (e.target as HTMLInputElement).value;
  });
  generateBtn?.addEventListener('click', () => runGenerate());
  shuffleBtn?.addEventListener('click', runShuffle);

  // ---- initial load ----
  runGenerate(false);
}

function getSavedSet(): Set<string> {
  try {
    const raw = localStorage.getItem('babynames.shortlist');
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function showToast(msg: string) {
  let toast = document.querySelector<HTMLElement>('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast animate-toast-in';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-pink" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" /></svg>${msg}`;
  clearTimeout((toast as any)._t);
  (toast as any)._t = setTimeout(() => toast?.remove(), 2000);
}
