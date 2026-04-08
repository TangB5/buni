import { z } from 'zod';
import type { AvsRegion, AvsPatternType, CameroonPattern } from '@/core/constants/avs';

// ── Schémas Zod ──────────────────────────────────────────────────────────────
export const HeritagePieceSchema = z.object({
  id:          z.string().uuid(),
  slug:        z.string().min(3).max(64).regex(/^[a-z0-9-]+$/),
  title:       z.object({ fr: z.string(), en: z.string() }),
  description: z.object({ fr: z.string(), en: z.string() }),
  patternType: z.custom<AvsPatternType>(),
  region:      z.custom<AvsRegion>(),
  colors:      z.object({
    primary:    z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondary:  z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accent:     z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  }),
  cameroon:    z.object({
    pattern:   z.custom<CameroonPattern>().optional(),
    ethnicity: z.string().max(64).optional(),
    kingdom:   z.string().max(128).optional(),
  }).optional(),
  assets:      z.object({
    svgUrl:     z.string().url().optional(),
    imageUrl:   z.string().url().optional(),
  }),
  isPublished: z.boolean(),
  isFeatured:  z.boolean(),
  createdAt:   z.string().datetime(),
});

export type HeritagePiece = z.infer<typeof HeritagePieceSchema>;

export interface AvsEngineState {
  pieces:       HeritagePiece[];
  selected:     HeritagePiece | null;
  isLoading:    boolean;
  error:        string | null;
  searchQuery:  string;
  activeFilter: AvsPatternType | 'all';
}
