import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import type { UserProfile, UserStats, UserPattern, UserActivity, UpdateProfileData } from '../types/user.types';

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
    queryFn: () => userService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePatterns(limit: number = 5) {
  return useQuery({
    queryKey: [...userKeys.patterns(), limit],
    queryFn: () => userService.getPatterns(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useActivity(limit: number = 6) {
  return useQuery({
    queryKey: [...userKeys.activity(), limit],
    queryFn: () => userService.getActivity(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
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
