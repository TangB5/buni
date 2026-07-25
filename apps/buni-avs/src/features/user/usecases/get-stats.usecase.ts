import { UserMapper } from '../mappers/user.mapper';
import { userService } from '../services/user.service';
import type { UserStats } from '../types';

export async function getStatsUseCase(): Promise<UserStats> {
  const dto = await userService.getStats();
  return UserMapper.toDomainStats(dto);
}
