import { patternRepository } from '../repositories/pattern.repository';

import type {
  Pattern,
  PatternFilters,
} from '../types';

export async function loadPatterns(
  filters: PatternFilters = {}
): Promise<Pattern[]> {

  return patternRepository.findAll(filters);
}