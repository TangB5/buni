import {
  PatternColor,
  PatternSymbol,
} from '@buni/patterns';

export interface PatternDto {
  id: string;

  slug: string;

  name: string;

  nameLocal: string;

  imgUrl: string;

  type: string;

  status: string;

  isFeatured: boolean;

  origin?: {
    country?: string;

    people?: string;

    region?: string;

    coords?: [number, number];

    flag?: string;
  };

  colors?: PatternColor[];

  symbols?: PatternSymbol[];

  summary?: string;

  history?: string;
}