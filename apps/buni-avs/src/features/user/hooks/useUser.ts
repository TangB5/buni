import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfileUseCase } from '../usecases/get-profile.usecase';
import { updateProfileUseCase } from '../usecases/update-profile.usecase';
import { becomeCuratorUseCase } from '../usecases/become-curator.usecase';
import { getStatsUseCase } from '../usecases/get-stats.usecase';
import { getPatternsUseCase } from '../usecases/get-patterns.usecase';
import { getActivityUseCase } from '../usecases/get-activity.usecase';
import { userService } from '../services/user.service';
import type { User, UserStats, UserPattern, UserActivity, UpdateProfileForm, BecomeCuratorForm } from '../types';

export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
  patterns: () => [...userKeys.all, 'patterns'] as const,
  activity: () => [...userKeys.all, 'activity'] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => getProfileUseCase(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => getStatsUseCase(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePatterns(limit: number = 5) {
  return useQuery({
    queryKey: [...userKeys.patterns(), limit],
    queryFn: () => getPatternsUseCase(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useActivity(limit: number = 6) {
  return useQuery({
    queryKey: [...userKeys.activity(), limit],
    queryFn: () => getActivityUseCase(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileForm) => updateProfileUseCase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.deleteAccount(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useBecomeCurator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BecomeCuratorForm) => becomeCuratorUseCase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}
