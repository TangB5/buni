import { patternService } from '../services/pattern.service';

import { mapPatternDtoToModel } from '../mappers/pattern.mapper';

import type {
  Pattern,
  PatternFilters,
  PatternDto,
  PatternListResponse,
} from '../types';

export const patternRepository = {
  async findAll(
    filters: PatternFilters = {}
  ): Promise<Pattern[]> {

    const response: PatternListResponse =
      await patternService.list(filters);

    return response.data.data.map(
      (dto: PatternDto) =>
        mapPatternDtoToModel(dto)
    );
  },

  async findBySlug(slug: string): Promise<Pattern> {

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
};