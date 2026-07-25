import { UserMapper } from '../mappers/user.mapper';
import { userService } from '../services/user.service';
import type { UserActivity } from '../types';

export async function getActivityUseCase(limit: number = 6): Promise<UserActivity[]> {
  const dtos = await userService.getActivity(limit);
  return dtos.map(dto => UserMapper.toDomainActivity(dto));
}
