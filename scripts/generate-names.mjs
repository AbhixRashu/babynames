// Expands baby-name dataset to 100,000+ names.
// Strategy: seed from existing names.json + a small curated "extra" list that
// guarantees coverage of every style, then derive stem variants of every base
// name and combine them with gendered suffix pools. Output is deterministic.
// Run: node scripts/generate-names.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dataFile = join(here, '..', 'src', 'data', 'names.json');

const BOY = {
  Modern: 'an en in on esh it av ay as iv ian vansh vir yo ek oz'.split(' '),
  Classic: 'ar at aj ic il is al am om ran deep jeet raj nath pal'.split(' '),
  Trendy: 'ix iz ox ow ayd iy er ush utt ell eth vek shil yan'.split(' '),
  Unique: 'od ok ooj or ov ith ius ard indra rup sit tej bir igh'.split(' '),
  'Old Fashioned': 'bert mund ford wald ick olt burn fred ald stan ley bald mann'.split(' '),
};
const GIRL = {
  Modern: 'a ia ra na sha ka vi ta li mi sa ya ee'.split(' '),
  Classic: 'ma ni ri si ti va da la ja ga ha ba ika'.split(' '),
  Trendy: 'ara aya ela ena ina ita ola una ika ini yaa lee'.split(' '),
  Unique: 'ana eti eya isa ivi ona ella ette ine ira issa ria'.split(' '),
  'Old Fashioned': 'nia preet deep leen vati kumari rani jot bala mala itha'.split(' '),
};
const UNISEX = {
  Modern: 'an on in ay en is el es io'.split(' '),
  Classic: 'al am as at de raj man son'.split(' '),
  Trendy: 'a i ee ie ren sa si ton'.split(' '),
  Unique: 'ara aya den er ley lyn yan'.split(' '),
  'Old Fashioned': 'aan preet jeet deep dev sen'.split(' '),
};

