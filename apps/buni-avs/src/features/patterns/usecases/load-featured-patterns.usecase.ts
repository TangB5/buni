import { patternRepository } from '../repositories/pattern.repository';

export async function loadFeaturedPatterns() {
  return patternRepository.findFeatured();
}