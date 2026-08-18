export type Rashi =
  | 'Mesh'
  | 'Vrishabh'
  | 'Mithun'
  | 'Kark'
  | 'Simha'
  | 'Kanya'
  | 'Tula'
  | 'Vrishchik'
  | 'Dhanu'
  | 'Makar'
  | 'Kumbh'
  | 'Meen';

export const RASHI_OPTIONS: { value: Rashi; label: string; sign: string }[] = [
  { value: 'Mesh', label: 'Mesh (Aries)', sign: 'Aries' },
  { value: 'Vrishabh', label: 'Vrishabh (Taurus)', sign: 'Taurus' },
  { value: 'Mithun', label: 'Mithun (Gemini)', sign: 'Gemini' },
  { value: 'Kark', label: 'Kark (Cancer)', sign: 'Cancer' },
  { value: 'Simha', label: 'Simha (Leo)', sign: 'Leo' },
  { value: 'Kanya', label: 'Kanya (Virgo)', sign: 'Virgo' },
  { value: 'Tula', label: 'Tula (Libra)', sign: 'Libra' },
  { value: 'Vrishchik', label: 'Vrishchik (Scorpio)', sign: 'Scorpio' },
  { value: 'Dhanu', label: 'Dhanu (Sagittarius)', sign: 'Sagittarius' },
  { value: 'Makar', label: 'Makar (Capricorn)', sign: 'Capricorn' },
  { value: 'Kumbh', label: 'Kumbh (Aquarius)', sign: 'Aquarius' },
  { value: 'Meen', label: 'Meen (Pisces)', sign: 'Pisces' },
];

// Traditional Vedic Rashi -> starting syllables (nakshatra pada letters).
// Overlapping syllables (a pada letter can appear in several nakshatras) are
// resolved deterministically: the first Rashi in zodiac order wins.
const RASHI_SYLLABLES: Record<Rashi, string[]> = {
  Mesh: ['chu', 'che', 'cho', 'la', 'li', 'lu', 'le', 'lo', 'a'],
  Vrishabh: ['i', 'u', 'e', 'o', 'va', 'vi', 'vu', 've', 'vo'],
  Mithun: ['ka', 'ki', 'ku', 'gha', 'nga', 'chha', 'ke', 'ko', 'ha'],
  Kark: ['hi', 'he', 'hu', 'ho', 'da', 'di', 'du', 'de', 'do'],
  Simha: ['ma', 'mi', 'mu', 'me', 'mo', 'ta', 'ti', 'tu', 'te', 'to'],
  Kanya: ['pa', 'pi', 'pu', 'sha', 'na', 'tha', 'pe', 'po', 'sa', 'ni'],
  Tula: ['ra', 'ri', 'ru', 're', 'ro'],
  Vrishchik: ['nu', 'ne', 'no', 'ya', 'yi', 'yu', 'ye', 'yo'],
  Dhanu: ['bha', 'bhi', 'bhu', 'dha', 'pha', 'bhe', 'bho'],
  Makar: ['ja', 'ji', 'ga', 'gi', 'gu', 'ge', 'go', 'gho', 'khi', 'khee', 'khu', 'khe', 'kho'],
  Kumbh: ['si', 'su', 'se', 'so'],
  Meen: ['cha', 'chi', 'jha'],
};

// Letter-level fallback used when a name's first syllable is not in the
// Vedic table (e.g. transliterations like "Shr", "Z"). Reasonable defaults.
const LETTER_TO_RASHI: Record<string, Rashi> = {
  a: 'Mesh', b: 'Dhanu', c: 'Kumbh', d: 'Kark', e: 'Vrishabh', f: 'Meen',
  g: 'Makar', h: 'Kark', i: 'Vrishabh', j: 'Makar', k: 'Mithun', l: 'Mesh',
  m: 'Simha', n: 'Vrishchik', o: 'Vrishabh', p: 'Kanya', q: 'Tula', r: 'Tula',
  s: 'Kanya', t: 'Simha', u: 'Vrishabh', v: 'Vrishabh', w: 'Mesh', x: 'Kanya',
  y: 'Vrishchik', z: 'Meen',
};

const SYLLABLE_TO_RASHI = new Map<string, Rashi>();
for (const rashi of RASHI_OPTIONS) {
  for (const syl of RASHI_SYLLABLES[rashi.value]) {
    if (!SYLLABLE_TO_RASHI.has(syl)) SYLLABLE_TO_RASHI.set(syl, rashi.value);
  }
}

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
}

export function rashiFromName(name: string): Rashi | null {
  const n = normalize(name);
  if (!n) return null;

  // Longest syllable prefix first ("chha", "khee", "bha" ... then "ka", "a").
  for (let len = 4; len >= 2; len--) {
    const syl = n.slice(0, len);
    if (syl.length === len && SYLLABLE_TO_RASHI.has(syl)) return SYLLABLE_TO_RASHI.get(syl)!;
  }

  // "sh" + vowel patterns that appear in transliterated names.
  const shVowel = n.match(/^sh([aeiou])/);
  if (shVowel) {
    const map: Record<string, Rashi> = { a: 'Kanya', e: 'Kark', i: 'Kark', o: 'Kark', u: 'Kark' };
    return map[shVowel[1]] ?? null;
  }

  if (n.startsWith('chh')) return 'Mithun';

  const letter = LETTER_TO_RASHI[n[0]];
  return letter ?? null;
}

export function rashiLabel(rashi: Rashi): string {
  return RASHI_OPTIONS.find((r) => r.value === rashi)?.label ?? rashi;
}