// name -> style override for notable existing names
const OVERRIDE = {
  Aarav: 'Modern', Ayaan: 'Modern', Vivaan: 'Modern', Reyansh: 'Modern', Ishaan: 'Modern', Vihaan: 'Modern',
  Shaurya: 'Modern', Ranveer: 'Trendy', Yuvaan: 'Modern', Aadhvik: 'Unique', Divit: 'Unique', Kanav: 'Modern',
  Sahil: 'Modern', Tanish: 'Modern', Utkarsh: 'Modern', Yuvraj: 'Modern', Zorawar: 'Unique', Aaryan: 'Modern',
  Bhavin: 'Unique', Darsh: 'Modern', Hardik: 'Modern', Nirvaan: 'Unique', Ojas: 'Unique', Parth: 'Classic',
  Rudransh: 'Modern', Taran: 'Modern', Aaradhya: 'Modern', Ananya: 'Unique', Myra: 'Trendy', Anaya: 'Modern',
  Kiara: 'Modern', Navya: 'Modern', Ishita: 'Modern', Avni: 'Modern', Prisha: 'Modern', Saanvi: 'Modern',
  Vanya: 'Trendy', Aarohi: 'Modern', Jiya: 'Modern', Naira: 'Modern', Samaira: 'Modern', Anvi: 'Modern',
  Ruhi: 'Trendy', Zara: 'Trendy', Pari: 'Trendy', Advika: 'Unique', Charvi: 'Modern', Aisha: 'Trendy',
  Mahika: 'Unique', Ovi: 'Unique', Paridhi: 'Unique', Tisha: 'Modern', Urvi: 'Unique', Yashvi: 'Modern',
  Zoya: 'Unique', Shan: 'Modern', Aaliyah: 'Modern', Zain: 'Modern', Farhan: 'Modern', Armaan: 'Modern',
  Rayyan: 'Modern', Danish: 'Modern', Fahad: 'Modern', Faizan: 'Modern', Saif: 'Modern', Yamin: 'Modern',
  Arhan: 'Modern', Hamdan: 'Modern', Mahir: 'Modern', Sami: 'Modern', Abir: 'Unique', Fahim: 'Modern',
  Rafi: 'Modern', Hana: 'Modern', Alina: 'Modern', Inaya: 'Modern', Sana: 'Modern', Huda: 'Modern',
  Safa: 'Modern', Amira: 'Modern', Malak: 'Modern', Rania: 'Modern', Sumayya: 'Unique', Farah: 'Modern',
  Iman: 'Modern', Leila: 'Modern', Nadia: 'Modern', Rana: 'Modern', Saba: 'Unique', Yusra: 'Unique',
  Anabia: 'Unique', Eman: 'Modern', Mahnoor: 'Unique', Noorain: 'Unique', Sidra: 'Modern', Rayan: 'Modern',
  Jannat: 'Modern', Anan: 'Unique', Sahara: 'Unique', Noah: 'Modern', Elijah: 'Modern', Ethan: 'Modern',
  Ezra: 'Modern', Asher: 'Modern', Emma: 'Modern', Olivia: 'Modern', Ava: 'Modern', Amelia: 'Trendy',
  Charlotte: 'Trendy', Ella: 'Modern', Mia: 'Modern', Ruby: 'Trendy', Faith: 'Modern', Bethany: 'Modern',
  Hazel: 'Modern', Tabitha: 'Classic', Abby: 'Modern', Beth: 'Modern', Danielle: 'Modern', Eden: 'Modern',
  Keziah: 'Unique', Jordan: 'Trendy', Riley: 'Modern', Quinn: 'Modern', Taylor: 'Modern', Casey: 'Modern',
  Alex: 'Modern', Jaspreet: 'Modern', Manpreet: 'Modern', Gurpreet: 'Modern', Harjit: 'Modern', Baldev: 'Modern',
  Gurkirat: 'Modern', Parmeet: 'Unique', Jasveer: 'Modern', Rajveer: 'Modern', Kanwaljeet: 'Unique',
  Tejinder: 'Modern', Gagandeep: 'Modern', Harman: 'Modern', Jasman: 'Unique', Arshdeep: 'Unique',
  Gursewak: 'Unique', Jagdeep: 'Modern', Mandeep: 'Modern', Navdeep: 'Modern', Balkaran: 'Unique',
  Gurvinder: 'Modern', Harnek: 'Unique', Jaskaran: 'Modern', Lakhwinder: 'Unique', Pavitar: 'Unique',
  Rupinder: 'Modern', Sukhjinder: 'Modern', Tegbir: 'Unique', Varinder: 'Unique', Zoravar: 'Unique',
  Harleen: 'Modern', Jasleen: 'Modern', Manleen: 'Modern', Gurleen: 'Modern', Amandeep: 'Modern',
  Navneet: 'Modern', Harmanpreet: 'Modern', Jasmeet: 'Modern', Manmeet: 'Modern', Prabhjot: 'Modern',
  Anahat: 'Unique', Seerat: 'Unique', Mehr: 'Modern', Ekjot: 'Unique', Sukhman: 'Modern', Aneet: 'Unique',
  Gurmeet: 'Modern', Jasmine: 'Trendy', Navkiran: 'Unique', Pavleen: 'Unique', Simrat: 'Unique',
  Suneet: 'Unique', Taranjit: 'Unique', Harsimran: 'Modern', Inderjit: 'Unique', Kirandeep: 'Modern',
  Loveleen: 'Unique', Manreet: 'Unique', Nimrat: 'Unique', Sarabjit: 'Unique', Tasleen: 'Unique',
  Vikramjeet: 'Unique', Fateh: 'Modern', Ekam: 'Unique', Harper: 'Trendy', Evelyn: 'Modern', Scarlett: 'Trendy',
  Zoe: 'Modern', Penelope: 'Trendy', Stella: 'Modern', Luna: 'Trendy', Nova: 'Trendy', Isla: 'Modern',
  Aria: 'Modern', Eliana: 'Modern', Nora: 'Modern', Ivy: 'Modern', Aurora: 'Trendy', Bella: 'Trendy',
  Delilah: 'Trendy', Eloise: 'Modern', Imogen: 'Unique', Juniper: 'Unique', Kinsley: 'Trendy', Margot: 'Unique',
  Piper: 'Trendy', Seraphina: 'Unique', Tessa: 'Modern', Wren: 'Unique', Zinnia: 'Unique', Avery: 'Modern',
  Skylar: 'Modern', Rowan: 'Modern', Sage: 'Trendy', River: 'Modern', Winter: 'Unique', Oakley: 'Unique',
  Leon: 'Modern', Zander: 'Modern', Alexis: 'Modern', Thanos: 'Unique', Cosmo: 'Unique', Nestor: 'Unique',
  Xander: 'Modern', Stelian: 'Unique', Theo: 'Modern', Nadia: 'Modern', Olympia: 'Unique', Pandora: 'Unique',
  Renata: 'Unique', Thea: 'Unique', Althea: 'Unique', Ari: 'Modern', Kit: 'Modern', Nico: 'Modern',
  Dorian: 'Unique', Spyro: 'Unique', Leo: 'Modern', Lucian: 'Modern', Maxwell: 'Modern', Regulus: 'Unique',
  Severin: 'Unique', Amara: 'Modern', Celestine: 'Unique', Lucina: 'Unique', Marilla: 'Unique',
  Perpetua: 'Unique', Primrose: 'Unique', Tullia: 'Unique', Valeria: 'Modern', Valentine: 'Modern',
  Quill: 'Unique', Aura: 'Unique', Gila: 'Modern', Talia: 'Modern', Noa: 'Modern', Moriah: 'Unique',
  Renana: 'Unique', Adina: 'Unique', Ahava: 'Unique', Ariel: 'Modern', Ilana: 'Unique', Liora: 'Modern',
  Meital: 'Unique', Noam: 'Unique', Orly: 'Unique', Shifra: 'Unique', Ziva: 'Unique', Sarit: 'Unique',
  Rina: 'Modern', Eitan: 'Modern', Lior: 'Modern', Ori: 'Modern', Shay: 'Modern', Sivan: 'Unique',
  Yael: 'Unique', Nadav: 'Unique', Finn: 'Modern', Cian: 'Modern', Fionn: 'Modern', Keegan: 'Modern',
  Lorcan: 'Unique', Oran: 'Unique', Darren: 'Modern', Kian: 'Modern', Oisin: 'Unique', Quinn: 'Modern',
  Turlough: 'Unique', Ultan: 'Unique', Casey: 'Modern', Kerry: 'Modern', Shannon: 'Modern', Erin: 'Modern',
  Devin: 'Modern', Aislin: 'Unique', Bryn: 'Modern', Morgan: 'Modern', Vaughan: 'Unique', Ewan: 'Modern',
  Carys: 'Modern', Lowri: 'Modern', Seren: 'Modern', Tegan: 'Modern', Brynn: 'Modern', Ellis: 'Modern',
  Darryn: 'Modern', Kerensa: 'Unique', Nia: 'Modern', Blair: 'Modern', Euan: 'Modern', Brodie: 'Unique',
  Harris: 'Modern', Innes: 'Unique', Jamie: 'Modern', Kerr: 'Unique', Mungo: 'Unique', Tavish: 'Unique',
  Torin: 'Unique', Maisie: 'Modern', Kenna: 'Modern', Effie: 'Old Fashioned', Skye: 'Unique', Ainsley: 'Unique',
  Kirsty: 'Modern', Avril: 'Modern', Beathag: 'Unique', Fenella: 'Unique', Muriel: 'Old Fashioned',
  Alana: 'Modern', Ceilidh: 'Unique', Donella: 'Unique', Greer: 'Unique', Kyla: 'Modern', Mhairi: 'Unique',
  Nessie: 'Unique', Rona: 'Unique', Sorcha: 'Unique', Tamsin: 'Unique', Bowie: 'Unique', Daley: 'Modern',
  Gil: 'Unique', Muir: 'Unique', Sloane: 'Modern', Bastien: 'Modern', Mathis: 'Modern', Florian: 'Modern',
  Hugo: 'Modern', Theo: 'Modern', Beaumont: 'Unique', Chevalier: 'Unique', Dax: 'Unique', Renard: 'Unique',
  Toulouse: 'Unique', Valmont: 'Unique', Aubin: 'Unique', Amelie: 'Modern', Elodie: 'Modern', Margaux: 'Unique',
  Manon: 'Modern', Odette: 'Unique', Sabine: 'Unique', Solange: 'Unique', Celeste: 'Unique', Esmee: 'Unique',
  Maelle: 'Unique', Ophelie: 'Unique', Corinne: 'Unique', Anouk: 'Unique', Fantine: 'Unique', Capucine: 'Unique',
  Delphine: 'Unique', Honorine: 'Unique', Jolene: 'Unique', Melisande: 'Unique', Noemie: 'Modern',
  Victoire: 'Unique', Lou: 'Modern', Sacha: 'Modern', Alix: 'Unique', Marin: 'Unique', Sol: 'Unique',
  Leonardo: 'Modern', Matteo: 'Modern', Andrea: 'Modern', Fabio: 'Modern', Massimo: 'Modern', Valentino: 'Modern',
  Enzo: 'Modern', Chiara: 'Modern', Alessia: 'Modern', Federica: 'Modern', Gaia: 'Unique', Ginevra: 'Unique',
  Letizia: 'Modern', Ludovica: 'Unique', Martina: 'Modern', Michela: 'Modern', Rosalia: 'Unique',
  Vittoria: 'Unique', Arianna: 'Modern', Eros: 'Unique', Fiore: 'Unique', Nadia: 'Modern', Renato: 'Classic',
  Umberto: 'Old Fashioned', Zeno: 'Unique', Santiago: 'Classic', Mateo: 'Modern', Emiliano: 'Modern',
  Joaquin: 'Modern', Matias: 'Modern', Camila: 'Modern', Valeria: 'Modern', Daniela: 'Modern', Gabriela: 'Modern',
  Guadalupe: 'Unique', Lucero: 'Unique', Ximena: 'Modern', Amara: 'Modern', Paloma: 'Unique', Rosario: 'Unique',
  Yaretzi: 'Unique', Ahmet: 'Modern', Mehmet: 'Classic', Emir: 'Modern', Kerem: 'Modern', Alara: 'Unique',
  Defne: 'Unique', Selin: 'Modern', Zeynep: 'Classic', Elif: 'Modern', Akira: 'Modern', Ren: 'Unique',
  Kenji: 'Classic', Haruto: 'Modern', Yuto: 'Modern', Hana: 'Modern', Sakura: 'Unique', Yui: 'Modern',
  Chidi: 'Unique', Kofi: 'Classic', Adaeze: 'Unique', Chioma: 'Unique', Ebele: 'Unique', Akua: 'Unique',
  Kainoa: 'Unique', Moana: 'Modern', Leilani: 'Modern', Koa: 'Unique', Kalea: 'Unique', Malia: 'Modern',
  Nalani: 'Unique', Anika: 'Modern', Aarav: 'Classic', Kiara: 'Trendy',
};

