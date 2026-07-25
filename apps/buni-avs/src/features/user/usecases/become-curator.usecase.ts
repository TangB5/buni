import { UserMapper } from '../mappers/user.mapper';
import { userService } from '../services/user.service';
import type { User } from '../types';
import type { BecomeCuratorForm } from '../types';

export async function becomeCuratorUseCase(data: BecomeCuratorForm): Promise<User> {
  const dto = await userService.becomeCurator(data);
  return UserMapper.toDomain(dto);
}
