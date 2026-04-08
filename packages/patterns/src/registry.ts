// =============================================================================
// AVS — Système de gestion des motifs SVG
// src/core/utils/svg-patterns.ts
//
// COMMENT UTILISER VOS FICHIERS SVG :
// 1. Placez vos SVG dans : public/patterns/
//    ex: public/patterns/ndop-bamoum.svg
//        public/patterns/toghu-bamileke.svg
//        public/patterns/kente-asante.svg
//
// 2. Déclarez-les dans le registre SVG_REGISTRY ci-dessous
//
// 3. Utilisez <SvgPattern name="ndop-bamoum" /> dans vos composants
//    — le SVG est chargé via Next.js Image ou affiché inline
// =============================================================================

// ── Registre de tous vos SVG ───────────────────────────────────────────────────
// Ajoutez chaque fichier SVG ici avec ses métadonnées
export const SVG_REGISTRY = {
  // ── Cameroun ──────────────────────────────────────────────────────────────
  'ndop-bamoum': {
    file:        '/patterns/ndop-bamoum.svg',
    name:        'Ndop Bamoum',
    origin:      'Foumban, Cameroun',
    type:        'ndop' as const,
    region:      'central-africa' as const,
    colors:      ['#0D2340', '#C8A96E', '#F5EBE0'],
    description: 'Tissu sacré du Sultanat Bamoum',
    license:     'cc-by' as const,
  },
  'toghu-bamileke': {
    file:        '/patterns/toghu-bamileke.svg',
    name:        'Toghu Bamiléké',
    origin:      'Bafoussam, Cameroun',
    type:        'ndop' as const,
    region:      'central-africa' as const,
    colors:      ['#1D1D1B', '#C0573E', '#D4A017'],
    description: 'Tissu de velours brodé des chefferies Bamiléké',
    license:     'cc-by' as const,
  },
  // ── Afrique de l'Ouest ────────────────────────────────────────────────────
  'toghu-bamenda': {
    file:        '/patterns/toghu-bamenda.svg',
    name:        'Toghu Bamenda',
    origin:      'Bamenda, Cameroun',
    type:        'ndop' as const,
    region:      'central-africa' as const,
    colors:      ['#D4A017', '#1D1D1B', '#C0573E'],
    description: 'Tissu de velours brodé des hauts plateaux de Bamenda',
    license:     'cc-by' as const,
  },
  // Ajoutez vos SVG ici en suivant le même format :
  // 'mon-motif': {
  //   file: '/patterns/mon-motif.svg',
  //   name: 'Nom du motif',
  //   origin: 'Origine',
  //   type: 'kente',
  //   region: 'west-africa',
  //   colors: ['#hex1', '#hex2'],
  //   description: 'Description courte',
  //   license: 'cc-by',
  // },
} as const;

export type SvgPatternKey = keyof typeof SVG_REGISTRY;
export type SvgPatternMeta = typeof SVG_REGISTRY[SvgPatternKey];

// ── Utilitaires ────────────────────────────────────────────────────────────────

/** Retourne les métadonnées d'un motif SVG */
export function getSvgMeta(key: SvgPatternKey): SvgPatternMeta {
  return SVG_REGISTRY[key];
}

/** Retourne l'URL publique du SVG (pour <img src> ou téléchargement) */
export function getSvgUrl(key: SvgPatternKey): string {
  return SVG_REGISTRY[key].file;
}

/** Liste tous les motifs d'un type donné */
export function getSvgsByType(type: SvgPatternMeta['type']): SvgPatternKey[] {
  return (Object.keys(SVG_REGISTRY) as SvgPatternKey[]).filter(
    k => SVG_REGISTRY[k].type === type
  );
}

/** Liste tous les motifs d'une région */
export function getSvgsByRegion(region: SvgPatternMeta['region']): SvgPatternKey[] {
  return (Object.keys(SVG_REGISTRY) as SvgPatternKey[]).filter(
    k => SVG_REGISTRY[k].region === region
  );
}

/** Génère le contenu du fichier de téléchargement JSON (pour export palette) */
export function generatePaletteJson(key: SvgPatternKey): string {
  const meta = SVG_REGISTRY[key];
  return JSON.stringify({
    name:    meta.name,
    origin:  meta.origin,
    type:    meta.type,
    colors:  meta.colors,
    license: meta.license,
    source:  `AVS — African Visual Standard · avs-standard.com`,
  }, null, 2);
}