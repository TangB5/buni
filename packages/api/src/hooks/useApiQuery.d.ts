import { type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
export declare const queryKeys: {
    patterns: (params?: Record<string, unknown>) => readonly ["patterns", Record<string, unknown> | undefined];
    pattern: (id: string) => readonly ["patterns", string];
    artisans: (params?: Record<string, unknown>) => readonly ["artisans", Record<string, unknown> | undefined];
    artisan: (id: string) => readonly ["artisans", string];
    dashboard: () => readonly ["dashboard"];
    me: () => readonly ["me"];
};
export declare const useGet: <T>(key: readonly unknown[], url: string, opts?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>) => import("@tanstack/react-query").UseQueryResult<import("@tanstack/react-query").NoInfer<T>, AxiosError<unknown, any>>;
export declare const usePost: <TData, TVar>(url: string) => import("@tanstack/react-query").UseMutationResult<TData, AxiosError<unknown, any>, TVar, unknown>;
export declare const usePatch: <TData, TVar>(url: string) => import("@tanstack/react-query").UseMutationResult<TData, AxiosError<unknown, any>, TVar, unknown>;
export declare const useDelete: (url: string) => import("@tanstack/react-query").UseMutationResult<void, AxiosError<unknown, any>, string, unknown>;
//# sourceMappingURL=useApiQuery.d.ts.map