import { patternRepository } from '../repositories/pattern.repository';
import type { Pattern } from '../types';

export async function updatePattern(
  id: string,
  data: unknown
): Promise<Pattern> {
  return patternRepository.update(id, data);
}
