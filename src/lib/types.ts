import type { Rashi } from './rashi';

export type NameStyle = 'Classic' | 'Modern' | 'Old Fashioned' | 'Trendy' | 'Unique';

export type Vibe =
  | 'Modern'
  | 'Classic/Traditional'
  | 'Popular'
  | 'Unique/Rare'
  | 'Royal/Elegant'
  | 'Nature-inspired'
  | 'Short & Simple';

export type MuslimCategory = 'Names of Allah' | 'Prophet Names' | 'Quranic Names' | 'Arabic Meaning';

export interface BabyName {
  name: string;
  gender: 'boy' | 'girl' | 'unisex';
  origin: string;
  meaning: string;
  description: string;
  vibes: Vibe[];
  rank?: number;
  style?: NameStyle;
  rashi?: Rashi;
  category?: MuslimCategory;
}