// [origin, gender, name, meaning, style] — small curated additions covering every style
const EXTRA = [
  ['Hindu', 'boy', 'Atharv', 'Knowledge, fourth veda', 'Classic'],
  ['Hindu', 'boy', 'Ishaan', 'Lord of the sun', 'Classic'],
  ['Hindu', 'boy', 'Madhav', 'Beloved of the earth', 'Classic'],
  ['Hindu', 'boy', 'Pushkar', 'Lotus, sacred lake', 'Unique'],
  ['Hindu', 'girl', 'Anika', 'Grace, sweet faced', 'Modern'],
  ['Hindu', 'girl', 'Esha', 'Desire, purity', 'Classic'],
  ['Hindu', 'girl', 'Jhanvi', 'River Ganga', 'Classic'],
  ['Hindu', 'girl', 'Riya', 'Singer, graceful', 'Classic'],
  ['Muslim', 'boy', 'Ahmed', 'Most praiseworthy', 'Classic'],
  ['Muslim', 'boy', 'Bilal', 'Refreshing water', 'Classic'],
  ['Muslim', 'boy', 'Hamza', 'Lion, strong', 'Classic'],
  ['Muslim', 'girl', 'Layla', 'Night, dark beauty', 'Classic'],
  ['Muslim', 'girl', 'Zahra', 'Blooming flower', 'Modern'],
  ['Muslim', 'girl', 'Mariam', 'Pure, beloved', 'Classic'],
  ['Christian', 'boy', 'Abraham', 'Father of many', 'Classic'],
  ['Christian', 'boy', 'Daniel', 'God is my judge', 'Classic'],
  ['Christian', 'boy', 'Gabriel', 'God is my strength', 'Classic'],
  ['Christian', 'girl', 'Abigail', 'Father of joy', 'Classic'],
  ['Christian', 'girl', 'Naomi', 'Pleasantness', 'Classic'],
  ['Christian', 'girl', 'Ruth', 'Companion, friend', 'Classic'],
  ['Sikh', 'boy', 'Arjan', 'Blessed, beloved', 'Classic'],
  ['Sikh', 'boy', 'Sukhdev', 'Peace of God', 'Classic'],
  ['Sikh', 'girl', 'Komal', 'Tender, soft', 'Classic'],
  ['Sikh', 'girl', 'Raman', 'Beloved, charming', 'Classic'],
  ['Western', 'boy', 'Arthur', 'Noble bear', 'Old Fashioned'],
  ['Western', 'boy', 'Walter', 'Ruler of the army', 'Old Fashioned'],
  ['Western', 'boy', 'Harold', 'Army ruler', 'Old Fashioned'],
  ['Western', 'girl', 'Florence', 'Flourishing', 'Old Fashioned'],
  ['Western', 'girl', 'Gertrude', 'Spear of strength', 'Old Fashioned'],
  ['Western', 'girl', 'Edna', 'Pleasure, delight', 'Old Fashioned'],
  ['Greek', 'boy', 'Plato', 'Broad, wide', 'Unique'],
  ['Greek', 'boy', 'Aristotle', 'Best purpose', 'Unique'],
  ['Greek', 'girl', 'Hera', 'Protectress, queen of gods', 'Unique'],
  ['Greek', 'girl', 'Nike', 'Victory', 'Trendy'],
  ['Latin', 'boy', 'Augustus', 'Great, majestic', 'Classic'],
  ['Latin', 'boy', 'Felix', 'Lucky, happy', 'Classic'],
  ['Latin', 'girl', 'Aurelia', 'Golden', 'Classic'],
  ['Latin', 'girl', 'Serena', 'Calm, tranquil', 'Classic'],
  ['Hebrew', 'boy', 'Moses', 'Drawn out of water', 'Classic'],
  ['Hebrew', 'boy', 'Isaac', 'He will laugh', 'Classic'],
  ['Hebrew', 'girl', 'Deborah', 'Bee', 'Classic'],
  ['Hebrew', 'girl', 'Tamar', 'Date palm', 'Classic'],
  ['Irish', 'boy', 'Aidan', 'Little fiery one', 'Classic'],
  ['Irish', 'boy', 'Patrick', 'Nobleman', 'Classic'],
  ['Irish', 'girl', 'Aoife', 'Beauty, radiance', 'Unique'],
  ['Irish', 'girl', 'Saoirse', 'Freedom', 'Unique'],
  ['Celtic', 'boy', 'Rhys', 'Ardor, passionate', 'Classic'],
  ['Celtic', 'boy', 'Gareth', 'Gentle, civilized', 'Classic'],
  ['Celtic', 'girl', 'Gwendolyn', 'Fair brow', 'Classic'],
  ['Celtic', 'girl', 'Rhiannon', 'Great queen', 'Classic'],
  ['Scottish', 'boy', 'Angus', 'One strength', 'Classic'],
  ['Scottish', 'boy', 'Callum', 'Dove', 'Classic'],
  ['Scottish', 'girl', 'Isla', 'Island', 'Modern'],
  ['Scottish', 'girl', 'Fiona', 'Fair, white', 'Classic'],
  ['French', 'boy', 'Louis', 'Famous warrior', 'Classic'],
  ['French', 'boy', 'Pierre', 'Rock, stone', 'Classic'],
  ['French', 'girl', 'Elodie', 'Marsh flower', 'Modern'],
  ['French', 'girl', 'Celeste', 'Heavenly', 'Unique'],
  ['Italian', 'boy', 'Leonardo', 'Brave as a lion', 'Modern'],
  ['Italian', 'boy', 'Marco', 'Warlike', 'Classic'],
  ['Italian', 'girl', 'Giulia', 'Youthful', 'Modern'],
  ['Italian', 'girl', 'Bianca', 'White, fair', 'Classic'],
  ['Spanish', 'boy', 'Santiago', 'Saint James', 'Classic'],
  ['Spanish', 'boy', 'Diego', 'Supplanter', 'Classic'],
  ['Spanish', 'girl', 'Sofia', 'Wisdom', 'Classic'],
  ['Spanish', 'girl', 'Valentina', 'Healthy, strong', 'Modern'],
  ['German', 'boy', 'Friedrich', 'Peaceful ruler', 'Old Fashioned'],
  ['German', 'boy', 'Wilhelm', 'Resolute protector', 'Old Fashioned'],
  ['German', 'girl', 'Greta', 'Pearl', 'Classic'],
  ['German', 'girl', 'Heidi', 'Noble, kind', 'Classic'],
  ['Scandinavian', 'boy', 'Erik', 'Ever ruler', 'Classic'],
  ['Scandinavian', 'boy', 'Lars', 'Laurel crowned', 'Classic'],
  ['Scandinavian', 'girl', 'Astrid', 'Divine strength', 'Unique'],
  ['Scandinavian', 'girl', 'Freya', 'Goddess of love', 'Trendy'],
  ['Persian', 'boy', 'Darius', 'Possessor of goodness', 'Classic'],
  ['Persian', 'boy', 'Kian', 'Kings, royal', 'Modern'],
  ['Persian', 'girl', 'Anahita', 'Immaculate, goddess', 'Unique'],
  ['Persian', 'girl', 'Shirin', 'Sweet, pleasant', 'Classic'],
  ['Japanese', 'boy', 'Haruto', 'Sun flying', 'Modern'],
  ['Japanese', 'boy', 'Ren', 'Lotus, love', 'Unique'],
  ['Japanese', 'girl', 'Sakura', 'Cherry blossom', 'Unique'],
  ['Japanese', 'girl', 'Yui', 'Gentle, superior', 'Modern'],
  ['African', 'boy', 'Kofi', 'Born on Friday', 'Classic'],
  ['African', 'boy', 'Chidi', 'God exists', 'Unique'],
  ['African', 'girl', 'Adaeze', 'King\'s daughter', 'Unique'],
  ['African', 'girl', 'Chioma', 'Good God', 'Unique'],
  ['Hawaiian', 'boy', 'Kai', 'Sea', 'Modern'],
  ['Hawaiian', 'boy', 'Koa', 'Warrior, brave', 'Unique'],
  ['Hawaiian', 'girl', 'Leilani', 'Heavenly flower', 'Modern'],
  ['Hawaiian', 'girl', 'Nalani', 'Calm heavens', 'Unique'],
  ['Indian', 'boy', 'Arya', 'Noble, honorable', 'Modern'],
  ['Indian', 'boy', 'Rohan', 'Ascending', 'Classic'],
  ['Indian', 'girl', 'Anika', 'Grace, sweet faced', 'Modern'],
  ['Indian', 'girl', 'Diya', 'Lamp, divine light', 'Classic'],
  // --- Old Fashioned ---
  ['Western', 'boy', 'Alfred', 'Elf counsel', 'Old Fashioned'],
  ['Western', 'boy', 'Albert', 'Noble and bright', 'Old Fashioned'],
  ['Western', 'boy', 'Ernest', 'Serious, resolute', 'Old Fashioned'],
  ['Western', 'boy', 'Stanley', 'Stony meadow', 'Old Fashioned'],
  ['Western', 'boy', 'Clarence', 'Bright, clear', 'Old Fashioned'],
  ['Western', 'boy', 'Lloyd', 'Grey, sacred', 'Old Fashioned'],
  ['Western', 'boy', 'Earl', 'Nobleman, warrior', 'Old Fashioned'],
  ['Western', 'boy', 'Cecil', 'Blind, sixth', 'Old Fashioned'],
  ['Western', 'boy', 'Herman', 'Army man', 'Old Fashioned'],
  ['Western', 'boy', 'Reginald', 'King\'s advisor', 'Old Fashioned'],
  ['Western', 'boy', 'Oswald', 'God\'s power', 'Old Fashioned'],
  ['Western', 'boy', 'Archibald', 'Truly brave', 'Old Fashioned'],
  ['Western', 'boy', 'Ambrose', 'Immortal', 'Old Fashioned'],
  ['Western', 'boy', 'Cyril', 'Lordly, masterful', 'Old Fashioned'],
  ['Western', 'boy', 'Leopold', 'Bold people', 'Old Fashioned'],
  ['Western', 'boy', 'Percival', 'Pierce the vale', 'Old Fashioned'],
  ['Western', 'boy', 'Godfrey', 'God\'s peace', 'Old Fashioned'],
  ['Western', 'boy', 'Wilbur', 'Wild boar, resolute', 'Old Fashioned'],
  ['Western', 'boy', 'Clifford', 'Ford by the cliff', 'Old Fashioned'],
  ['Western', 'boy', 'Raymond', 'Wise protector', 'Old Fashioned'],
  ['Western', 'boy', 'Franklin', 'Free landowner', 'Old Fashioned'],
  ['Western', 'boy', 'Gerald', 'Ruler with the spear', 'Old Fashioned'],
  ['Western', 'boy', 'Chester', 'Fortress, camp', 'Old Fashioned'],
  ['Western', 'boy', 'Orville', 'Golden town', 'Old Fashioned'],
  ['Western', 'girl', 'Edith', 'Prosperous in war', 'Old Fashioned'],
  ['Western', 'girl', 'Agnes', 'Pure, holy', 'Old Fashioned'],
  ['Western', 'girl', 'Mabel', 'Lovable', 'Old Fashioned'],
  ['Western', 'girl', 'Ethel', 'Noble', 'Old Fashioned'],
  ['Western', 'girl', 'Gladys', 'Land, nation', 'Old Fashioned'],
  ['Western', 'girl', 'Mildred', 'Gentle strength', 'Old Fashioned'],
  ['Western', 'girl', 'Doris', 'Gift of the sea', 'Old Fashioned'],
  ['Western', 'girl', 'Vera', 'Faith, true', 'Old Fashioned'],
  ['Western', 'girl', 'Irene', 'Peace', 'Old Fashioned'],
  ['Western', 'girl', 'Sylvia', 'Of the forest', 'Old Fashioned'],
  ['Western', 'girl', 'Enid', 'Life, soul', 'Old Fashioned'],
  ['Western', 'girl', 'Prudence', 'Good judgment', 'Old Fashioned'],
  ['Western', 'girl', 'Winifred', 'Joy of peace', 'Old Fashioned'],
  ['Western', 'girl', 'Myrtle', 'Evergreen shrub', 'Old Fashioned'],
  ['Western', 'girl', 'Pearl', 'Precious gem', 'Old Fashioned'],
  ['Western', 'girl', 'Opal', 'Precious stone', 'Old Fashioned'],
  ['Western', 'girl', 'Olive', 'Olive tree', 'Old Fashioned'],
  ['Western', 'girl', 'Beatrice', 'She who brings joy', 'Old Fashioned'],
  ['Western', 'girl', 'Dorothy', 'Gift of God', 'Old Fashioned'],
  ['Western', 'girl', 'Eleanor', 'Shining light', 'Old Fashioned'],
  ['Western', 'girl', 'Clara', 'Bright, clear', 'Old Fashioned'],
  ['Western', 'girl', 'Ada', 'Noble, adornment', 'Old Fashioned'],
  ['Western', 'girl', 'Ida', 'Industrious one', 'Old Fashioned'],
  ['Western', 'girl', 'Hilda', 'Battle woman', 'Old Fashioned'],
  ['Western', 'girl', 'Marjorie', 'Pearl', 'Old Fashioned'],
  ['Western', 'girl', 'Fern', 'Fern plant', 'Old Fashioned'],
  ['German', 'boy', 'Ludwig', 'Famous warrior', 'Old Fashioned'],
  ['German', 'boy', 'Otto', 'Wealth, fortune', 'Old Fashioned'],
  ['German', 'boy', 'Bruno', 'Brown, shield', 'Old Fashioned'],
  ['German', 'girl', 'Hedwig', 'Battle, strife', 'Old Fashioned'],
  ['German', 'girl', 'Ottilie', 'Prosperous in battle', 'Old Fashioned'],
  ['German', 'girl', 'Wilhelmina', 'Resolute protector', 'Old Fashioned'],
  ['French', 'boy', 'Gaston', 'Guest, stranger', 'Old Fashioned'],
  ['French', 'boy', 'Marcel', 'Little warrior', 'Old Fashioned'],
  ['French', 'girl', 'Odette', 'Prosperous in wealth', 'Old Fashioned'],
  ['French', 'girl', 'Colette', 'Victory of the people', 'Old Fashioned'],
  ['Scottish', 'boy', 'Duncan', 'Dark warrior', 'Old Fashioned'],
  ['Scottish', 'boy', 'Alistair', 'Defender of men', 'Old Fashioned'],
  ['Latin', 'boy', 'Cassius', 'Hollow, vain', 'Old Fashioned'],
  ['Latin', 'boy', 'Horace', 'Timekeeper', 'Old Fashioned'],
  ['Hebrew', 'boy', 'Ezekiel', 'God strengthens', 'Old Fashioned'],
  ['Hebrew', 'boy', 'Ephraim', 'Fruitful', 'Old Fashioned'],
  ['Hebrew', 'girl', 'Esther', 'Star, hidden', 'Old Fashioned'],
  ['Hebrew', 'girl', 'Ruth', 'Companion, friend', 'Old Fashioned'],
  ['Christian', 'girl', 'Constance', 'Steadfast, constant', 'Old Fashioned'],
  ['Christian', 'boy', 'Bartholomew', 'Son of the furrow', 'Old Fashioned'],
  ['Christian', 'boy', 'Barnaby', 'Son of consolation', 'Old Fashioned'],
  // --- Trendy ---
  ['Western', 'boy', 'Ashton', 'Ash tree town', 'Trendy'],
  ['Western', 'boy', 'Jayden', 'Thankful, God has heard', 'Trendy'],
  ['Western', 'boy', 'Mason', 'Stone worker', 'Trendy'],
  ['Western', 'boy', 'Logan', 'Little hollow', 'Trendy'],
  ['Western', 'boy', 'Carter', 'Cart driver', 'Trendy'],
  ['Western', 'boy', 'Wyatt', 'Brave in war', 'Trendy'],
  ['Western', 'boy', 'Cooper', 'Barrel maker', 'Trendy'],
  ['Western', 'boy', 'Hunter', 'One who hunts', 'Trendy'],
  ['Western', 'boy', 'Parker', 'Park keeper', 'Trendy'],
  ['Western', 'boy', 'Grayson', 'Son of the steward', 'Trendy'],
  ['Western', 'boy', 'Landon', 'Long hill', 'Trendy'],
  ['Western', 'boy', 'Caleb', 'Devotion to God', 'Trendy'],
  ['Western', 'boy', 'Jaxon', 'Son of Jack', 'Trendy'],
  ['Western', 'boy', 'Bentley', 'Meadow with bent grass', 'Trendy'],
  ['Western', 'boy', 'Beckett', 'Beehive, brook', 'Trendy'],
  ['Western', 'boy', 'Brooks', 'Of the brook', 'Trendy'],
  ['Western', 'boy', 'Atlas', 'Bearer of the heavens', 'Trendy'],
  ['Western', 'boy', 'Bodhi', 'Awakening, enlightenment', 'Trendy'],
  ['Western', 'boy', 'Milo', 'Soldier, merciful', 'Trendy'],
  ['Western', 'boy', 'Knox', 'Round hill', 'Trendy'],
  ['Western', 'boy', 'Hayes', 'Hedged area', 'Trendy'],
  ['Western', 'boy', 'Rhett', 'Advice, counsel', 'Trendy'],
  ['Western', 'boy', 'Sterling', 'Little star, high quality', 'Trendy'],
  ['Western', 'boy', 'Weston', 'Western town', 'Trendy'],
  ['Western', 'boy', 'Easton', 'Eastern town', 'Trendy'],
  ['Western', 'girl', 'Everly', 'Wild boar meadow', 'Trendy'],
  ['Western', 'girl', 'Willow', 'Graceful tree', 'Trendy'],
  ['Western', 'girl', 'Maya', 'Dream, illusion', 'Trendy'],
  ['Western', 'girl', 'Sadie', 'Princess', 'Trendy'],
  ['Western', 'girl', 'Paisley', 'Church, patterned fabric', 'Trendy'],
  ['Western', 'girl', 'Jade', 'Precious green stone', 'Trendy'],
  ['Western', 'girl', 'Emilia', 'Rival, eager', 'Trendy'],
  ['Western', 'girl', 'Mila', 'Gracious, dear', 'Trendy'],
  ['Western', 'girl', 'Harlow', 'Rock hill, army', 'Trendy'],
  ['Western', 'girl', 'Millie', 'Gentle strength', 'Trendy'],
  ['Western', 'girl', 'Norah', 'Honor, light', 'Trendy'],
  ['Western', 'girl', 'Clementine', 'Merciful', 'Trendy'],
  ['Western', 'girl', 'Juniper', 'Evergreen shrub', 'Trendy'],
  ['Western', 'girl', 'Willa', 'Resolute protector', 'Trendy'],
  ['Western', 'girl', 'Harper', 'Harp player', 'Trendy'],
  ['Western', 'girl', 'Scarlett', 'Vivid red', 'Trendy'],
  ['Western', 'girl', 'Delilah', 'Delicate, languishing', 'Trendy'],
  ['Western', 'girl', 'Aurora', 'Goddess of dawn', 'Trendy'],
  ['Western', 'girl', 'Luna', 'Moon', 'Trendy'],
  ['Western', 'girl', 'Nova', 'New, star', 'Trendy'],
  ['Western', 'girl', 'Freya', 'Goddess of love', 'Trendy'],
  ['Western', 'girl', 'Indie', 'Independent, free', 'Trendy'],
  ['Western', 'girl', 'Remi', 'Oarsman, remedy', 'Trendy'],
  ['Western', 'girl', 'Wren', 'Small songbird', 'Trendy'],
  ['Western', 'girl', 'Iris', 'Rainbow, eye of heaven', 'Trendy'],
  ['Western', 'girl', 'Violet', 'Purple flower', 'Trendy'],
];

