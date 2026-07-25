import { UserMapper } from '../mappers/user.mapper';
import { userService } from '../services/user.service';
import type { UserPattern } from '../types';

export async function getPatternsUseCase(limit: number = 5): Promise<UserPattern[]> {
  const dtos = await userService.getPatterns(limit);
  return dtos.map(dto => UserMapper.toDomainPattern(dto));
}
