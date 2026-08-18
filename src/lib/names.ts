import type { BabyName } from './types';
import rawNames from '../data/names.json';

export const NAMES: BabyName[] = rawNames as BabyName[];

export const ORIGINS = [
  'All origins',
  'Hindu',
  'Muslim',
  'Christian',
  'Sikh',
  'Western',
  'Greek',
  'Latin',
  'Hebrew',
  'Irish',
  'Celtic',
  'Scottish',
  'French',
  'Italian',
  'Spanish',
  'German',
  'Scandinavian',
  'Persian',
  'Japanese',
  'African',
  'Hawaiian',
  'Indian',
] as const;

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const STYLES = [
  'All styles',
  'Classic',
  'Modern',
  'Old Fashioned',
  'Trendy',
  'Unique',
] as const;

export interface FilterState {
  gender: 'all' | 'boy' | 'girl' | 'unisex';
  origin: string;
  letter: string;
  query: string;
  style: string;
}

export const EMPTY_FILTER: FilterState = {
  gender: 'all',
  origin: 'All origins',
  letter: '',
  query: '',
  style: 'All styles',
};

export function filterNames(names: BabyName[], f: FilterState): BabyName[] {
  const q = f.query.trim().toLowerCase();
  return names.filter((n) => {
    if (f.gender !== 'all' && n.gender !== f.gender) return false;
    if (f.origin !== 'All origins' && n.origin !== f.origin) return false;
    if (f.style !== 'All styles' && n.style !== f.style) return false;
    if (f.letter && n.name.charAt(0).toUpperCase() !== f.letter) return false;
    if (q) {
      const hay = `${n.name} ${n.meaning} ${n.origin}`.toLowerCase();
      if (!q.split(/\s+/).every((word) => hay.includes(word))) return false;
    }
    return true;
  });
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickBatch(names: BabyName[], size: number, exclude: string[] = []): BabyName[] {
  const pool = exclude.length ? names.filter((n) => !exclude.includes(n.name)) : names;
  return shuffle(pool).slice(0, size);
}

export function byName(name: string): BabyName | undefined {
  const key = name.toLowerCase();
  return NAMES.find((n) => n.name.toLowerCase() === key);
}

export function similarNames(name: BabyName, count = 6): BabyName[] {
  const words = name.meaning.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3);
  const scored = NAMES.filter((n) => n.name !== name.name)
    .map((n) => {
      let score = 0;
      if (n.origin === name.origin) score += 3;
      if (n.gender === name.gender) score += 1;
      if (n.name.charAt(0).toUpperCase() === name.name.charAt(0).toUpperCase()) score += 2;
      const text = `${n.name} ${n.meaning}`.toLowerCase();
      for (const w of words) {
        if (text.includes(w)) score += 4;
      }
      return { n, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((x) => x.n);
}

export function originCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const n of NAMES) counts[n.origin] = (counts[n.origin] || 0) + 1;
  return counts;
}
