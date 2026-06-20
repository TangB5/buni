import { patternRepository } from '../repositories/pattern.repository';

export async function deletePattern(id: string): Promise<void> {
  return patternRepository.delete(id);
}
