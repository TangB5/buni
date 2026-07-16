

import { post, put, patch, del, get } from '@buni/api';

import type {
  PatternDto,
  PatternListApiResponse,
} from '../types';

export const patternService = {

  async list(filters = {}) {

    return get<PatternListApiResponse>(
      '/api/v1/patterns',
      filters as Record<string, unknown>
    );
  },

  async bySlug(slug: string) {

    return get<{ data: PatternDto }>(
      `/api/v1/patterns/${slug}`
    );
  },

  async featured() {

    return get<PatternListApiResponse>(
      '/api/v1/patterns?featured=true&perPage=6'
    );
  },

  async create(formData: FormData) {

    return post<{ data: PatternDto }>(
      '/api/v1/patterns',
      formData
    );
  },

  async update(
    id: string,
    data: unknown
  ) {

    return put<{ data: PatternDto }>(
      `/api/v1/patterns/${id}`,
      data
    );
  },

  async delete(id: string) {

    return del(
      `/api/v1/patterns/${id}`
    );
  },

  async feature(id: string) {
    return put<{ data: PatternDto }>(
      `/api/v1/patterns/${id}/featured`,
      { featured: true }
    );
  },

  async unfeature(id: string) {
    return put<{ data: PatternDto }>(
      `/api/v1/patterns/${id}/featured`,
      { featured: false }
    );
  },

  async publish(id: string) {
    return put<{ data: PatternDto }>(
      `/api/v1/patterns/${id}/status`,
      { status: 'PUBLISHED' }
    );
  },

  async unpublish(id: string) {
    return put<{ data: PatternDto }>(
      `/api/v1/patterns/${id}/status`,
      { status: 'DRAFT' }
    );
  },

  async updateStatus(id: string, status: string) {
    return patch<{ data: PatternDto }>(
      `/api/v1/patterns/${id}/status`,
      { status: status.toUpperCase() }
    );
  },
};