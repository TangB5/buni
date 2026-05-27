import { PatternType, PatternColor } from "@buni/patterns";
import { PatternStatus } from "..";

export interface Pattern {
  id: string;
  slug: string;

  name: string;
  localName: string;

  imgUrl: string;

  type: PatternType;

  cssClass: string;

  featured: boolean;

  origin: {
    country: string;
    people: string;
    region: string;
    coords: [number, number];
    flag: string;
  };

  summary: string;

  colors: PatternColor[];

  status: PatternStatus;
}