import { del, get, post, put } from 'apps/buni-avs/src/core/api/client';
import { toFormData, toCreatePayload } from '../mappers/pattern.mapper';
import type {
  Pattern,
  PatternFilters,
  PatternListResponse,
  PatternSymbol,
  Step1Data,
  Step2Data,
  Step3Data,
} from '../types';

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

  // ── WRITE ──────────────────────────────────────────────────────────────────

  /**
   * Création d'un motif depuis le formulaire multi-step.
   * Construit le FormData via le mapper et envoie en multipart
   * (fichiers SVG + images de symboles inclus).
   *
   * Usage dans usePatternForm :
   *   await patternService.createFromForm(step1, step2, step3, svgFile, symbols);
   */
  // createFromForm: async (
  //   step1: Step1Data,
  //   step2: Step2Data,
  //   step3: Step3Data,
  //   svgFile: File | null,
  //   symbols: PatternSymbol[],
  // ): Promise<Pattern> => {
  //   const payload = toCreatePayload(step1, step2, step3);
  //   const fd      = toFormData(payload, svgFile, symbols);

  //   // fetch direct : le client interne envoie du JSON, pas du multipart.
  //   const res = await fetch('/api/v1/patterns', {
  //     method: 'POST',
  //     body: fd,
  //     // Pas de Content-Type : le browser pose lui-même le boundary multipart
  //   });

  //   if (!res.ok) {
  //     const body = await res.json().catch(() => ({})) as {
  //       message?: string;
  //       errors?: Record<string, string>;
  //     };
  //     throw new PatternServiceError(
  //       body.message ?? `Erreur serveur (${res.status})`,
  //       res.status,
  //       body.errors,
  //     );
  //   }

  //   return res.json() as Promise<Pattern>;
  // },

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
  },
};