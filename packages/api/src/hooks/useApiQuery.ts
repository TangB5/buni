import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { AxiosError } from 'axios';

export const queryKeys = {
  patterns:  (params?: Record<string, unknown>) => ['patterns', params] as const,
  pattern:   (id: string)                        => ['patterns', id] as const,
  artisans:  (params?: Record<string, unknown>) => ['artisans', params] as const,
  artisan:   (id: string)                        => ['artisans', id] as const,
  dashboard: ()                                  => ['dashboard'] as const,
  me:        ()                                  => ['me'] as const,
};

export const useGet = <T>(
  key: readonly unknown[],
  url: string,
  opts?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => useQuery<T, AxiosError>({
  queryKey: key,
  queryFn:  () => apiClient.get<T>(url).then(r => r.data),
  ...opts,
});

export const usePost = <TData, TVar>(url: string) => {
  const qc = useQueryClient();
  return useMutation<TData, AxiosError, TVar>({
    mutationFn: vars => apiClient.post<TData>(url, vars).then(r => r.data),
    onSuccess:  () => qc.invalidateQueries(),
  });
};

export const usePatch = <TData, TVar>(url: string) => {
  const qc = useQueryClient();
  return useMutation<TData, AxiosError, TVar>({
    mutationFn: vars => apiClient.patch<TData>(url, vars).then(r => r.data),
    onSuccess:  () => qc.invalidateQueries(),
  });
};

export const useDelete = (url: string) => {
  const qc = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: id => apiClient.delete(`${url}/${id}`).then(() => undefined),
    onSuccess:  () => qc.invalidateQueries(),
  });
};
