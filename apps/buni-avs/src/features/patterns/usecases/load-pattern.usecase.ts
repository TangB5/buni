import { patternRepository } from '../repositories/pattern.repository';

export async function loadPattern(
  slug: string
) {
  return patternRepository.findBySlug(slug);
}