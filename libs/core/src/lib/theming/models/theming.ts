import { TonalPalette } from '../palette';

export type Scheme = 'light' | 'dark' | 'system';

export interface Colors {
  primary: string;
  error: string;
}

export interface ThemeConfig extends Colors {
  scheme: Scheme;
}

export interface Theme {
  primary: TonalPalette;
  error: TonalPalette;
}
