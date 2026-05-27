import type {
  Step1Data,
  Step2Data,
  Step3Data,
  CreatePatternPayload,
  UploadablePatternSymbol,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// FORM STATE → API PAYLOAD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts validated form steps into a typed CreatePatternPayload.
 * Does NOT touch FormData — that's the service's responsibility.
 */
export function toCreatePayload(
  s1: Step1Data,
  s2: Step2Data,
  s3: Step3Data,
): CreatePatternPayload {
  return {
    // Step 1
    nameFr:      s1.nameFr,
    nameEn:      s1.nameEn,
    nameLocal:   s1.nameLocal,
    type:        s1.patternType,
    region:      s1.region,
    country:     s1.country,
    license:     s1.license,
    people:      s1.people,
    flag:        s1.flag,
    coords:      s1.coords,
    kingdom:     s1.kingdom,
    era:         s1.era,

    // Step 2
    descFr:         s2.descFr,
    descEn:         s2.descEn,
    summary:        s2.summary,
    history:        s2.history,
    technique:      s2.technique,
    symbolMeaning:  s2.symbolMeaning,
    symbolUsage:    s2.symbolUsage,
    ceremonial:     s2.ceremonial,
    symbolKeywords: s2.symbolKeywords,

    // Step 3
    colors:      s3.colors,
    sources:     s3.sources,
    svgPattern:  s3.svgPattern,
    artisanQuote: s3.artisanQuote,
    // Strip File from symbols — files are appended separately in FormData
    symbols:     s3.symbols.map(({ image: _image, ...rest }) => rest),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYLOAD → FormData (for multipart upload)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the multipart FormData from the typed payload + file assets.
 */
export function toFormData(
  payload: CreatePatternPayload,
  svgFile: File | null,
  symbols: UploadablePatternSymbol[],
): FormData {
  const fd = new FormData();

  // ── Scalar fields ──────────────────────────────────────────────────────────
  const scalars: (keyof CreatePatternPayload)[] = [
    'nameFr', 'nameEn', 'nameLocal', 'type', 'region',
    'country', 'license', 'symbolUsage', 'descFr', 'descEn',
    'summary', 'history', 'technique', 'symbolMeaning', 'ceremonial',
    'svgPattern', 'people', 'flag', 'kingdom', 'era',
  ];

  for (const key of scalars) {
    const val = payload[key];
    if (val !== undefined && val !== null) {
      // Rename 'type' to 'patternType' for backend compatibility
      const fieldName = key === 'type' ? 'patternType' : key;
      fd.append(fieldName, String(val));
    }
  }

  // ── JSON-serialized fields ─────────────────────────────────────────────────
  if (payload.coords) {
    fd.append('coords', JSON.stringify(payload.coords));
  }
  fd.append('symbolKeywords', JSON.stringify(payload.symbolKeywords));
  fd.append('colors',         JSON.stringify(payload.colors));
  fd.append('sources',        JSON.stringify(payload.sources));
  fd.append('symbols',        JSON.stringify(payload.symbols));

  if (payload.artisanQuote) {
    fd.append('artisanQuote', JSON.stringify(payload.artisanQuote));
  }

  // ── File assets ────────────────────────────────────────────────────────────
  if (svgFile) {
    fd.append('svgFile', svgFile);
  }

  symbols.forEach((sym, i) => {
    if (sym.image) {
      fd.append(`symbolImage_${i}`, sym.image);
    }
  });

  return fd;
}