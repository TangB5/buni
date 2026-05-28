import { patternRepository } from '../repositories/pattern.repository';
import type { Pattern } from '../types';

export async function publishPattern(id: string): Promise<Pattern> {
  return patternRepository.publish(id);
}

export async function unpublishPattern(id: string): Promise<Pattern> {
  return patternRepository.unpublish(id);
}

export async function featurePattern(id: string): Promise<Pattern> {
  return patternRepository.feature(id);
}

export async function unfeaturePattern(id: string): Promise<Pattern> {
  return patternRepository.unfeature(id);
}
