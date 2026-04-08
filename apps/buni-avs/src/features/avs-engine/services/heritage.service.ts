// =============================================================================
// Feature avs-engine — Heritage Service
// Couche d'abstraction pour les appels API patrimoniaux
// =============================================================================

import { get, post, put, del } from '@/core/api/client';
import type { HeritagePiece } from '../types';

// ── Query keys ────────────────────────────────────────────────────────────────
export const heritageKeys = {
  all:      ['heritage'] as const,
  lists:    () => [...heritageKeys.all, 'list'] as const,
  list:     (q?: Record<string, unknown>) => [...heritageKeys.lists(), q] as const,
  detail:   (id: string)   => [...heritageKeys.all, 'detail', id] as const,
  bySlug:   (slug: string) => [...heritageKeys.all, 'slug', slug] as const,
  featured: () => [...heritageKeys.all, 'featured'] as const,
  cameroon: () => [...heritageKeys.all, 'cameroon'] as const,
};

// ── Paramètres de recherche ───────────────────────────────────────────────────
export interface HeritageQuery {
  page?:        number;
  perPage?:     number;
  search?:      string;
  patternType?: string;
  region?:      string;
  country?:     string;
  featured?:    boolean;
}

export interface HeritageListResponse {
  data:       HeritagePiece[];
  totalItems: number;
  totalPages: number;
  page:       number;
  perPage:    number;
}

// ── Service ───────────────────────────────────────────────────────────────────
export const heritageService = {

  // Lister avec filtres
  list: (query: HeritageQuery = {}) =>
    get<HeritageListResponse>('/heritage', query as Record<string, unknown>),

  // Récupérer par slug
  bySlug: (slug: string) =>
    get<HeritagePiece>(`/heritage/${slug}`),

  // Récupérer par ID
  byId: (id: string) =>
    get<HeritagePiece>(`/heritage/id/${id}`),

  // Pièces en vedette
  featured: () =>
    get<HeritagePiece[]>('/heritage/featured'),

  // Patrimoine camerounais spécifiquement
  cameroon: () =>
    get<HeritagePiece[]>('/heritage?country=CM&perPage=12'),

  // Créer une pièce
  create: (data: Omit<HeritagePiece, 'id' | 'createdAt'>) =>
    post<HeritagePiece>('/heritage', data),

  // Mettre à jour
  update: (id: string, data: Partial<HeritagePiece>) =>
    put<HeritagePiece>(`/heritage/${id}`, data),

  // Supprimer
  remove: (id: string) =>
    del<void>(`/heritage/${id}`),

  // Incrémenter les vues (fire-and-forget)
  trackView: (id: string): void => {
    void post(`/heritage/${id}/view`).catch(() => {/* silencieux */});
  },
};