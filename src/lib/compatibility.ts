export interface CompatibilityResult {
  score: number;
  label: string;
  summary: string;
  factors: { name: string; points: number; max: number; note: string }[];
}

const VOWELS = 'aeiouy';

function normalized(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
}

function rhythmScore(a: string, b: string): number {
  // syllable-length balance & alternation
  const sa = syllables(a);
  const sb = syllables(b);
  const total = sa + sb;
  let score = 0;
  if (total <= 6) score += 3;
  else if (total <= 9) score += 2;
  const diff = Math.abs(sa - sb);
  if (diff <= 1) score += 3;
  else if (diff <= 2) score += 1;
  return score;
}

function syllables(s: string): number {
  const n = normalized(s);
  if (!n) return 1;
  const groups = n.replace(/[^aeiouy]/g, ' ').trim().split(/\s+/);
  return groups.filter(Boolean).length || 1;
}

function phoneticScore(a: string, b: string): number {
  // shared sounds + ending/starting blend
  const na = normalized(a);
  const nb = normalized(b);
  const setA = new Set(na);
  const setB = new Set(nb);
  let shared = 0;
  for (const ch of setA) if (setB.has(ch)) shared++;
  const union = setA.size + setB.size;
  const overlap = union ? shared / union : 0;
  let score = Math.round(overlap * 4);

  const lastA = na.charAt(na.length - 1);
  const firstB = nb.charAt(0);
  if (lastA === firstB) score += 2;
  else if (VOWELS.includes(lastA) === VOWELS.includes(firstB)) score += 1;
  else score += 2;
  return score;
}

function endingScore(a: string, b: string): number {
  const na = normalized(a);
  const nb = normalized(b);
  const endA = na.slice(-2);
  const endB = nb.slice(-2);
  if (endA === endB) return 2;
  if (na.endsWith('a') && nb.endsWith('a')) return 1;
  if (na.endsWith('n') && nb.endsWith('n')) return 1;
  return 0;
}

function initialScore(a: string, b: string): number {
  const ia = normalized(a).charAt(0);
  const ib = normalized(b).charAt(0);
  if (ia === ib) return 1;
  return 0;
}

export function checkCompatibility(nameA: string, nameB: string): CompatibilityResult {
  const a = nameA.trim();
  const b = nameB.trim();
  const rhythm = rhythmScore(a, b);
  const harmony = phoneticScore(a, b);
  const ending = endingScore(a, b);
  const initial = initialScore(a, b);
  const max = 15;
  const raw = rhythm + harmony + ending + initial;
  const score = Math.max(0, Math.min(100, Math.round((raw / max) * 100)));
  const factors = [
    {
      name: 'Rhythm & flow',
      points: rhythm,
      max: 6,
      note: flowNote(rhythm),
    },
    {
      name: 'Sound harmony',
      points: harmony,
      max: 6,
      note: harmonyNote(harmony),
    },
    {
      name: 'Ending blend',
      points: ending,
      max: 2,
      note: endingNote(ending),
    },
    {
      name: 'Initial rhythm',
      points: initial,
      max: 1,
      note: initialNote(initial),
    },
  ];
  let label: string;
  if (score >= 85) label = 'Perfect match';
  else if (score >= 70) label = 'Great fit';
  else if (score >= 50) label = 'Nice pairing';
  else if (score >= 35) label = 'Decent';
  else label = 'Hmm…';

  const summary = pickSummary(score, label);
  return { score, label, summary, factors };
}

function flowNote(p: number): string {
  if (p >= 6) return 'Beautiful balance — they roll off the tongue together.';
  if (p >= 4) return 'Nice rhythm, an easy and natural pairing.';
  if (p >= 2) return 'A solid, steady rhythm between the two.';
  return 'Rhythm is a little off — one carries more weight than the other.';
}

function harmonyNote(p: number): string {
  if (p >= 5) return 'They share a warm, familiar sound family.';
  if (p >= 3) return 'Sounds complement each other nicely.';
  if (p >= 2) return 'Decent overlap — they fit, with a touch of contrast.';
  return 'Very different sound worlds — great if you want contrast.';
}

function endingNote(p: number): string {
  if (p >= 2) return 'Matching endings give them a satisfying, cohesive feel.';
  if (p >= 1) return 'Softer endings make the pair feel gentle and melodic.';
  return 'Contrasting endings add a bit of punch and distinction.';
}

function initialNote(p: number): string {
  if (p >= 1) return 'Same first letter gives a charming alliterative link.';
  return 'Different initials keep each name clear and distinct.';
}

function pickSummary(score: number, label: string): string {
  if (score >= 85) {
    return 'These two were made for each other — a pairing with effortless harmony that sounds warm, balanced and memorable.';
  }
  if (score >= 70) {
    return 'A genuinely lovely pairing. The names flow well together with just enough contrast to keep things interesting.';
  }
  if (score >= 50) {
    return 'A comfortable, pleasant pairing. It might not be love at first sound, but it grows on you quickly.';
  }
  if (score >= 35) {
    return 'A workable combo with a few rough edges. They’re distinct, though some ears may find them a little clunky together.';
  }
  return `An adventurous pairing — very different sounds, but that contrast can be exactly the point. ${label === 'Hmm…' ? 'Try swapping the order or a middle name!' : ''}`;
}
