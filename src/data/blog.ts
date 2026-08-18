import { NAMES } from '../lib/names';
import { rashiFromName, RASHI_OPTIONS } from '../lib/rashi';
import type { BabyName } from '../lib/types';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; caption?: string; headers: string[]; rows: string[][] }
  | { type: 'cta'; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  updatedDate: string;
  readingMinutes: number;
  blocks: Block[];
}

const byRank = (arr: BabyName[], n: number): BabyName[] =>
  [...arr].sort((a, b) => (a.rank ?? 99999) - (b.rank ?? 99999)).slice(0, n);

const uniqueRare = NAMES.filter((n) => n.vibes?.includes('Unique/Rare'));

function table(headers: string[], names: BabyName[]): Block {
  return {
    type: 'table',
    headers,
    rows: names.map((n) => [n.name, n.meaning, n.origin, n.gender]),
  };
}

function zodiacTable(sign: string): Block {
  const opt = RASHI_OPTIONS.find((r) => r.sign === sign)!;
  const names = NAMES.filter((n) => rashiFromName(n.name) === opt.value);
  return table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(names, 14));
}

export const POSTS: BlogPost[] = [
  {
    slug: 'unique-baby-names-2026',
    title: '500+ Unique Baby Names for 2026 with Meanings and Origins',
    description:
      'Discover 500+ unique baby names for 2026 with meanings and origins, organised by category. Rare, fresh and beautiful ideas for boys, girls and unisex — free.',
    pubDate: '2026-01-05',
    updatedDate: '2026-08-18',
    readingMinutes: 14,
    blocks: [
      { type: 'p', text: 'Every year, the same names climb the popularity charts — and every year, more parents search for something a little different. If you want a name your child will rarely meet in class but will never have to explain, this guide is for you. Below you will find over 500 unique baby names for 2026, drawn from our full database, each with its meaning and origin. We have organised them by gender and category so you can skim quickly and shortlist the ones that click.' },
      { type: 'h2', text: 'What makes a baby name unique in 2026?' },
      { type: 'p', text: 'A unique name is simply a name that very few children currently carry. Uniqueness is not the same as weirdness: the best unique names are recognisable, pronounceable and carry a meaning you are proud of. In our database, unique and rare names are flagged with a "Unique/Rare" vibe — more than 1,500 of the names here qualify, so you have genuinely hundreds of options to choose from rather than a handful of novelty picks.' },
      { type: 'p', text: 'The sweet spot for most parents is a name that is uncommon but not unfamiliar: easy to say, easy to spell, and still fresh enough to feel special. The lists below lean that way. You can explore even more options on the [[full unique baby name generator|/]], or browse [[names by origin|/names/origin]] and [[names by meaning|/names/meaning]] for different angles.' },
      { type: 'h2', text: 'Unique baby boy names for 2026' },
      { type: 'p', text: 'These boy names pair rarity with strength. Each one comes from a real tradition with a real meaning, so you are not trading substance for novelty.' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(uniqueRare.filter((n) => n.gender === 'boy'), 40)),
      { type: 'h2', text: 'Unique baby girl names for 2026' },
      { type: 'p', text: 'For girls, unique names often mix elegance with unexpected sounds — soft and graceful in meaning, distinctive in use.' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(uniqueRare.filter((n) => n.gender === 'girl'), 40)),
      { type: 'h2', text: 'Unique unisex names for 2026' },
      { type: 'p', text: 'Gender-neutral names remain one of the fastest-growing naming styles, and the rarest of them feel wonderfully modern. Here are distinctive unisex picks with real staying power.' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(uniqueRare.filter((n) => n.gender === 'unisex'), 24)),
      { type: 'h2', text: 'Unique names by origin' },
      { type: 'p', text: 'Sometimes the most unique name is simply one from a tradition you have not explored yet. Jump into [[names by origin|/names/origin]] to find hundreds of rare gems with authentic meanings — Hindu, Muslim, Christian, Greek, Japanese, African, Hawaiian and Persian traditions.' },
      { type: 'p', text: 'A note of caution: a name that is rare in one culture can be completely ordinary in another — and vice versa. That is a feature, not a bug. If you love a name because of its meaning and its sound, its popularity anywhere else matters very little.' },
      { type: 'h2', text: 'Tips for choosing a unique name that stands out for the right reasons' },
      { type: 'ul', items: [
        'Say it out loud ten times with your surname. Unique names need to survive the school register, not just the birth announcement.',
        'Test the spelling. If you will spend your life correcting people, make sure you are willing to pay that price.',
        'Check the nickname it creates. A unique full name often comes with a perfectly normal short form — make sure you love both.',
        'Look up the meaning. Uniqueness fades, but a meaning you love lasts a lifetime.',
        'Compare with the compatibility checker — a rare first name still has to flow with your middle name, surname and any siblings.',
      ] },
      { type: 'h2', text: 'How to check whether a name is actually unique' },
      { type: 'p', text: 'Popularity rankings change every year, and a name that feels rare today can jump the charts tomorrow. In our database, every name card shows a popularity rank — the higher the number, the rarer the name. Use the [[generator|/]], sort through the results and look for names with high ranks or no rank at all to find genuinely rare picks. Then trust your gut: if a name keeps floating back to the top of your shortlist, that is usually your answer.' },
      { type: 'cta', text: 'Ready to find your unique name? Open the free baby name generator and filter by gender, origin and meaning — then save your favourites to your shortlist.' },
    ],
  },
  {
    slug: 'how-to-choose-baby-name',
    title: 'How to Choose the Perfect Baby Name — Complete Guide',
    description:
      'A complete guide to choosing a baby name: meaning, sound, family traditions, numerology, initials, nicknames and practical tips to help you decide — free.',
    pubDate: '2026-01-12',
    updatedDate: '2026-08-18',
    readingMinutes: 12,
    blocks: [
      { type: 'p', text: 'Choosing a baby name is one of the first big decisions you will make as a parent — and it can feel like the stakes are enormous. The good news: there is no single perfect name. There are dozens of names that would suit your child beautifully, and your job is simply to find the ones that feel like yours. This guide walks you through every factor worth considering, in the order most parents find useful, so you can narrow thousands of options down to a shortlist you trust.' },
      { type: 'h2', text: 'Start with meaning' },
      { type: 'p', text: 'Meaning is where most naming journeys begin, because it is the part that lasts. A name meaning strength, light, peace, love, wisdom or grace carries a quiet message you hand to your child every time they introduce themselves. Start by listing a handful of qualities you hope your child will carry — then [[search names by meaning|/names/meaning]] and collect the ones that resonate.' },
      { type: 'h2', text: 'Test how it sounds' },
      { type: 'p', text: 'A name can look perfect on paper and fall flat out loud. Say each candidate out loud with your surname, your child\'s potential middle name, and a couple of sibling names. Write it down and read it back. Imagine calling it across a playground and saying it at a graduation ceremony. Good names work in both settings. If you have a favourite, try the [[compatibility checker|/#compatibility]] to score how it flows with a surname or sibling name.' },
      { type: 'h2', text: 'Honour family and culture' },
      { type: 'p', text: 'Many parents feel pulled between tradition and originality. You can honour a grandparent with a middle name, use a modern form of a classic family name, or simply choose a name from the same origin or religion. Browsing [[names by origin|/names/origin]] keeps cultural meaning intact while still giving you a huge range of choices — Hindu, Muslim, Christian, Sikh, Greek, Latin, Hebrew, Japanese and more.' },
      { type: 'h2', text: 'Check the initials — and the nickname' },
      { type: 'ul', items: [
        'Initials: write out the full name and make sure the initials do not spell something you will both regret.',
        'Nicknames: if you will shorten the name, make sure you love the short form too — it will be used far more than the full name.',
        'Rhymes: say it with your surname a few times to catch accidental rhymes or awkward collisions.',
        'Spelling: choose a spelling you will not have to repeat on every single phone call.',
      ] },
      { type: 'h2', text: 'Numerology for baby names' },
      { type: 'p', text: 'Numerology assigns a number to a name by converting letters to numbers, adding them up and reducing to a single digit. Each number carries traditional traits: 1 is independent and a born leader, 2 is cooperative and peace-loving, 3 is creative and expressive, 4 is steady and practical, 5 is adventurous, 6 is caring and responsible, 7 is analytical and spiritual, 8 is ambitious and powerful, 9 is compassionate and generous. Some parents use the name number to match the traits they hope for; others use it to complement the family\'s favourite numbers. It is one lens among many — useful for reflection, not a verdict.' },
      { type: 'h2', text: 'Consider popularity — deliberately' },
      { type: 'p', text: 'Popularity is neither good nor bad; it is a preference. Some parents love that their child\'s name is shared with classmates — it feels friendly and familiar. Others want rarity. The [[generator|/]] shows a popularity rank on every name card, and the [[trending names page|/trending-baby-names-2026]] shows what parents are choosing right now, so you can decide with the numbers in front of you instead of guessing.' },
      { type: 'h2', text: 'Build a shortlist and let it breathe' },
      { type: 'p', text: 'Generate a shortlist of ten to fifteen candidates, save them, then walk away for a couple of days. Names you love will keep floating back to the top; ones you only liked will quietly fade. Delete ruthlessly. When two names are left, try saying each one with a middle name and a surname out loud, once more, before deciding. If you are still stuck, remember: most parents report that once the decision is made and the baby arrives, the name becomes simply right.' },
      { type: 'cta', text: 'Start building your shortlist now with the free baby name generator — filter by meaning, origin, letter and rashi, save favourites and compare compatibility.' },
    ],
  },
  {
    slug: 'trending-baby-names',
    title: 'Top 100 Trending Baby Names This Month',
    description:
      'The top 100 trending baby names this month, with meanings and origins. See the hottest boy, girl and unisex names, spot rising stars and find your favourite — free.',
    pubDate: '2026-02-02',
    updatedDate: '2026-08-18',
    readingMinutes: 9,
    blocks: [
      { type: 'p', text: 'Parents choose names in waves. A single movie, a celebrity baby, or simply a generation rediscovering an old classic can send a name climbing the charts. This page collects the top 100 baby names across our database right now — the most popular boy names, girl names and unisex names, each with its meaning and origin — so you can see the full picture at a glance.' },
      { type: 'p', text: 'A quick note on how to read the list: our popularity ranking is drawn from our curated database of names and their ranks. Treat it as a strong signal, not a prophecy. A name further down the list is not worse — it is often simply rarer, which is exactly what many parents want. See the full ranking on the [[trending baby names 2026|/trending-baby-names-2026]] page.' },
      { type: 'h2', text: 'Top 40 trending boy names' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(NAMES.filter((n) => n.gender === 'boy'), 40)),
      { type: 'h2', text: 'Top 40 trending girl names' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(NAMES.filter((n) => n.gender === 'girl'), 40)),
      { type: 'h2', text: 'Top 20 trending unisex names' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(NAMES.filter((n) => n.gender === 'unisex'), 20)),
      { type: 'h2', text: 'Why these names are trending' },
      { type: 'p', text: 'The most popular names tend to share a few traits: they are easy to pronounce in more than one language, they pair gracefully with almost any surname, and they carry a meaning parents are happy to pass on. Classic spiritual names from Hindu and Muslim traditions sit alongside Western favourites, which is a beautiful reflection of how global naming has become.' },
      { type: 'p', text: 'If you want to go deeper, explore popular names [[by origin|/names/origin]] and [[by letter|/names/starting-with]], or open the [[generator|/]] and use the starting letter filter to build your own shortlist. And if you are torn between two favourites, run them through the compatibility checker before you decide.' },
      { type: 'cta', text: 'Find your own top pick with the free baby name generator — filter thousands of names by gender, origin, letter and meaning in seconds.' },
    ],
  },
  {
    slug: 'baby-names-around-the-world',
    title: 'Beautiful Baby Names from Around the World',
    description:
      'Beautiful baby names from different cultures and countries — Indian, Japanese, African, Hawaiian, Persian, Scandinavian and more, with meanings and origins.',
    pubDate: '2026-02-16',
    updatedDate: '2026-08-18',
    readingMinutes: 11,
    blocks: [
      { type: 'p', text: 'The most beautiful names often come from traditions furthest from your own. Around the world, cultures have spent centuries perfecting the art of the name — wrapping meaning, history and a sound people love into a handful of letters. This guide tours some of the richest naming traditions, with real names, meanings and origins for each. Every culture below links to a [[full page|/names/origin]] where you can explore hundreds more.' },
      { type: 'h2', text: 'Indian names' },
      { type: 'p', text: 'Indian names draw on Sanskrit, Hindi, Tamil and dozens of regional languages. They are chosen with meaning at the centre — gods, virtues, nature and the stars — and many parents pick names by nakshatra (birth star) syllables. Explore the [[Hindu names page|/names/origin/hindu]], [[Sikh names page|/names/origin/sikh]] and [[Indian names page|/names/origin/indian]] for more.' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(NAMES.filter((n) => ['Hindu', 'Sikh', 'Indian'].includes(n.origin)), 24)),
      { type: 'h2', text: 'Arabic and Muslim names' },
      { type: 'p', text: 'Arabic names carry deep spiritual weight — names of Allah, the prophets and Quranic figures are treasured across the world. The [[full Muslim names page|/names/origin/muslim]] holds hundreds more with meanings and categories.' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(NAMES.filter((n) => n.origin === 'Muslim'), 24)),
      { type: 'h2', text: 'Japanese names' },
      { type: 'p', text: 'Japanese names are built from kanji characters, so a single name can carry layered meanings of nature, virtue and beauty. Each character is chosen deliberately, which makes every name a small poem.' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(NAMES.filter((n) => n.origin === 'Japanese'), 20)),
      { type: 'h2', text: 'African names' },
      { type: 'p', text: 'African names often carry community and circumstance — the day of the week, the family story, or a hope for the child\'s future. Explore the African names page for more.' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(NAMES.filter((n) => n.origin === 'African'), 20)),
      { type: 'h2', text: 'Hawaiian names' },
      { type: 'p', text: 'Hawaiian names are soft, musical and deeply tied to the land and sea — ocean, sky, stars and flowers. The Hawaiian names page holds the full collection.' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(NAMES.filter((n) => n.origin === 'Hawaiian'), 20)),
      { type: 'h2', text: 'Persian names' },
      { type: 'p', text: 'Persian names are poetic and melodic, drawn from a literary tradition thousands of years old. Explore the Persian names page for more.' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(NAMES.filter((n) => n.origin === 'Persian'), 20)),
      { type: 'h2', text: 'Scandinavian names' },
      { type: 'p', text: 'Scandinavian names feel clean and modern, rooted in Norse mythology and northern nature. See the full collection on the Scandinavian names page.' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(NAMES.filter((n) => n.origin === 'Scandinavian'), 20)),
      { type: 'h2', text: 'Classical: Greek, Latin and Hebrew' },
      { type: 'p', text: 'Greek, Latin and Hebrew names are the classical backbone of Western naming — mythology, empire and scripture all live inside them. Browse the Greek names, Latin names and Hebrew names pages to explore further.' },
      table(['Name', 'Meaning', 'Origin', 'Gender'], byRank(NAMES.filter((n) => ['Greek', 'Latin', 'Hebrew'].includes(n.origin)), 30)),
      { type: 'h2', text: 'How to combine traditions' },
      { type: 'p', text: 'Many parents today blend traditions: a first name from one culture and a middle name honouring another, or a name that is easily pronounced in both languages your family speaks. There is no rule that says you must stay inside one box. The [[generator|/]] makes cross-cultural searching effortless — filter by origin, then by meaning, and see what overlaps appear.' },
      { type: 'cta', text: 'Explore the whole world of names in the free generator — browse every origin, save favourites and check how different traditions sound together.' },
    ],
  },
  {
    slug: 'baby-names-by-zodiac',
    title: 'Baby Names by Zodiac Sign — What Name Suits Your Baby?',
    description:
      'Find baby names matched to every zodiac sign, with meanings and origins. Twelve signs, twelve personality guides and name ideas — free.',
    pubDate: '2026-03-03',
    updatedDate: '2026-08-18',
    readingMinutes: 13,
    blocks: [
      { type: 'p', text: 'In Vedic astrology, a baby\'s birth star and Rashi (moon sign) guide the first letter of the name — parents traditionally choose a name starting with a syllable from the child\'s nakshatra. For parents who simply love zodiac themes, matching a name to a sun sign is a fun and meaningful way to narrow the list. Below are all twelve signs with a short personality sketch and real names whose traditional Rashi matches, each with its meaning and origin.' },
      { type: 'p', text: 'How we matched the names: every name below has been assigned a Vedic Rashi from its starting syllable, and each Rashi corresponds to a zodiac sign. You can refine any of these lists further in the [[generator|/]] by choosing the matching rashi in the Rashi filter.' },
      { type: 'h2', text: 'Aries (Mesh) — 21 March to 19 April' },
      { type: 'p', text: 'Aries children are bold, energetic and born leaders. They dive in first and ask questions later, and they bring a spark of initiative to everything they touch.' },
      zodiacTable('Aries'),
      { type: 'h2', text: 'Taurus (Vrishabh) — 20 April to 20 May' },
      { type: 'p', text: 'Taurus children are steady, patient and loyal, with a love for comfort, beauty and the good things in life. They are the calm anchors of any family.' },
      zodiacTable('Taurus'),
      { type: 'h2', text: 'Gemini (Mithun) — 21 May to 20 June' },
      { type: 'p', text: 'Gemini children are quick, curious and endlessly chatty. They learn fast, adapt faster and keep everyone around them on their toes.' },
      zodiacTable('Gemini'),
      { type: 'h2', text: 'Cancer (Kark) — 21 June to 22 July' },
      { type: 'p', text: 'Cancer children are sensitive, nurturing and deeply attached to home and family. They feel everything fully and care for others instinctively.' },
      zodiacTable('Cancer'),
      { type: 'h2', text: 'Leo (Simha) — 23 July to 22 August' },
      { type: 'p', text: 'Leo children are warm, generous and naturally theatrical. They want to shine, and they usually do — with an unmistakable sense of pride and play.' },
      zodiacTable('Leo'),
      { type: 'h2', text: 'Virgo (Kanya) — 23 August to 22 September' },
      { type: 'p', text: 'Virgo children are observant, tidy and quietly brilliant. They notice details nobody else sees and take quiet pride in doing things well.' },
      zodiacTable('Virgo'),
      { type: 'h2', text: 'Libra (Tula) — 23 September to 22 October' },
      { type: 'p', text: 'Libra children are charming, fair-minded and harmony-seeking. They have an eye for beauty and an instinct for making peace.' },
      zodiacTable('Libra'),
      { type: 'h2', text: 'Scorpio (Vrishchik) — 23 October to 21 November' },
      { type: 'p', text: 'Scorpio children are intense, determined and fiercely loyal. They feel deeply, keep their own counsel and pursue whatever they love with total focus.' },
      zodiacTable('Scorpio'),
      { type: 'h2', text: 'Sagittarius (Dhanu) — 22 November to 21 December' },
      { type: 'p', text: 'Sagittarius children are optimistic, adventurous and endlessly curious about the world. They ask big questions and love wide-open spaces.' },
      zodiacTable('Sagittarius'),
      { type: 'h2', text: 'Capricorn (Makar) — 22 December to 19 January' },
      { type: 'p', text: 'Capricorn children are serious, ambitious and wonderfully dependable. They set goals early and work towards them with quiet discipline.' },
      zodiacTable('Capricorn'),
      { type: 'h2', text: 'Aquarius (Kumbh) — 20 January to 18 February' },
      { type: 'p', text: 'Aquarius children are original, independent and a little bit ahead of their time. They think in unusual ways and value their freedom fiercely.' },
      zodiacTable('Aquarius'),
      { type: 'h2', text: 'Pisces (Meen) — 19 February to 20 March' },
      { type: 'p', text: 'Pisces children are dreamy, imaginative and deeply empathetic. They feel the world softly and create beautiful inner worlds of their own.' },
      zodiacTable('Pisces'),
      { type: 'p', text: 'A final thought: whether you follow astrology strictly or treat it as a fun starting point, the best name is the one you love saying. Use these lists as inspiration, then take your favourites into the [[generator|/]] to see the full range of names for that sign\'s starting letters and rashi.' },
      { type: 'cta', text: 'Match your zodiac picks to a full shortlist in the free generator — use the rashi filter, save favourites and check how names sound together.' },
    ],
  },
];
