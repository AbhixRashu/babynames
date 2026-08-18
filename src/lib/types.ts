export type NameStyle = 'Classic' | 'Modern' | 'Old Fashioned' | 'Trendy' | 'Unique';

export interface BabyName {
  name: string;
  gender: 'boy' | 'girl' | 'unisex';
  origin: string;
  meaning: string;
  rank?: number;
  style?: NameStyle;
}
