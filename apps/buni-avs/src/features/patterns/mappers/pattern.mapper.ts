

import type {
  Step1Data,
  Step2Data,
  Step3Data,
  CreatePatternPayload,
  Pattern,
  PatternDto,
} from '../types';
import { CSS_PATTERN_MAP, PatternOrigin, PatternSymbolism } from '@buni/patterns';
import type { UploadablePatternSymbol } from '../types/uploads/pattern.upload';

// ─────────────────────────────────────────────────────────────────────────────
// FORM STATE → API PAYLOAD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts validated form steps into
 * a typed CreatePatternPayload.
 */
export function toCreatePayload(s1: Step1Data, s2: Step2Data, s3: Step3Data): CreatePatternPayload {
  return {
    // ── Step 1 ──────────────────────────────────────────────────────────────
    nameFr: s1.nameFr,

    nameEn: s1.nameEn,

    nameLocal: s1.nameLocal,

    type: s1.patternType,

    region: s1.region,

    country: s1.country,

    license: s1.license,

    people: s1.people,

    flag: s1.flag,

    coords: s1.coords,

    kingdom: s1.kingdom,

    era: s1.era,

    // ── Step 2 ──────────────────────────────────────────────────────────────
    descFr: s2.descFr,

    descEn: s2.descEn,

    summary: s2.summary,

    history: s2.history,

    technique: s2.technique,

    symbolMeaning: s2.symbolMeaning,

    symbolUsage: s2.symbolUsage,

    ceremonial: s2.ceremonial,

    symbolKeywords: s2.symbolKeywords,

    // ── Step 3 ──────────────────────────────────────────────────────────────
    colors: s3.colors,

    sources: s3.sources,

    svgPattern: s3.svgPattern,

    artisanQuote: s3.artisanQuote,

    // Remove File before serialization
    symbols: s3.symbols.map(({ image: _image, ...rest }) => rest),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYLOAD → FORMDATA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds multipart FormData.
 */
export function toFormData(
  payload: CreatePatternPayload,
  svgFile: File | null,
  symbols: UploadablePatternSymbol[]
): FormData {
  const fd = new FormData();

  // ── Scalar fields ────────────────────────────────────────────────────────

  const scalars: (keyof CreatePatternPayload)[] = [
    'nameFr',
    'nameEn',
    'nameLocal',

    'type',

    'region',
    'country',

    'license',

    'symbolUsage',

    'descFr',
    'descEn',

    'summary',
    'history',
    'technique',

    'symbolMeaning',

    'ceremonial',

    'svgPattern',

    'people',

    'flag',

    'kingdom',

    'era',
  ];

  for (const key of scalars) {
    const value = payload[key];

    if (value !== undefined && value !== null) {
      // backend compatibility
      const fieldName = key === 'type' ? 'patternType' : key;

      fd.append(fieldName, String(value));
    }
  }

  // ── JSON fields ──────────────────────────────────────────────────────────

  if (payload.coords) {
    fd.append('coords', JSON.stringify(payload.coords));
  }

  fd.append('symbolKeywords', JSON.stringify(payload.symbolKeywords));

  fd.append('colors', JSON.stringify(payload.colors));

  fd.append('sources', JSON.stringify(payload.sources));

  fd.append('symbols', JSON.stringify(payload.symbols));

  if (payload.artisanQuote) {
    fd.append('artisanQuote', JSON.stringify(payload.artisanQuote));
  }

  // ── Files ────────────────────────────────────────────────────────────────

  if (svgFile) {
    fd.append('svgFile', svgFile);
  }

  symbols.forEach((symbol, index) => {
    if (symbol.image) {
      fd.append(`symbolImage_${index}`, symbol.image);
    }
  });

  return fd;
}

// ─────────────────────────────────────────────────────────────────────────────
// DTO → DOMAIN MODEL
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_ORIGIN: PatternOrigin = {
  country: '',
  people: '',
  region: 'west-africa',
  coords: [0, 0],
  flag: '',
};

const DEFAULT_SYMBOLISM: PatternSymbolism = {
  meaning: '',
  keywords: [],
  usage: 'universal',
};

export function mapPatternDtoToModel(dto: PatternDto): Pattern {
  return {
    id: dto.id,

    slug: dto.slug,

    // ── Names ──────────────────────────────────────────────────────────────

    name: dto.name || 'Sans titre',

    localName: dto.nameLocal || '',

    nameEn: dto.nameEn,

    // ── Media ──────────────────────────────────────────────────────────────

    imgUrl: dto.imgUrl || '',

    svgUrl: dto.svgUrl,

    svgPattern: dto.svgPattern,

    // ── Classification ─────────────────────────────────────────────────────

    type: dto.type,

    cssClass: dto.cssClass || CSS_PATTERN_MAP[dto.type] || 'avs-pattern-default',

    // ── Featured / Status ─────────────────────────────────────────────────

    featured: dto.isFeatured ?? false,

    status: dto.status,

    // ── Origin ─────────────────────────────────────────────────────────────

    origin: {
      ...DEFAULT_ORIGIN,
      ...dto.origin,
    },

    // ── Content ────────────────────────────────────────────────────────────

    summary: dto.summary || '',

    history: dto.history || '',

    technique: dto.technique || '',

    ceremonial: dto.ceremonial || '',

    era: dto.era || '',

    symbolism: {
      ...DEFAULT_SYMBOLISM,
      ...dto.symbolism,
    },

    // ── Collections ───────────────────────────────────────────────────────

    colors: dto.colors || [],

    symbols: dto.symbols || [],

    sources: dto.sources || [],

    // ── Quote ──────────────────────────────────────────────────────────────

    artisanQuote: dto.artisanQuote,

    // ── Metadata ───────────────────────────────────────────────────────────

    license: dto.license || 'cc-by',

    views: dto.views ?? 0,

    downloads: dto.downloads ?? 0,

    createdAt: dto.createdAt,

    updatedAt: dto.updatedAt,
  };
}
