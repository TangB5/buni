import { patternService }
  from '../services/pattern.service';

import { mapPatternDtoToModel }
  from '../mappers/pattern.mapper';

import type {
  Pattern,
  PatternFilters,
} from '../types';

export const patternRepository = {

  async findAll(
    filters: PatternFilters = {}
  ): Promise<Pattern[]> {

    const response =
      await patternService.list(filters);

    return response.data.data.map(
      mapPatternDtoToModel
    );
  },

  async findBySlug(
    slug: string
  ): Promise<Pattern> {

    const response =
      await patternService.bySlug(slug);

    return mapPatternDtoToModel(
      response.data
    );
  },

  async findFeatured(): Promise<Pattern[]> {

    const response =
      await patternService.featured();

    return response.data.data.map(
      mapPatternDtoToModel
    );
  },
  async feature(id: string): Promise<Pattern> {

    const response =
      await patternService.feature(id);

    return mapPatternDtoToModel(
      response.data
    );
  },

  async unfeature(id: string): Promise<Pattern> {

    const response =
      await patternService.unfeature(id);

    return mapPatternDtoToModel(
      response.data
    );
  },

  async create(formData: FormData): Promise<Pattern> {

    const response =
      await patternService.create(formData);

    return mapPatternDtoToModel(
      response.data
    );
  },

  async update(
    id: string,
    data: unknown
  ): Promise<Pattern> {

    const response =
      await patternService.update(id, data);

    return mapPatternDtoToModel(
      response.data
    );
  },

  async delete(id: string): Promise<void> {

    await patternService.delete(id);
  },


  async updateStatus(id: string, status: string): Promise<Pattern> {
    const response =
      await patternService.updateStatus(id, status);

    return mapPatternDtoToModel(
      response.data
    );
  },

  async download(id: string): Promise<Blob> {
    return patternService.download(id);
  },
};