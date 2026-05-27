'use client';

// =============================================================================
// Feature Patterns — Service + Hooks
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Pattern, PatternFilters, PatternListResponse } from '../types';
import { patternService } from '../services/pattern.service';

// ── Clés de query ─────────────────────────────────────────────────────────────
export const patternKeys = {
  all:       ['patterns'] as const,
  lists:     () => [...patternKeys.all, 'list'] as const,
  list:      (filters: PatternFilters) => [...patternKeys.lists(), filters] as const,
  details:   () => [...patternKeys.all, 'detail'] as const,
  detail:    (slug: string) => [...patternKeys.details(), slug] as const,
  featured:  () => [...patternKeys.all, 'featured'] as const,
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
    mutationFn: (data: Partial<Pattern>) => patternService.update('', data),
    onSuccess:  () => void qc.invalidateQueries({ queryKey: patternKeys.all }),
  });
}