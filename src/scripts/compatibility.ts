import { checkCompatibility } from '../lib/compatibility';

export function mountCompatibility(root: HTMLElement) {
  const inputA = root.querySelector<HTMLInputElement>('[data-comp-a]');
  const inputB = root.querySelector<HTMLInputElement>('[data-comp-b]');
  const checkBtn = root.querySelector<HTMLButtonElement>('[data-comp-check]');
  const resultEl = root.querySelector<HTMLElement>('[data-comp-result]');
  if (!inputA || !inputB || !checkBtn || !resultEl) return;

  const run = () => {
    const a = inputA.value.trim();
    const b = inputB.value.trim();
    if (!a || !b) {
      resultEl.classList.add('hidden');
      resultEl.classList.remove('animate-pop-in');
      return;
    }
    const res = checkCompatibility(a, b);
    const color = res.score >= 70 ? 'var(--pink)' : res.score >= 45 ? 'var(--blue)' : 'var(--gold)';
    resultEl.innerHTML = `
      <div class="rounded-2xl border border-line bg-card-2 p-6">
        <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div class="score-ring h-32 w-32 shrink-0" style="--score: ${res.score}; --ring-color: ${color}">
            <div class="score-num text-4xl" style="color: var(--ink)">${res.score}<span class="text-lg text-mute">%</span></div>
          </div>
          <div class="text-center sm:text-left">
            <p class="text-xs font-bold uppercase tracking-widest" style="color: ${color}">${res.label}</p>
            <h3 class="mt-1 text-2xl font-bold tracking-tight text-ink">${a} & ${b}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink-soft">${res.summary}</p>
          </div>
        </div>
        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          ${res.factors
            .map(
              (f) => `
              <div class="rounded-xl border border-line bg-card p-4">
                <div class="flex items-center justify-between gap-3">
                  <p class="text-sm font-semibold text-ink">${f.name}</p>
                  <span class="pill">${f.points}/${f.max}</span>
                </div>
                <p class="mt-1.5 text-xs leading-relaxed text-mute">${f.note}</p>
              </div>
            `
            )
            .join('')}
        </div>
      </div>
    `;
    resultEl.classList.remove('hidden');
    resultEl.classList.remove('animate-pop-in');
    void resultEl.offsetWidth;
    resultEl.classList.add('animate-pop-in');
  };

  checkBtn.addEventListener('click', run);
  inputA.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run();
    }
  });
  inputB.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run();
    }
  });
}