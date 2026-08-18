// Enriches each name entry with a "description" (2-4 lines of rich, engaging
// text) and 1-2 "vibes" tags. Pure and deterministic: same inputs always give
// the same output, so re-running the build never changes existing entries.

const VIBES = ['Modern', 'Classic/Traditional', 'Popular', 'Unique/Rare', 'Royal/Elegant', 'Nature-inspired', 'Short & Simple'];

const ORIGIN_LANG = {
  Hindu: 'Sanskrit',
  Muslim: 'Arabic',
  Sikh: 'Punjabi',
  Christian: 'Hebrew, Greek and Latin',
  Western: 'English and Germanic',
  Greek: 'Greek',
  Latin: 'Latin',
  Hebrew: 'Hebrew',
  Irish: 'Irish Gaelic',
  Celtic: 'Celtic',
  Scottish: 'Scottish Gaelic',
  French: 'French',
  Italian: 'Italian',
  Spanish: 'Spanish',
  German: 'German',
  Scandinavian: 'Old Norse',
  Persian: 'Persian',
  Japanese: 'Japanese',
  African: 'an African language',
  Hawaiian: 'Hawaiian',
  Indian: 'Sanskrit',
};

const ORIGIN_NOTE = {
  Hindu: 'It carries deep spiritual resonance in Hindu tradition, where parents often choose a name to honour divine, natural or virtuous qualities passed down through generations.',
  Muslim: 'It carries meaningful weight in Islamic tradition and is cherished by families across the Muslim world, often chosen for the values it reflects.',
  Sikh: 'It reflects the devotion, humility and strength at the heart of Sikh faith and Punjabi heritage.',
  Christian: 'It has been treasured in Christian communities for centuries, often chosen to reflect faith, virtue and a connection to scripture.',
  Western: 'It sits comfortably in modern English-speaking families while remaining rooted in centuries of Western naming tradition.',
  Greek: 'It echoes the myths, philosophy and artistry of ancient Greece, giving it a sense of timeless depth.',
  Latin: 'It carries the dignity and eloquence of ancient Rome and classical scholarship.',
  Hebrew: 'It connects to Hebrew scripture and tradition, with a gentle spiritual weight that many families find meaningful.',
  Irish: 'It carries the warmth and story-telling charm of Ireland, where names often hold the poetry of the landscape.',
  Celtic: 'It draws on the misty legends and rich folklore of the Celtic world.',
  Scottish: 'It brings the rugged, romantic character of the Scottish highlands to mind.',
  French: 'It has the effortless elegance and romance associated with French culture.',
  Italian: 'It rolls with the musical, passionate warmth that Italian names are loved for.',
  Spanish: 'It carries the sunny warmth and expressive energy of the Spanish-speaking world.',
  German: 'It has the sturdy, dependable strength that German naming tradition is known for.',
  Scandinavian: 'It calls back to the bold, nature-loving spirit of the Nordic lands and the age of the Vikings.',
  Persian: 'It carries the lyrical poetry and refined beauty of Persian culture.',
  Japanese: 'It reflects the graceful, nature-loving sensibility of Japanese naming, where each character is chosen with care.',
  African: 'It is part of a naming heritage rich in meaning, honouring family, nature and the stories of community.',
  Hawaiian: 'It captures the gentle, flowing rhythm and natural beauty of the Hawaiian islands.',
  Indian: 'It connects to the vast, ancient naming heritage of the Indian subcontinent.',
};

