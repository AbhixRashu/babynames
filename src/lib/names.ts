import type { BabyName } from './types';
import type { Rashi } from './rashi';
import { RASHI_OPTIONS } from './rashi';
import hinduNames from '../data/hindu-names.json';
import muslimNames from '../data/muslim-names.json';
import christianNames from '../data/christian-names.json';
import sikhNames from '../data/sikh-names.json';
import westernNames from '../data/western-names.json';
import otherNames from '../data/other-names.json';

export const NAMES: BabyName[] = [
  ...(hinduNames as BabyName[]),
  ...(muslimNames as BabyName[]),
  ...(christianNames as BabyName[]),
  ...(sikhNames as BabyName[]),
  ...(westernNames as BabyName[]),
  ...(otherNames as BabyName[]),
];

export const RASHIS = ['All rashis', ...RASHI_OPTIONS.map((r) => r.label)] as const;

export const MUSLIM_CATEGORIES = [
  'All categories',
  'Names of Allah',
  'Prophet Names',
  'Quranic Names',
  'Arabic Meaning',
] as const;

export const VIBES = [
  'Modern',
  'Classic/Traditional',
  'Popular',
  'Unique/Rare',
  'Royal/Elegant',
  'Nature-inspired',
  'Short & Simple',
] as const;

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
  rashi: string;
  category: string;
  vibes: string[];
}

export const EMPTY_FILTER: FilterState = {
  gender: 'all',
  origin: 'All origins',
  letter: '',
  query: '',
  style: 'All styles',
  rashi: 'All rashis',
  category: 'All categories',
  vibes: [],
};

export function filterNames(names: BabyName[], f: FilterState): BabyName[] {
  const q = f.query.trim().toLowerCase();
  return names.filter((n) => {
    if (f.gender !== 'all' && n.gender !== f.gender) return false;
    if (f.origin !== 'All origins' && n.origin !== f.origin) return false;
    if (f.style !== 'All styles' && n.style !== f.style) return false;
    if (f.letter && n.name.charAt(0).toUpperCase() !== f.letter) return false;
    if (f.rashi !== 'All rashis' && n.rashi !== f.rashi) return false;
    if (f.category !== 'All categories' && n.category !== f.category) return false;
    if (f.vibes.length && !f.vibes.every((v) => n.vibes?.includes(v as never))) return false;
    if (q) {
      const hay = `${n.name} ${n.meaning} ${n.origin}`.toLowerCase();
      if (!q.split(/\s+/).every((word) => hay.includes(word))) return false;
    }
    return true;
  });
}

export function rashiLabel(rashi: string): string {
  return RASHI_OPTIONS.find((r) => r.value === rashi)?.label ?? rashi;
}

export function rashiOf(name: BabyName): Rashi | undefined {
  return name.rashi;
}

export interface FilterResult {
  names: BabyName[];
  total: number;
  relaxed: string[];
}

const MIN_RESULTS = 12;

export function matchWithFallback(names: BabyName[], f: FilterState, min = MIN_RESULTS): FilterResult {
  const strict = filterNames(names, f);
  if (strict.length >= min || !f.vibes.length && !f.letter && f.style === EMPTY_FILTER.style) {
    return { names: strict, total: strict.length, relaxed: [] };
  }

  const relaxed: string[] = [];
  const attempt = (partial: Partial<FilterState>): BabyName[] => {
    return filterNames(names, { ...f, ...partial });
  };

  if (f.vibes.length) {
    const n = attempt({ vibes: [] });
    if (n.length >= min) return { names: n, total: strict.length, relaxed: ['vibe'] };
    relaxed.push('vibe');
  }
  if (f.style !== EMPTY_FILTER.style) {
    const n = attempt({ vibes: [], style: EMPTY_FILTER.style });
    if (n.length >= min) return { names: n, total: strict.length, relaxed: [...relaxed, 'style'] };
    relaxed.push('style');
  }
  if (f.letter) {
    const n = attempt({ vibes: [], style: EMPTY_FILTER.style, letter: '' });
    if (n.length >= min) return { names: n, total: strict.length, relaxed: [...relaxed, 'letter'] };
    relaxed.push('letter');
  }
  const n = attempt({ vibes: [], style: EMPTY_FILTER.style, letter: '', rashi: EMPTY_FILTER.rashi, category: EMPTY_FILTER.category });
  return { names: n, total: strict.length, relaxed: [...relaxed, 'filters'] };
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
