import { PatternType } from "packages/patterns/dist";
import { RegionType } from "..";

export interface PatternFilters {
  search?: string;

  type?: PatternType | 'all';

  region?: RegionType | 'all';

  page?: number;

  perPage?: number;
}