const NOTABLE = {
  Aarav: 'Aarav has risen quickly through India\'s popularity charts in recent years, a favourite for parents wanting something modern yet deeply traditional.',
  Arjun: 'In Hindu tradition Arjun is the heroic archer prince of the Mahabharata, famed for his focus, skill and righteousness.',
  Krishna: 'Krishna is one of the most beloved names in Hindu culture, honouring the divine figure known for wisdom, joy and compassion.',
  Lakshmi: 'Lakshmi is the Hindu goddess of fortune, beauty and abundance, making the name a blessing of prosperity.',
  Shiva: 'Shiva is one of the principal deities of Hinduism, the great yogi and transformer of the universe.',
  Rama: 'Rama is the ideal hero king of the Ramayana, a symbol of virtue, duty and honour.',
  Ganesh: 'Ganesh is the beloved elephant-headed deity who removes obstacles and blesses new beginnings.',
  Veda: 'Veda refers to the ancient sacred scriptures of Hinduism, the oldest texts of Indian knowledge.',
  Buddha: 'Buddha honours the enlightened one, evoking peace, wisdom and inner awakening.',
  Muhammad: 'Muhammad is the most widely given name in the world, honouring the Prophet of Islam and beloved across Muslim communities everywhere.',
  Fatima: 'Fatima honours the beloved daughter of the Prophet Muhammad, a name of deep devotion and respect.',
  Aisha: 'Aisha was a wife of the Prophet Muhammad, remembered for her intelligence and strength, making the name one of high honour.',
  Maryam: 'Maryam is the Arabic name of Mary, mother of Jesus, venerated in Islam as among the most honoured women of all time.',
  Noah: 'Noah comes from the biblical figure who built the ark, and today it is one of the most popular boy names in the world.',
  Liam: 'Liam, short for William, has topped global popularity charts for years and remains a firm modern favourite.',
  Alexander: 'Alexander the Great spread the name across the ancient world, and it has signalled strength and leadership ever since.',
  Victoria: 'Victoria became a worldwide classic through the long reign of Queen Victoria, and is now beloved again in modern times.',
  Elizabeth: 'Elizabeth is a royal classic, borne by queens from Tudor England to the present day, and a favourite across generations.',
  Charlotte: 'Charlotte shares the royal family\'s love, bringing a refined, regal elegance to modern nurseries.',
  Aurora: 'Aurora is the Roman goddess of the dawn and the name of the northern lights, giving it a dreamy, celestial glow.',
  Athena: 'Athena is the Greek goddess of wisdom and strategy, a powerful and enduring choice.',
  Apollo: 'Apollo was the Greek god of light, music and the sun, making the name radiant and bold.',
  Artemis: 'Artemis, Greek goddess of the hunt and the moon, lends the name an independent, adventurous spirit.',
  Cleopatra: 'Cleopatra, the famed queen of ancient Egypt, gives the name its exotic, commanding allure.',
  Caesar: 'Caesar evokes the might of ancient Rome and its greatest general and ruler.',
  Augustus: 'Augustus was the first Roman emperor, giving the name a grand, imperial weight.',
  Leonardo: 'Leonardo da Vinci makes the name synonymous with genius, creativity and brilliance.',
  Wolfgang: 'Wolfgang Amadeus Mozart lends this name a permanent connection to musical genius.',
  Ludwig: 'Ludwig van Beethoven gives the name an association with artistic greatness and passion.',
  Napoleon: 'Napoleon Bonaparte makes the name bold, commanding and historically charged.',
  Florence: 'Florence Nightingale made the name a symbol of caring, courage and dedication to others.',
  Audrey: 'Audrey Hepburn gives the name its signature grace, warmth and timeless elegance.',
  Marilyn: 'Marilyn Monroe makes the name shimmer with mid-century glamour and charisma.',
  Elvis: 'Elvis Presley made the name synonymous with rock-and-roll fame and charisma.',
  Ella: 'Ella has the vintage charm of a jazz-age classic while feeling effortlessly modern today.',
  Luna: 'Luna, meaning moon, has become one of the most-loved celestial names in the modern era.',
  Ivy: 'Ivy, once a quiet botanical name, has climbed high in popularity as a short, sweet nature choice.',
  Hazel: 'Hazel brings a warm, earthy, nature-loving feel that has made it a modern chart favourite.',
  Freya: 'Freya, the Norse goddess of love and beauty, has surged in popularity as a fresh and powerful choice.',
  Isla: 'Isla, pronounced eye-la, has become a widely loved name for its soft Scottish island charm.',
  Kenji: 'Kenji is a celebrated Japanese name, famously carried by the author Kenji Miyazawa, whose fables are beloved worldwide.',
};

