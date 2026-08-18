import { NAMES } from './names';
import type { BabyName } from './types';

export const SITE_URL = 'https://babynames.salarypitcher.com';

export interface Crumb {
  label: string;
  href: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

const TRENDING_RANK = new Map<string, number>([
  ['Aarav/boy', 1], ['Aadhya/girl', 2], ['Vihaan/boy', 3], ['Ananya/girl', 4],
  ['Ayaan/boy', 5], ['Aaradhya/girl', 6], ['Arjun/boy', 7], ['Diya/girl', 8],
  ['Ahmed/boy', 9], ['Aisha/girl', 10], ['Noah/boy', 11], ['Emma/girl', 12],
  ['Liam/boy', 13], ['Olivia/girl', 14], ['Ethan/boy', 15], ['Sophia/girl', 16],
  ['Ibrahim/boy', 17], ['Fatima/girl', 18], ['Reyansh/boy', 19], ['Myra/girl', 20],
  ['Krishna/boy', 21], ['Anaya/girl', 22], ['Arnav/boy', 23], ['Ishita/girl', 24],
  ['Veer/boy', 25], ['Kavya/girl', 26], ['Kabir/boy', 27], ['Meera/girl', 28],
  ['Hamza/boy', 29], ['Zara/girl', 30], ['Yusuf/boy', 31], ['Maryam/girl', 32],
  ['Ryan/boy', 33], ['Ava/girl', 34], ['James/boy', 35], ['Mia/girl', 36],
  ['John/boy', 37], ['Amelia/girl', 38], ['Daniel/boy', 39], ['Charlotte/girl', 40],
  ['Gabriel/boy', 41], ['Harper/girl', 42], ['Elijah/boy', 43], ['Evelyn/girl', 44],
  ['David/boy', 45], ['Isabella/girl', 46], ['Samuel/boy', 47], ['Luna/girl', 48],
  ['Joseph/boy', 49], ['Nova/girl', 50], ['Luke/boy', 51], ['Avery/girl', 52],
  ['Leo/boy', 53], ['Zoya/girl', 54], ['Karan/boy', 55], ['Simran/girl', 56],
  ['Gurpreet/boy', 57], ['Harleen/girl', 58], ['Yuvraj/boy', 59], ['Jasleen/girl', 60],
  ['Taranjit/boy', 61], ['Kiran/girl', 62], ['Navdeep/boy', 63], ['Prabhleen/girl', 64],
  ['Kai/boy', 65], ['Aria/girl', 66], ['Skyler/boy', 67], ['Skylar/girl', 68],
  ['Alexander/boy', 69], ['Alexa/girl', 70], ['Omar/boy', 71], ['Sana/girl', 72],
  ['Hassan/boy', 73], ['Zainab/girl', 74], ['Abdullah/boy', 75], ['Ruhi/girl', 76],
  ['Ali/boy', 77], ['Tanvi/girl', 78], ['Amir/boy', 79], ['Navya/girl', 80],
  ['Rizwan/boy', 81], ['Pihu/girl', 82], ['Sai/boy', 83], ['Aditi/girl', 84],
  ['Vivaan/boy', 85], ['Pari/girl', 86], ['Rivaan/boy', 87], ['Samaira/girl', 88],
  ['Skyler/unisex', 89], ['Avery/unisex', 90], ['Kai/unisex', 91], ['Sage/unisex', 92],
  ['Riley/unisex', 93], ['Jordan/unisex', 94], ['Alexis/unisex', 95], ['Morgan/unisex', 96],
  ['Samar/unisex', 97], ['Noor/unisex', 98], ['Rizwan/unisex', 99], ['Tanvi/unisex', 100],
  ['Navya/unisex', 101], ['Vaishnavi/unisex', 102], ['Casey/unisex', 103], ['Taylor/unisex', 104],
]);

export function byRank(names: BabyName[], limit: number): BabyName[] {
  const seen = new Set<string>();
  return [...names]
    .sort((a, b) => (TRENDING_RANK.get(`${a.name}/${a.gender}`) ?? 99999) - (TRENDING_RANK.get(`${b.name}/${b.gender}`) ?? 99999))
    .filter((n) => {
      const key = `${n.name}/${n.gender}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

export function genderCounts(names: BabyName[]): Record<string, number> {
  return {
    boy: names.filter((n) => n.gender === 'boy').length,
    girl: names.filter((n) => n.gender === 'girl').length,
    unisex: names.filter((n) => n.gender === 'unisex').length,
  };
}

export function namesByLetter(letter: string): BabyName[] {
  const l = letter.toUpperCase();
  return NAMES.filter((n) => n.name.charAt(0).toUpperCase() === l);
}

export function namesByOrigin(origin: string): BabyName[] {
  return NAMES.filter((n) => n.origin === origin);
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export interface Theme {
  slug: string;
  label: string;
  keywords: string[];
  blurb: string;
}

export const THEMES: Theme[] = [
  {
    slug: 'love',
    label: 'Love',
    keywords: ['love', 'beloved', 'loved', 'dear', 'affection', 'loving', 'amity', 'friendly'],
    blurb:
      'Names rooted in affection and devotion — beloved, loving and tender choices drawn from every culture and tradition.',
  },
  {
    slug: 'strength',
    label: 'Strength',
    keywords: ['strength', 'strong', 'power', 'powerful', 'mighty', 'stalwart', 'valiant'],
    blurb:
      'Powerful names that mean strength, power or might — bold and confident picks for a resilient child.',
  },
  {
    slug: 'light',
    label: 'Light',
    keywords: ['light', 'bright', 'shine', 'shining', 'luminous', 'radiant', 'sun', 'moon', 'star', 'glow', 'dawn'],
    blurb:
      'Names that mean light, bright, sunshine or star — radiant and hopeful choices that sparkle in any language.',
  },
  {
    slug: 'beauty',
    label: 'Beauty',
    keywords: ['beautiful', 'beauty', 'pretty', 'lovely', 'fair', 'charming', 'handsome', 'gorgeous'],
    blurb:
      'Elegant names that mean beautiful, lovely or fair — graceful picks with timeless, gentle appeal.',
  },
  {
    slug: 'peace',
    label: 'Peace',
    keywords: ['peace', 'calm', 'serene', 'tranquil', 'quiet', 'peaceful', 'still'],
    blurb:
      'Soothing names that mean peace, calm or serenity — gentle and balanced choices for a contented spirit.',
  },
  {
    slug: 'wisdom',
    label: 'Wisdom',
    keywords: ['wisdom', 'wise', 'intelligent', 'learned', 'knowledge', 'knowing', 'thoughtful'],
    blurb:
      'Thoughtful names that mean wisdom or intelligence — classic picks with depth, insight and quiet brilliance.',
  },
  {
    slug: 'brave',
    label: 'Brave',
    keywords: ['brave', 'courage', 'bold', 'fearless', 'courageous', 'daring', 'intrepid'],
    blurb:
      'Courageous names that mean brave or fearless — adventurous choices full of spirit and determination.',
  },
  {
    slug: 'happiness',
    label: 'Happiness',
    keywords: ['happy', 'joy', 'happiness', 'delight', 'cheerful', 'bliss', 'joyful', 'glad', 'merry', 'rejoice'],
    blurb:
      'Joyful names that mean happiness or delight — sunny and uplifting picks that celebrate the little things.',
  },
  {
    slug: 'grace',
    label: 'Grace',
    keywords: ['grace', 'gracious', 'kind', 'kindness', 'blessing', 'gentle', 'charming'],
    blurb:
      'Elegant names that mean grace or blessing — refined, warm and kindly choices with classic poise.',
  },
  {
    slug: 'hope',
    label: 'Hope',
    keywords: ['hope', 'faith', 'wish', 'aspiration', 'expectation', 'believe'],
    blurb:
      'Hopeful names that mean hope or faith — optimistic and uplifting choices for a bright future.',
  },
  {
    slug: 'nature',
    label: 'Nature',
    keywords: [
      'flower',
      'rose',
      'tree',
      'earth',
      'water',
      'ocean',
      'sea',
      'sky',
      'forest',
      'river',
      'mountain',
      'star',
      'sun',
      'moon',
      'bird',
      'nature',
      'dawn',
      'lake',
      'jasmine',
      'lotus',
      'breeze',
    ],
    blurb:
      'Nature names drawn from flowers, rivers, stars, oceans and the earth itself — earthy, organic and endlessly varied.',
  },
  {
    slug: 'royal',
    label: 'Royal',
    keywords: ['royal', 'king', 'queen', 'prince', 'princess', 'emperor', 'ruler', 'majestic', 'crown', 'noble', 'throne', 'regal'],
    blurb:
      'Majestic names that mean king, queen, royal or noble — regal and striking choices with an air of authority.',
  },
  {
    slug: 'divine',
    label: 'Divine',
    keywords: ['god', 'divine', 'holy', 'blessed', 'sacred', 'goddess', 'heavenly', 'angel', 'devotion', 'prayer'],
    blurb:
      'Sacred names that mean god, divine, holy or blessed — spiritual choices rich with meaning and faith.',
  },
  {
    slug: 'warrior',
    label: 'Warrior',
    keywords: ['warrior', 'fighter', 'soldier', 'hero', 'battle', 'victory', 'champion', 'victorious', 'strong'],
    blurb:
      'Strong names that mean warrior, fighter or victorious — powerful, determined choices for a born leader.',
  },
];

export function namesByTheme(slug: string): BabyName[] {
  const t = THEMES.find((x) => x.slug === slug);
  if (!t) return [];
  return NAMES.filter((n) => {
    const m = n.meaning.toLowerCase();
    return t.keywords.some((k) => m.includes(k));
  });
}

export const ORIGINS_IN_DATA: string[] = [...new Set(NAMES.map((n) => n.origin))].sort((a, b) =>
  a.localeCompare(b),
);

export interface OriginInfo {
  origin: string;
  blurb: string;
}

export const ORIGIN_INFO: Record<string, string> = {
  Hindu:
    'Hindu names come from Sanskrit and the great Indian traditions, carrying meanings tied to gods, virtues, nature and the stars. From timeless classics like Aarav and Aaradhya to modern picks like Vivaan and Myra, these names are chosen with meaning at heart.',
  Muslim:
    'Muslim names trace back to Arabic and the Islamic tradition, including names of Allah, prophets and Quranic figures. Beautiful names like Muhammad, Zain, Aaliyah and Zainab carry deep spiritual meaning and elegant sound.',
  Christian:
    'Christian names are drawn from the Bible and the lives of saints — classic names like David, Michael, Noah, Grace and Mary that have been loved for generations in the West and beyond.',
  Sikh:
    'Sikh names celebrate devotion, unity and spiritual ideals, often sharing roots with the Punjabi and Sanskrit traditions. Names like Harman, Gurleen, Arjun and Simran carry powerful meanings of faith and strength.',
  Western:
    'Western names span English and modern European favourites — Amelia, Charlotte, Evelyn, Henry and Jack. These are the friendly, timeless names heard in classrooms and playgrounds across the English-speaking world.',
  Greek:
    'Greek names come from the language of philosophy, mythology and the stars. Names like Alexander, Helen, Daphne and Zoe carry the weight of ancient heroes, gods and timeless virtues.',
  Latin:
    'Latin names echo ancient Rome and the roots of the romance languages. Names like Marcus, Aurelia, Julius and Clara feel classic, strong and enduring.',
  Hebrew:
    'Hebrew names come from the language of the Bible — names like Noah, Elijah, Hannah, Sarah and Abigail, rich with faith and scriptural meaning.',
  Irish:
    'Irish names from the Gaelic tradition are lyrical and full of charm — names like Liam, Aisling, Cian and Saoirse carry beautiful meanings and a strong cultural identity.',
  Celtic:
    'Celtic names from the Gaelic and Brythonic traditions carry ancient wisdom and natural beauty — names like Aiden, Brianna, Finley and Rowan, loved far beyond their homeland.',
  Scottish:
    'Scottish names from the Gaelic north — names like Angus, Fiona, Eilidh and Cameron — carry Highland character, clan heritage and natural ruggedness.',
  French:
    'French names are effortlessly elegant — names like Camille, Étienne, Chloé and Adèle carry a certain je ne sais quoi loved by parents worldwide.',
  Italian:
    'Italian names are melodic and romantic — names like Alessandro, Giulia, Marco and Sofia carry the warmth and style of Italy.',
  Spanish:
    'Spanish names are warm, rhythmic and widely loved — names like Mateo, Isabella, Santiago and Lucia travel beautifully across cultures.',
  German:
    'German names are strong and dependable — names like Friedrich, Amelie, Heinrich and Lina carry a solid, no-nonsense charm.',
  Scandinavian:
    'Scandinavian names are fresh, clean and modern — names like Astrid, Freya, Axel and Elsa from the Nordic tradition carry a cool simplicity.',
  Persian:
    'Persian names from the Iranian tradition are poetic and melodic — names like Cyrus, Laleh, Darius and Parisa carry ancient elegance and deep meaning.',
  Japanese:
    'Japanese names are delicate and meaningful, often built from kanji characters tied to nature and virtue — names like Haru, Aiko, Ren and Yuki.',
  African:
    'African names from across the continent carry powerful meaning and heritage — names like Kofi, Amara, Zuri and Kwame reflect community, strength and beauty.',
  Hawaiian:
    'Hawaiian names are soft, musical and tied to the land and sea — names like Kai, Leilani, Nalu and Koa carry island warmth and natural grace.',
  Indian:
    'Indian names reflect the incredible diversity of the subcontinent — Sanskrit, regional and modern blends — names like Advik, Ananya, Ishaan and Diya loved across generations.',
};

export function originInfo(origin: string): string {
  return ORIGIN_INFO[origin] ?? `${origin} names from a rich and beloved naming tradition, full of beautiful meanings.`;
}

export function crumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: `${SITE_URL}${c.href}`,
    })),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function itemListSchema(items: BabyName[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((n, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: n.name,
      description: `${n.name} means "${n.meaning}" — a ${n.gender} name of ${n.origin} origin.`,
    })),
  };
}

export const HOME_CRUMB: Crumb = { label: 'Home', href: '/' };
