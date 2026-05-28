import { patternRepository }
  from '../repositories/pattern.repository';

export async function unfeaturePattern(
  id: string
) {

  return patternRepository.unfeature(id);
}