const NATURE_WORDS = /sun|moon|star|sky|earth|ocean|sea|river|lake|water|tree|forest|flower|lotus|rose|lily|jasmine|leaf|wood|mountain|gold|silver|pearl|jewel|cloud|storm|wind|wave|dawn|dusk|light|fire|snow|rain|bloom|garden|spring|nature|heaven|blossom|fern|ivy|willow|hazel|violet|daisy|poppy|iris|jade|coral|amber|crystal|stone|meadow|stream|spring|honey|fawn|bear|wolf|lion|hawk|eagle|dove|swan|sparrow|bird|flower|petal|breeze|frost|glacier|hill|valley|island|ocean|breeze|mist|rainbow|ember|glow|briar|moss|bark|pine|cedar|maple|elder|rowan|ash\b/i;

const ROYAL_WORDS = /king|queen|royal|prince|princess|ruler|emperor|empire|noble|sovereign|majesty|throne|crown|monarch|regal|chief|lord|lady|empress|duke|count|baron|nobility|dignit|royalty/i;

const POPULAR = new Set([
  'Aarav', 'Vihaan', 'Aadhya', 'Anaya', 'Diya', 'Ishaan', 'Kabir', 'Zain', 'Muhammad', 'Ayaan',
  'Advik', 'Reyansh', 'Arjun', 'Sai', 'Fatima', 'Aisha', 'Noah', 'Liam', 'Olivia', 'Emma',
  'Amelia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Luna', 'Harper', 'Evelyn', 'Jack', 'Oliver',
  'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander', 'Owen', 'Theodore',
  'Mateo', 'Levi', 'Leo', 'Ezra', 'Asher', 'Ethan', 'Logan', 'Daniel', 'Jacob', 'Michael',
  'Charlotte', 'Sophie', 'Chloe', 'Emily', 'Grace', 'Ella', 'Scarlett', 'Aria', 'Zoe', 'Isla',
  'Ivy', 'Hazel', 'Freya', 'Aurora', 'Stella', 'Lily', 'Ruby', 'Rose', 'Willow', 'Maya',
  'Aryan', 'Aarush', 'Ananya', 'Kiara', 'Navya', 'Saanvi', 'Aarohi', 'Anika', 'Myra', 'Pari',
  'Vivaan', 'Aditya', 'Krishna', 'Rohan', 'Arnav', 'Arya', 'Dhruv', 'Shaurya', 'Veer', 'Yash',
  'Meera', 'Amara', 'Noor', 'Yusuf', 'Ibrahim', 'Umar', 'Ali', 'Hassan', 'Hussein', 'Omar',
  'Mariam', 'Khushi', 'Aarush', 'Aaradhya', 'Aditi', 'Aisha', 'Anand', 'Armaan', 'Ayaan', 'Bodhi',
]);

const ROYAL_NAMES = new Set([
  'Victoria', 'Elizabeth', 'Charlotte', 'Henry', 'William', 'Edward', 'George', 'James',
  'Alexandra', 'Catherine', 'Caroline', 'Alexandria', 'Maximilian', 'Augustus', 'Reginald',
  'Eleanor', 'Isabella', 'Sophia', 'Katherine', 'Margaret', 'Anne', 'Mary', 'Charles',
  'Richard', 'Edward', 'Albert', 'Frederick', 'Louis', 'Philip', 'Arthur', 'Henry',
  'Augusta', 'Camilla', 'Diana', 'Grace', 'Royal', 'Kingsley', 'Regina', 'Rex',
  'Sultan', 'Maharaja', 'Raja', 'Princess', 'Noble', 'Duke', 'Countess', 'Viscount',
  'Adrian', 'Titus', 'August', 'Caesar', 'Cassius', 'Aurelius', 'Marcus', 'Octavius', 'Magnus',
]);

function syllables(name) {
  return (name.toLowerCase().match(/[aeiouy]+/g) || []).length;
}

