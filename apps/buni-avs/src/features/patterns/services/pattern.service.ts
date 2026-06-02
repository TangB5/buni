

import { post, put, del, get } from '@buni/api';

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

  return post<{ data: PatternDto }>(
    `/api/v1/patterns/${id}/feature`
  );
},

async unfeature(id: string) {

  return post<{ data: PatternDto }>(
    `/api/v1/patterns/${id}/unfeature`
  );
},

async publish(id: string) {

  return post<{ data: PatternDto }>(
    `/api/v1/patterns/${id}/publish`
  );
},

async unpublish(id: string) {

  return post<{ data: PatternDto }>(
    `/api/v1/patterns/${id}/unpublish`
  );
},

};