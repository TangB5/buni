import { patternRepository }
  from '../repositories/pattern.repository';

export async function featurePattern(
  id: string
) {

  return patternRepository.feature(id);
}