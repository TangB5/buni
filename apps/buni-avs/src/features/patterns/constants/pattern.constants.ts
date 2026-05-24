import type { LicenseType, PatternType, RegionType, SymbolUsageType } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// FORM STEPS
// ─────────────────────────────────────────────────────────────────────────────

export const FORM_STEPS = [
  { label: 'Identité',          desc: 'Nom & origine géographique' },
  { label: 'Description',       desc: 'Contexte & symbolisme'      },
  { label: 'Couleurs & Assets', desc: 'Palette & fichier SVG'      },
  { label: 'Révision',          desc: 'Vérification avant envoi'   },
] as const;

export type StepIndex = 0 | 1 | 2 | 3;

// ─────────────────────────────────────────────────────────────────────────────
// PATTERN TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const PATTERN_TYPES: PatternType[] = [
  'kente', 'bogolan', 'adinkra', 'ndebele', 'ndop', 'wax', 'kuba', 'berber',
];

// ─────────────────────────────────────────────────────────────────────────────
// REGIONS
// ─────────────────────────────────────────────────────────────────────────────

export const REGIONS: { value: RegionType; label: string }[] = [
  { value: 'west-africa',    label: "Afrique de l'Ouest" },
  { value: 'east-africa',    label: "Afrique de l'Est"   },
  { value: 'central-africa', label: 'Afrique Centrale'   },
  { value: 'north-africa',   label: "Afrique du Nord"    },
  { value: 'south-africa',   label: 'Afrique Australe'   },
  { value: 'diaspora',       label: 'Diaspora'            },
];

// ─────────────────────────────────────────────────────────────────────────────
// SYMBOL USAGES
// ─────────────────────────────────────────────────────────────────────────────

export const SYMBOL_USAGES: SymbolUsageType[] = [
  'ceremonial', 'daily', 'royal', 'spiritual', 'universal',
];

// ─────────────────────────────────────────────────────────────────────────────
// LICENSES
// ─────────────────────────────────────────────────────────────────────────────

export const LICENSES: { value: LicenseType; label: string }[] = [
  { value: 'cc0',         label: 'CC0'         },
  { value: 'cc-by',       label: 'CC BY'       },
  { value: 'cc-by-sa',    label: 'CC BY-SA'    },
  { value: 'proprietary', label: 'Proprietary' },
];

// ─────────────────────────────────────────────────────────────────────────────
// CSS PATTERN MAP — PatternType → Tailwind/AVS CSS class
// ─────────────────────────────────────────────────────────────────────────────

export const CSS_PATTERN_MAP: Record<PatternType, string> = {
  kente:   'avs-pattern-kente-royale',
  bogolan: 'avs-pattern-bogolan-fanga',
  adinkra: 'avs-pattern-adinkra-sankofa',
  ndebele: 'avs-pattern-wax-dakar',
  ndop:    'avs-pattern-ndop-sultan',
  wax:     'avs-pattern-wax-dakar',
  kuba:    'avs-pattern-kuba-kasai',
  berber:  'avs-pattern-bogolan-fanga',
};

export const FALLBACK_PATTERN_CSS = 'avs-pattern-wax-dakar';

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT COLORS — pre-filled palette
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_COLORS = [
  { hex: '#C0573E', name: 'Primaire',   meaning: 'Couleur principale'  },
  { hex: '#F5EBE0', name: 'Secondaire', meaning: 'Couleur secondaire'  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT SYMBOL — empty template
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_SYMBOL = {
  name: '', nameFr: '', cssPreview: '',
  meaning: '', usage: '', sacred: false, image: undefined,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FIELD LIMITS
// ─────────────────────────────────────────────────────────────────────────────

export const FIELD_LIMITS = {
  summary:       500,
  descFr:       2000,
  descEn:       2000,
  history:      2000,
  technique:    1000,
  ceremonial:   1000,
  symbolMeaning: 512,
  keywordsMax:    10,
  colorsMax:       5,
  symbolsMax:     20,
  sourcesMax:     10,
} as const;