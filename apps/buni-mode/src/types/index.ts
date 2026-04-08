// ──────────────────────────────────────────────────────────────────────────────
// FILE: apps/buni-mode/src/types/index.ts
// ──────────────────────────────────────────────────────────────────────────────
export {}; // placeholder

import { z } from 'zod';
 
// ── Mannequin ─────────────────────────────────────────────────────────────────
export const MorphTypeEnum   = z.enum(['feminin', 'masculin', 'non-binaire']);
export const SkinToneEnum    = z.enum(['clair', 'bronze', 'hâlé', 'brun', 'ébène', 'noir-profond']);
export const MorphSizeEnum   = z.enum(['XS','S','M','L','XL','XXL']);
 
export const MannequinSchema = z.object({
  id:       z.string().uuid(),
  morphType:MorphTypeEnum,
  skinTone: SkinToneEnum,
  size:     MorphSizeEnum,
  height:   z.number().min(140).max(220),
  bust:     z.number().optional(),
  waist:    z.number().optional(),
  hips:     z.number().optional(),
});
export type Mannequin = z.infer<typeof MannequinSchema>;
 
// ── Vêtement ──────────────────────────────────────────────────────────────────
export const GarmentTypeEnum = z.enum([
  'haut','bas','robe','ensemble','boubou','dashiki','kaftan',
  'wrapper','headwrap','accessoire','chaussures','sac',
]);
export const FabricEnum = z.enum([
  'wax','kente','bazin','ndop','bogolan','soie','coton','raphia','autre',
]);
 
export const GarmentSchema = z.object({
  id:          z.string().uuid(),
  name:        z.string(),
  designerId:  z.string().uuid(),
  type:        GarmentTypeEnum,
  fabric:      FabricEnum,
  colors:      z.array(z.string()),
  patternCss:  z.string().optional(),
  imageUrl:    z.string().url().optional(),
  price:       z.number().optional(),
  currency:    z.string().default('XAF'),
  isPublished: z.boolean().default(false),
  tags:        z.array(z.string()),
});
export type Garment = z.infer<typeof GarmentSchema>;
 
// ── Tenue complète ────────────────────────────────────────────────────────────
export const OutfitSchema = z.object({
  id:          z.string().uuid(),
  name:        z.string(),
  creatorId:   z.string().uuid(),
  mannequin:   MannequinSchema,
  garments:    z.array(GarmentSchema),
  occasion:    z.string().optional(),
  season:      z.enum(['printemps','été','automne','hiver','toute-saison']).optional(),
  isPublished: z.boolean().default(false),
  likes:       z.number().default(0),
  createdAt:   z.string().datetime(),
});
export type Outfit = z.infer<typeof OutfitSchema>;
 
// ── Styliste / Designer ───────────────────────────────────────────────────────
export const DesignerSchema = z.object({
  id:          z.string().uuid(),
  userId:      z.string().uuid(),
  displayName: z.string(),
  bio:         z.string(),
  country:     z.string(),
  city:        z.string(),
  specialty:   z.array(GarmentTypeEnum),
  fabrics:     z.array(FabricEnum),
  avatarUrl:   z.string().url().optional(),
  coverUrl:    z.string().url().optional(),
  instagram:   z.string().optional(),
  website:     z.string().url().optional(),
  verified:    z.boolean().default(false),
  outfits:     z.number().default(0),
  followers:   z.number().default(0),
  collections: z.number().default(0),
});
export type Designer = z.infer<typeof DesignerSchema>;
 
// ── Collection ────────────────────────────────────────────────────────────────
export const CollectionSchema = z.object({
  id:          z.string().uuid(),
  name:        z.string(),
  designerId:  z.string().uuid(),
  season:      z.string(),
  year:        z.number(),
  outfits:     z.array(OutfitSchema),
  coverUrl:    z.string().url().optional(),
  description: z.string(),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  views:       z.number().default(0),
});
export type Collection = z.infer<typeof CollectionSchema>;