function isNature(name, meaning) {
  if (NATURE_WORDS.test(meaning)) return true;
  return ['River', 'Willow', 'Ivy', 'Hazel', 'Autumn', 'Summer', 'Winter', 'Sky', 'Ocean', 'Fern', 'Dawn', 'Breeze', 'Meadow', 'Clover', 'Basil', 'Sage', 'Jade', 'Amber', 'Coral', 'Ruby', 'Pearl', 'Iris', 'Violet', 'Daisy', 'Poppy', 'Lily', 'Rose', 'Jasmine', 'Lotus', 'Chandan', 'Arvind', 'Arnav', 'Chirag', 'Chandra', 'Aakash', 'Aarush', 'Arush', 'Ahaan', 'Aahan', 'Ravi', 'Surya', 'Indra', 'Soma', 'Vayu', 'Bhuvan', 'Bipin', 'Ankur', 'Prithvi', 'Dhara', 'Kanan', 'Vana', 'Nila', 'Zuri', 'Kai', 'Lani', 'Makani', 'Kailani', 'Alani', 'Leilani', 'Moana', 'Nalani', 'Kale', 'Kanoa', 'Noa', 'Elowen', 'Ione', 'Kaia', 'Niamh', 'Aoife'].includes(name);
}

function isRoyal(name, meaning) {
  if (ROYAL_WORDS.test(meaning)) return true;
  return ROYAL_NAMES.has(name);
}

function isShort(name) {
  return name.length <= 5 && syllables(name) <= 2;
}

export function assignVibes({ name, meaning, style }) {
  const vibes = [];
  if (style === 'Modern' || style === 'Trendy') vibes.push('Modern');
  else if (style === 'Unique') vibes.push('Unique/Rare');
  else vibes.push('Classic/Traditional');
  if (isNature(name, meaning) && !vibes.includes('Nature-inspired')) vibes.push('Nature-inspired');
  else if (isRoyal(name, meaning) && !vibes.includes('Royal/Elegant')) vibes.push('Royal/Elegant');
  if (vibes.length < 2 && POPULAR.has(name) && style !== 'Unique') vibes.push('Popular');
  if (vibes.length < 2 && isShort(name)) vibes.push('Short & Simple');
  return vibes.slice(0, 2);
}

function traits(meaning) {
  const m = meaning.toLowerCase();
  if (/(peace|calm|tranquil|quiet|gentle)/.test(m)) return 'calm, thoughtful and gentle';
  if (/(strong|power|mighty|fierce|brave|bold|courage|valiant|warrior)/.test(m)) return 'strong-willed, determined and resilient';
  if (/(light|bright|ray|sun|shine|radiant|glow|dawn)/.test(m)) return 'warm, optimistic and full of quiet energy';
  if (/(wis|intell|know|learn|scholar|wise|insight)/.test(m)) return 'wise, curious and perceptive';
  if (/(king|queen|royal|noble|prince|ruler|sovereign|majesty|emperor|empire)/.test(m)) return 'dignified, confident and a natural leader';
  if (/(flower|bloom|lotus|rose|lily|jasmine|blossom|petal|daisy|poppy|iris|violet)/.test(m)) return 'graceful, gentle and deeply loved';
  if (/(star|moon|sky|celestial|heaven|night)/.test(m)) return 'dreamy, imaginative and free-spirited';
  if (/(ocean|sea|river|water|wave|stream|flow)/.test(m)) return 'deep, adaptable and at peace with themselves';
  if (/(earth|tree|forest|mountain|wood|valley|meadow|stone|island)/.test(m)) return 'grounded, steady and dependable';
  if (/(god|divine|bless|holy|sacred|devot|spirit)/.test(m)) return 'devoted, kind-hearted and spiritually aware';
  if (/(joy|happy|bliss|cheer|delight|smile|glad)/.test(m)) return 'bright, cheerful and uplifting to be around';
  if (/(unique|rare|one of a kind|special|precious|priceless|matchless)/.test(m)) return 'independent, original and quietly distinctive';
  return 'warm, loyal and quietly self-assured';
}

