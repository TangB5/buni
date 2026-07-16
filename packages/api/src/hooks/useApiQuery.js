import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
export const queryKeys = {
    patterns: (params) => ['patterns', params],
    pattern: (id) => ['patterns', id],
    artisans: (params) => ['artisans', params],
    artisan: (id) => ['artisans', id],
    dashboard: () => ['dashboard'],
    me: () => ['me'],
};
export const useGet = (key, url, opts) => useQuery({
    queryKey: key,
    queryFn: () => apiClient.get(url).then(r => r.data),
    ...opts,
});
export const usePost = (url) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: vars => apiClient.post(url, vars).then(r => r.data),
        onSuccess: () => qc.invalidateQueries(),
    });
};
export const usePatch = (url) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: vars => apiClient.patch(url, vars).then(r => r.data),
        onSuccess: () => qc.invalidateQueries(),
    });
};
export const useDelete = (url) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: id => apiClient.delete(`${url}/${id}`).then(() => undefined),
        onSuccess: () => qc.invalidateQueries(),
    });
};
//# sourceMappingURL=useApiQuery.js.map