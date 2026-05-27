'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import type {
  Pattern,
  PatternFilters,
} from '../types';

import { loadPatterns } from '../usecases/load-patterns.usecase';

import { loadPattern } from '../usecases/load-pattern.usecase';

import { loadFeaturedPatterns } from '../usecases/load-featured-patterns.usecase';

// ─────────────────────────────────────────────────────────────
// Query Keys
// ─────────────────────────────────────────────────────────────

export const patternKeys = {
  all: ['patterns'] as const,

  lists: () =>
    [...patternKeys.all, 'list'] as const,

  list: (filters: PatternFilters) =>
    [...patternKeys.lists(), filters] as const,

  details: () =>
    [...patternKeys.all, 'detail'] as const,

  detail: (slug: string) =>
    [...patternKeys.details(), slug] as const,

  featured: () =>
    [...patternKeys.all, 'featured'] as const,
};

// ─────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────

export function usePatterns(
  filters: PatternFilters = {}
) {
  return useQuery({
    queryKey: patternKeys.list(filters),

    queryFn: () =>
      loadPatterns(filters),

    placeholderData: prev => prev,
  });
}

export function usePattern(
  slug: string
) {
  return useQuery({
    queryKey: patternKeys.detail(slug),

    queryFn: () =>
      loadPattern(slug),

    enabled: !!slug,

    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedPatterns() {
  return useQuery({
    queryKey: patternKeys.featured(),

    queryFn: () =>
      loadFeaturedPatterns(),

    staleTime: 10 * 60 * 1000,
  });
}