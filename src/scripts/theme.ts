const KEY = 'babynames.theme';

export function currentTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function initTheme() {
  applyTheme(currentTheme());
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
    if (!toggle) return;
    const update = () => {
      const dark = document.documentElement.classList.contains('dark');
      toggle.setAttribute('aria-pressed', String(dark));
    };
    update();
    toggle.addEventListener('click', () => {
      const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      localStorage.setItem(KEY, next);
      applyTheme(next);
      update();
    });
  });
}
