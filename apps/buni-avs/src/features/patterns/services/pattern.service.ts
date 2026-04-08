// =============================================================================
// Feature patterns — Pattern Service
// =============================================================================

import { get, post, put, del } from '@/core/api/client';
import type { Pattern, PatternFilters, PatternListResponse } from '../types';

export const patternService = {

  list: (filters: PatternFilters = {}) =>
    get<PatternListResponse>('/api/avs/patterns', filters as Record<string, unknown>),

  bySlug: (slug: string) =>
    get<Pattern>(`/api/avs/patterns/${slug}`),

  featured: () =>
    get<Pattern[]>('/api/avs/patterns?featured=true&perPage=6'),

  create: (data: Partial<Pattern>) =>
    post<Pattern>('/api/avs/patterns', data),

  update: (id: string, data: Partial<Pattern>) =>
    put<Pattern>(`/api/avs/patterns/${id}`, data),

  remove: (id: string) =>
    del<void>(`/api/avs/patterns/${id}`),

  publish: (id: string) =>
    post<Pattern>(`/api/avs/patterns/${id}/publish`),

  trackView: (id: string): void => {
    void post(`/api/avs/patterns/${id}/view`).catch(() => {/* silencieux */});
  },
};