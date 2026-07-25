import { UserMapper } from '../mappers/user.mapper';
import { userService } from '../services/user.service';
import type { User } from '../types';
import type { UpdateProfileForm } from '../types';

export async function updateProfileUseCase(data: UpdateProfileForm): Promise<User> {
  const dto = await userService.updateProfile(data);
  return UserMapper.toDomain(dto);
}
