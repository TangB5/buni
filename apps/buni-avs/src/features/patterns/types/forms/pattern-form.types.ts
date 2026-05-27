import { PatternType, PatternColor, ArtisanQuote } from "packages/patterns/dist";
import { RegionType, LicenseType, SymbolUsageType, UploadablePatternSymbol } from "..";

export interface Step1Data {
  nameFr: string;

  nameLocal: string;

  nameEn: string;

  patternType: PatternType;

  region: RegionType;

  country: string;

  people?: string;

  flag?: string;

  coords?: [number, number];

  kingdom?: string;

  era?: string;

  license: LicenseType;
}

export interface Step2Data {
  descFr: string;

  descEn: string;

  summary: string;

  history: string;

  technique: string;

  symbolMeaning: string;

  ceremonial: string;

  symbolKeywords: string[];

  symbolUsage: SymbolUsageType;
}

export interface Step3Data {
  colors: PatternColor[];

  svgPattern?: string;

  artisanQuote?: ArtisanQuote;

  sources: string[];

  symbols: UploadablePatternSymbol[];
}

export interface PatternFormState {
  step1: Partial<Step1Data>;

  step2: Partial<Step2Data>;

  step3: Partial<Step3Data>;

  svgFile: File | null;

  currentStep: number;
}

// ─────────────────────────────────────────────────────────────
// API PAYLOAD
// ─────────────────────────────────────────────────────────────

export interface CreatePatternPayload {
  // Step 1
  nameFr: string;

  nameEn: string;

  nameLocal: string;

  type: PatternType;

  region: RegionType;

  country: string;

  license: LicenseType;

  people?: string;

  flag?: string;

  coords?: [number, number];

  kingdom?: string;

  era?: string;

  // Step 2
  descFr: string;

  descEn: string;

  summary: string;

  history: string;

  technique: string;

  symbolMeaning: string;

  symbolUsage: SymbolUsageType;

  ceremonial: string;

  symbolKeywords: string[];

  // Step 3
  colors: PatternColor[];

  sources: string[];

  svgPattern?: string;

  artisanQuote?: ArtisanQuote;

  symbols: Omit<
    UploadablePatternSymbol,
    'image'
  >[];
}
