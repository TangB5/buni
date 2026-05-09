'use client';

// =============================================================================
// Feature Patterns — Service + Hooks
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Pattern, PatternFilters, PatternListResponse } from '../types';
import { get, post } from 'apps/buni-avs/src/core/api/client';

// ── Clés de query ─────────────────────────────────────────────────────────────
export const patternKeys = {
  all:       ['patterns'] as const,
  lists:     () => [...patternKeys.all, 'list'] as const,
  list:      (filters: PatternFilters) => [...patternKeys.lists(), filters] as const,
  details:   () => [...patternKeys.all, 'detail'] as const,
  detail:    (slug: string) => [...patternKeys.details(), slug] as const,
  featured:  () => [...patternKeys.all, 'featured'] as const,
};

// ── Service API ───────────────────────────────────────────────────────────────
export const patternService = {
  list:     (filters: PatternFilters) =>
    get<PatternListResponse>('/patterns', filters as Record<string, unknown>),
  bySlug:   (slug: string) => get<Pattern>(`/patterns/${slug}`),
  featured: ()             => get<Pattern[]>('/patterns/featured'),
  create:   (data: Partial<Pattern>) => post<Pattern>('/patterns', data),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function usePatterns(filters: PatternFilters = {}) {
  return useQuery({
    queryKey: patternKeys.list(filters),
    queryFn:  () => patternService.list(filters),
    placeholderData: prev => prev,
  });
}

export function usePattern(slug: string) {
  return useQuery({
    queryKey:  patternKeys.detail(slug),
    queryFn:   () => patternService.bySlug(slug),
    enabled:   !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedPatterns() {
  return useQuery({
    queryKey: patternKeys.featured(),
    queryFn:  patternService.featured, 
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreatePattern() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Pattern>) => patternService.create(data),
    onSuccess:  () => void qc.invalidateQueries({ queryKey: patternKeys.all }),
  });
}