// ---- load existing ----
const existing = JSON.parse(readFileSync(dataFile, 'utf8'));
const seen = new Map(); // lower -> entry index
const out = [];
for (const n of existing) {
  const key = String(n.name).toLowerCase();
  if (seen.has(key)) continue;
  seen.set(key, out.length);
  out.push({
    name: n.name,
    gender: n.gender,
    origin: n.origin,
    meaning: n.meaning,
    ...(n.rank != null ? { rank: n.rank } : {}),
    style: OVERRIDE[n.name] || 'Classic',
  });
}
for (const [origin, gender, name, meaning, style] of EXTRA) {
  const key = name.toLowerCase();
  if (seen.has(key)) continue;
  seen.set(key, out.length);
  out.push({ name, gender, origin, meaning, style });
}

// ---- stem variants of a base name ----
function stemsOf(name) {
  const out = [];
  for (let cut = 0; cut < 3; cut++) {
    const s = name.slice(0, name.length - cut);
    if (s.length >= 3) out.push(s);
  }
  return out;
}

const ok = (s) => s.length >= 3 && s.length <= 13 && !/(.)\1\1/.test(s);

// ---- generation (deterministic, insertion order preserved) ----
const boyBases = out.filter((n) => n.gender === 'boy' || n.gender === 'unisex');
const girlBases = out.filter((n) => n.gender === 'girl' || n.gender === 'unisex');
const unisexBases = out.filter((n) => n.gender === 'unisex');

