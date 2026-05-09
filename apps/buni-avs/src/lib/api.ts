 const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface Pattern {
  props: {
    id: string;
    slug: string;
    nameFr: string;
    nameEn: string;
    descFr: string;
    descEn: string;

    patternType: 'ndop' | 'kente' | 'bogolan' | 'adinkra' | 'ndebele' | 'kuba' | 'wax';
    region:
      | 'west-africa'
      | 'east-africa'
      | 'central-africa'
      | 'north-africa'
      | 'south-africa'
      | 'diaspora';
    country: string;

    colors: {
      primary: string;
      secondary: string;
      accent?: string;
    };

    symbolism: {
      meaning: string;
      keywords: string[];
      usage: 'ceremonial' | 'daily' | 'royal' | 'spiritual' | 'universal';
    };

    isPublished: boolean;
    isFeatured: boolean;

    viewCount: number;

    svgUrl?: string;
    previewUrl?: string;

    createdAt: string;
    updatedAt: string;
  };
}

export interface PatternsListParams {
  page?: number;
  perPage?: number;
  region?: string;
  patternType?: string;
  search?: string;
}

export async function fetchPatterns(params?: PatternsListParams): Promise<ApiResponse<Pattern[]>> {
  const url = new URL(`${API_BASE_URL}/api/v1/patterns`);
  if (params) {
    if (params.page) url.searchParams.append('page', params.page.toString());
    if (params.perPage) url.searchParams.append('perPage', params.perPage.toString());
    if (params.region) url.searchParams.append('region', params.region);
    if (params.patternType) url.searchParams.append('patternType', params.patternType);
    if (params.search) url.searchParams.append('search', params.search);
  }

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`Failed to fetch patterns: ${response.statusText}`);
  return response.json();
}

export async function fetchPatternBySlug(slug: string): Promise<ApiResponse<Pattern>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/patterns/${slug}`);
  if (!response.ok) throw new Error(`Failed to fetch pattern: ${response.statusText}`);
  return response.json();
}
