import { del, get, post, put } from 'apps/buni-avs/src/core/api/client';
import { toFormData, toCreatePayload } from '../mappers/pattern.mapper';
import type {
  
  PatternFilters,
  PatternListResponse,
  PatternSymbol,
  Step1Data,
  Step2Data,
  Step3Data,
} from '../types';
import { Pattern,CSS_PATTERN_MAP } from '@buni/patterns';

// ─────────────────────────────────────────────────────────────────────────────
// ERROR
// ─────────────────────────────────────────────────────────────────────────────

export class PatternServiceError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'PatternServiceError';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export const patternService = {

  // ── READ ───────────────────────────────────────────────────────────────────

  list: (filters: PatternFilters = {}) =>
    get<PatternListResponse>('/api/v1/patterns', filters as Record<string, unknown>),

  bySlug: (slug: string) =>
    get<Pattern>(`/api/v1/patterns/${slug}`),

  featured: () =>
    get<Pattern[]>('/api/v1/patterns?featured=true&perPage=6'),

  /**
   * Charge + transforme les motifs
   */
  loadPatterns: async (
    filters: PatternFilters = {},
  ): Promise<Pattern[]> => {
    try {
      const result = await patternService.list({
        perPage: 100,
        ...filters,
      });

      return (result.data || []).map((pattern: Pattern): Pattern => ({
        id: pattern.id,
        slug: pattern.slug,
        name: pattern.name,
        localName: pattern.localName || '',
        type: pattern.type,

        cssClass:
          pattern.cssClass ||
          CSS_PATTERN_MAP[pattern.type] ||
          'avs-pattern-wax-dakar',

        origin: {
          country: pattern.origin?.country || '',
          people: pattern.origin?.people || '',
          region: pattern.origin?.region || '',
          coords: pattern.origin?.coords || [0, 0],
          flag: pattern.origin?.flag || '',
        },

        summary: pattern.summary || '',
        history: pattern.history || '',
        technique: pattern.technique || '',
        ceremonial: pattern.ceremonial || '',
        era: pattern.era || '',

        symbolism: pattern.symbolism || {
          meaning: '',
          keywords: [],
          usage: 'universal',
        },

        downloads: pattern.downloads || 0,
        views: pattern.views || 0,

        colors: pattern.colors || [],
        symbols: pattern.symbols || [],
        sources: pattern.sources || [],

        artisanQuote: pattern.artisanQuote,
        svgPattern: pattern.svgPattern,

        license: pattern.license || 'cc-by',

        createdAt: pattern.createdAt,
        updatedAt: pattern.updatedAt,

        published: true,
        featured: false,
      }));
    } catch (error) {
      console.error('Failed to load patterns:', error);
      throw error;
    }
  },
  
  createFromForm: async (
  step1: Step1Data,
    step2: Step2Data,
    step3: Step3Data,
    svgFile: File | null,
    symbols: PatternSymbol[],
): Promise<Pattern> => {
  const payload = toCreatePayload(step1, step2, step3);
  const fd = toFormData(payload, svgFile, symbols);

  return post<Pattern>('/api/v1/patterns', fd);
},

  /**
   * Mise à jour partielle (JSON — pas de fichier).
   */
  update: (id: string, data: Partial<Pattern>) =>
    put<Pattern>(`/api/v1/patterns/${id}`, data),

  remove: (id: string) =>
    del<void>(`/api/v1/patterns/${id}`),

  // ── ACTIONS ────────────────────────────────────────────────────────────────

  publish: (id: string) =>
    post<Pattern>(`/api/v1/patterns/${id}/publish`),

  /** Fire-and-forget : échoue silencieusement. */
  trackView: (id: string): void => {
    void post(`/api/v1/patterns/${id}/view`).catch(() => { /* silencieux */ });

    /**
   * charger les motif
   */
  
  },
};