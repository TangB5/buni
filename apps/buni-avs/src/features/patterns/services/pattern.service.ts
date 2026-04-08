// =============================================================================
// Feature patterns — Pattern Service
// =============================================================================

import { get, post, put, del } from '@/core/api/client';
import type { Pattern, PatternFilters, PatternListResponse } from '../types';

export const patternService = {

  list: (filters: PatternFilters = {}) =>
    get<PatternListResponse>('/api/v1/patterns', filters as Record<string, unknown>),

  bySlug: (slug: string) =>
    get<Pattern>(`/api/v1/patterns/${slug}`),

  featured: () =>
    get<Pattern[]>('/api/v1/patterns?featured=true&perPage=6'),

  create: (data: Partial<Pattern>) =>
    post<Pattern>('/api/v1/patterns', data),

  update: (id: string, data: Partial<Pattern>) =>
    put<Pattern>(`/api/v1/patterns/${id}`, data),

  remove: (id: string) =>
    del<void>(`/api/v1/patterns/${id}`),

  publish: (id: string) =>
    post<Pattern>(`/api/v1/patterns/${id}/publish`),

  trackView: (id: string): void => {
    void post(`/api/v1/patterns/${id}/view`).catch(() => {/* silencieux */});
  },
};