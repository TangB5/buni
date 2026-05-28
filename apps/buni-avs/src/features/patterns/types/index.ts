export * from './models/pattern.model';

export * from './dto/pattern.dto';

export * from './api/pattern.responses';

export * from './forms/pattern-form.types';

export * from './filters/pattern.filters';

export * from './enums/pattern.enums';



// // =============================================================================
// // Feature Patterns — Frontend Types
// //
// // Source of truth:
// //   @buni/patterns
// //
// // Ce fichier contient UNIQUEMENT :
// // - types frontend
// // - états formulaire
// // - payloads UI
// // - pagination/filtering
// //
// // Le domaine métier vient du package partagé.
// // =============================================================================

// import type {
//   Pattern,
//   PatternType,
//   PatternLicense,
//   PatternColor,
//   PatternSymbol,
//   PatternSymbolism,
//   PatternOrigin,
//   ArtisanQuote,
// } from '@buni/patterns';

// // ─────────────────────────────────────────────────────────────
// // TYPES DÉRIVÉS
// // ─────────────────────────────────────────────────────────────




// // ─────────────────────────────────────────────────────────────
// // FILTERS & PAGINATION
// // ─────────────────────────────────────────────────────────────



// export interface PatternListResponse {
//   data: Pattern[];

//   totalItems: number;

//   totalPages: number;

//   page: number;
// }

// // ─────────────────────────────────────────────────────────────
// // FORM TYPES
// // ─────────────────────────────────────────────────────────────


// // ─────────────────────────────────────────────────────────────
// // MULTI-STEP FORM
// // ─────────────────────────────────────────────────────────────

// // ─────────────────────────────────────────────────────────────
// // FORM ERRORS
// // ─────────────────────────────────────────────────────────────

// export interface FieldErrors {
//   [key: string]: string;
// }

// export interface PatternDto {
//   id: string;
//   slug: string;
//   name: string;
//   nameLocal: string;
//   imgUrl: string;
//   type: string;
//   status: string;
//   isFeatured: boolean;

//   origin?: {
//     country?: string;
//     people?: string;
//     region?: string;
//     coords?: [number, number];
//     flag?: string;
//   };

//   colors?: PatternColor[];
//   symbols?: PatternSymbol[];

//   summary?: string;
//   history?: string;
// }
// // ─────────────────────────────────────────────────────────────
// // RE-EXPORT DOMAIN TYPES
// // ─────────────────────────────────────────────────────────────

// export type {
//   Pattern,
//   PatternColor,
//   PatternSymbol,
//   PatternSymbolism,
//   PatternOrigin,
//   ArtisanQuote,
// };