import { RegionType, PatternType, PatternColor, ArtisanQuote, PatternSymbolism } from "@buni/patterns";
import { UploadablePatternSymbol } from "../uploads/pattern.upload";
import { LicenseType, SymbolUsageType } from "../../constants/pattern.constants";

export interface Step1Data {
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
  summary: string;

  history: string;

  technique: string;

  ceremonial: string;

  symbolism?:PatternSymbolism;

 
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
  nameEn: string;

  nameLocal: string;

  patternType: PatternType;

  region: RegionType;

  country: string;

  license: LicenseType;

  people?: string;

  flag?: string;

  coords?: [number, number];

  kingdom?: string;

  era?: string;

  // Step 2
  summary: string;

  history: string;

  technique: string;

  ceremonial: string;

  symbolism?: {
    meaning: string;
    usage: string;
    keywords?: string[];
  };

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