function symbolism(meaning) {
  const m = meaning.toLowerCase();
  if (/(peace|calm|tranquil)/.test(m)) return 'Its deeper meaning speaks of harmony and serenity, a steady inner strength that parents hope will guide their child through life.';
  if (/(light|sun|ray|dawn|bright|shine)/.test(m)) return 'Beneath the surface it symbolises hope, clarity and new beginnings, like the first light of morning.';
  if (/(wis|know|learn|scholar|intell)/.test(m)) return 'It points to a life of learning and understanding, a name for someone who thinks deeply and sees clearly.';
  if (/(strength|power|mighty|brave|courage|valiant|fierce)/.test(m)) return 'It symbolises courage and resilience, the quiet power to stand firm when it matters most.';
  if (/(god|divine|bless|holy|sacred|devot)/.test(m)) return 'It carries a sense of the sacred, a blessing and a reminder of grace carried through life.';
  if (/(flower|lotus|rose|lily|bloom|blossom|jasmine|petal)/.test(m)) return 'It symbolises beauty that unfolds gradually, grace that deepens and blossoms with age.';
  if (/(star|moon|sky|celestial|heaven|night)/.test(m)) return 'It evokes the wonder of the night sky, a name that feels destined and full of quiet magic.';
  if (/(ocean|sea|river|water|wave|stream|flow)/.test(m)) return 'It suggests depth and movement, someone who goes with the flow yet runs deep.';
  if (/(earth|tree|forest|mountain|valley|meadow|stone|island)/.test(m)) return 'It is rooted and real, a name that brings to mind solid ground and enduring nature.';
  if (/(king|queen|royal|noble|prince|ruler|sovereign|majesty|emperor)/.test(m)) return 'It carries an air of quiet authority and grace, a name that commands respect without shouting.';
  if (/(joy|happy|bliss|cheer|delight|smile|glad)/.test(m)) return 'It is a name that smiles, carrying warmth and happiness wherever it goes.';
  if (/(unique|rare|special|precious|priceless|one of a kind|matchless)/.test(m)) return 'It marks someone as one of a kind, a name for a child destined to stand out.';
  return 'It carries a gentle strength that ages well, feeling at home in every stage of life.';
}

function feel(name, style, vibes) {
  const len = name.length;
  const syl = syllables(name);
  const sound = len <= 4 && syl <= 2
    ? 'short, crisp and instantly memorable'
    : syl <= 2
      ? 'light and easy to say'
      : len >= 9
        ? 'grand and distinctive'
        : 'smooth and well balanced';
  let mood = '';
  if (style === 'Unique' || vibes.includes('Unique/Rare')) mood = 'rare and quietly distinctive';
  else if (style === 'Modern' || style === 'Trendy' || vibes.includes('Modern')) mood = 'fresh and contemporary';
  else if (style === 'Classic' || vibes.includes('Classic/Traditional')) mood = 'timeless and dependable';
  else mood = 'easy and approachable';
  return `With a ${sound} sound, ${name} feels ${mood}.`;
}

function originNote(origin) {
  return ORIGIN_NOTE[origin] || `It is a treasured part of ${origin} naming heritage.`;
}

export function describe(entry) {
  const { name, gender, meaning, origin, style } = entry;
  const lang = ORIGIN_LANG[origin] || `${origin} tradition`;
  const pronoun = gender === 'girl' ? 'She' : gender === 'boy' ? 'He' : 'They';
  const parts = [];
  parts.push(`${name} means "${meaning}" in ${lang}.`);
  parts.push(symbolism(meaning));
  parts.push(`${pronoun} is often described as ${traits(meaning)}.`);
  const notable = NOTABLE[name];
  if (notable) parts.push(notable);
  else parts.push(originNote(origin));
  parts.push(feel(name, style, entry.vibes || []));
  return parts.join(' ');
}

export function enrich(entry) {
  const vibes = assignVibes(entry);
  return { ...entry, vibes, description: describe({ ...entry, vibes }) };
}