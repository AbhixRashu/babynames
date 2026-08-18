import type { BabyName } from './types';

const KEY = 'babynames.shortlist';

export function getShortlist(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function isSaved(name: string): boolean {
  return getShortlist().includes(name);
}

export function toggleSaved(name: string): boolean {
  const list = getShortlist();
  const idx = list.indexOf(name);
  if (idx >= 0) {
    list.splice(idx, 1);
    save(list);
    return false;
  }
  list.push(name);
  save(list);
  return true;
}

export function removeSaved(name: string): void {
  const list = getShortlist().filter((n) => n !== name);
  save(list);
}

export function clearShortlist(): void {
  save([]);
}

export function shortlistNames(all: BabyName[]): BabyName[] {
  const byNameMap = new Map<string, BabyName>();
  for (const n of all) byNameMap.set(n.name.toLowerCase(), n);
  const result: BabyName[] = [];
  for (const name of getShortlist()) {
    const match = byNameMap.get(name.toLowerCase());
    if (match) result.push(match);
  }
  return result;
}

function save(list: string[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

export const STORAGE_KEY = KEY;
