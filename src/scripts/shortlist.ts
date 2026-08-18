import { getShortlist, removeSaved, clearShortlist } from '../lib/shortlist';

export async function mountShortlist(root: HTMLElement) {
  const { byName, similarNames } = await import('../lib/names');
  const loadingEl = root.querySelector<HTMLElement>('[data-shortlist-loading]');
  if (loadingEl) loadingEl.hidden = true;
  const grid = root.querySelector<HTMLElement>('[data-shortlist-grid]');
  const emptyEl = root.querySelector<HTMLElement>('[data-shortlist-empty]');
  const countEl = root.querySelector<HTMLElement>('[data-shortlist-count]');
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-shortlist-clear]');
  const modal = root.querySelector<HTMLElement>('[data-shortlist-modal]');
  if (!grid) return;
  const listEl: HTMLElement = grid;

  function render() {
    const names = getShortlist()
      .map((n) => byName(n))
      .filter((n): n is NonNullable<typeof n> => Boolean(n));
    listEl.innerHTML = '';
    if (!names.length) {
      if (emptyEl) emptyEl.hidden = false;
      if (countEl) countEl.textContent = '0 names saved';
      if (clearBtn) clearBtn.hidden = true;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (clearBtn) clearBtn.hidden = false;
    if (countEl) countEl.textContent = `${names.length} ${names.length === 1 ? 'name' : 'names'} saved`;
    names.forEach((n, i) => listEl.appendChild(buildCard(n, i)));
  }

  function buildCard(n: NonNullable<ReturnType<typeof byName>>, index: number): HTMLElement {
    const card = document.createElement('article');
    card.className = 'name-card animate-pop-in';
    card.style.animationDelay = `${Math.min(index * 35, 300)}ms`;
    card.dataset.name = n.name;

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

    const favBtn = document.createElement('button');
    favBtn.type = 'button';
    favBtn.className = 'fav-btn on';
    favBtn.setAttribute('aria-label', `Remove ${n.name} from shortlist`);
    favBtn.innerHTML = `
      <svg viewBox="0 0 24 24" class="h-4 w-4 heart-fill" fill="currentColor" aria-hidden="true">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
    `;
    body.appendChild(favBtn);
    card.appendChild(body);

    const meta = document.createElement('div');
    meta.className = 'mt-3 flex flex-wrap items-center gap-1.5';
    meta.innerHTML = `
      <span class="badge-gender badge-${n.gender}">${n.gender}</span>
      <span class="pill">${n.origin}</span>
      ${(n.vibes || []).map((v) => `<span class="badge-vibe vibe-${v.replace(/[^a-z]/gi, '').toLowerCase()}">${v}</span>`).join('')}
      ${n.style ? `<span class="badge-style badge-style-${n.style.replace(/ /g, '-')}">${n.style}</span>` : ''}
      ${n.rank ? `<span class="pill">#${n.rank} popular</span>` : ''}
    `;
    card.appendChild(meta);

    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeSaved(n.name);
      render();
      showToast(`Removed ${n.name} from shortlist`);
    });
    card.addEventListener('click', () => openModal(n.name));
    return card;
  }

  function openModal(name: string) {
    const n = byName(name);
    if (!n || !modal) return;
    const similar = similarNames(n, 6);
    const panel = modal.querySelector<HTMLElement>('[data-shortlist-modal-panel]');
    if (!panel) return;
    panel.innerHTML = `
      <div class="flex items-start justify-between gap-4 p-6 pb-0">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="badge-gender badge-${n.gender}">${n.gender}</span>
            <span class="pill">${n.origin}</span>
            ${(n.vibes || []).map((v) => `<span class="badge-vibe vibe-${v.replace(/[^a-z]/gi, '').toLowerCase()}">${v}</span>`).join('')}
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
        ${n.description ? `
        <p class="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink-soft">
          <strong class="text-ink">About this name:</strong> ${n.description}
        </p>` : ''}
        <p class="mt-3 text-sm leading-relaxed text-mute">
          <strong class="text-ink">Origin:</strong> ${n.origin} · <strong class="text-ink">Gender:</strong> ${n.gender}
          ${n.rank ? ` · <strong class="text-ink">Popularity:</strong> #${n.rank}` : ''}
        </p>
        <a href="/search?q=${encodeURIComponent(n.origin)}" class="btn btn-ghost mt-5 w-full px-4 py-3 text-sm">More names from ${n.origin}</a>
      </div>
      <div class="border-t border-line p-6">
        <h3 class="text-sm font-bold uppercase tracking-widest text-mute">Similar names</h3>
        <div class="mt-3 flex flex-wrap gap-2">
          ${similar.map((s) => `<a href="/search?q=${encodeURIComponent(s.name)}" class="chip">${s.name}</a>`).join('')}
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
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  clearBtn?.addEventListener('click', () => {
    clearShortlist();
    render();
    showToast('Shortlist cleared');
  });

  render();
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
