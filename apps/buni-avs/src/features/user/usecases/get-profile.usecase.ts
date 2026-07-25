import { UserMapper } from '../mappers/user.mapper';
import { userService } from '../services/user.service';
import type { User } from '../types';

export async function getProfileUseCase(): Promise<User> {
  const dto = await userService.getProfile();
  return UserMapper.toDomain(dto);
}
