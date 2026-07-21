import { patternRepository } from '../repositories/pattern.repository';

export async function downloadPattern(id: string): Promise<Blob> {
  return patternRepository.download(id);
}