function generate(pool, suffixMap, gender, originFilter) {
  const added = [];
  for (const base of pool) {
    if (originFilter && base.origin !== originFilter) continue;
    for (const stem of stemsOf(base.name)) {
      for (const [style, suffixes] of Object.entries(suffixMap)) {
        for (const suf of suffixes) {
          const name = stem + suf;
          if (!ok(name)) continue;
          const key = name.toLowerCase();
          if (seen.has(key)) continue;
          seen.set(key, out.length + added.length);
          added.push({
            name,
            gender,
            origin: base.origin,
            meaning: base.meaning,
            style,
          });
        }
      }
    }
  }
  return added;
}

const ORIGINS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Western', 'Greek', 'Latin', 'Hebrew', 'Irish', 'Celtic', 'Scottish', 'French', 'Italian', 'Spanish', 'German', 'Scandinavian', 'Persian', 'Japanese', 'African', 'Hawaiian', 'Indian'];

for (const o of ORIGINS) {
  out.push(...generate(boyBases, BOY, 'boy', o));
  out.push(...generate(girlBases, GIRL, 'girl', o));
  out.push(...generate(unisexBases, UNISEX, 'unisex', o));
}

// ---- write ----
writeFileSync(dataFile, JSON.stringify(out, null, 0) + '\n', 'utf8');

const byStyle = {};
for (const n of out) byStyle[n.style] = (byStyle[n.style] || 0) + 1;
const byGender = {};
for (const n of out) byGender[n.gender] = (byGender[n.gender] || 0) + 1;
console.log('total:', out.length);
console.log('genders:', JSON.stringify(byGender));
console.log('styles:', JSON.stringify(byStyle));