// Backend-driven pattern system
export { pattern } from './UniversalPattern';

// Types
export type {
  Pattern,
  PatternType,
  PatternColor,
  PatternSymbol,
  PatternOrigin,
  ArtisanQuote,
  PatternLicense,
  
} from './registry';

// Transformers
export {
  
  getPatternsByType,
  getPatternsByCountry,
  getSacredPatterns,
  searchPatterns,
  getPatternPalette,
  generatePaletteJson,
  getSacredSymbols,
  getCssVariables,
  isPattern,
} from './registry';

// CSS pattern mappings for frontend display
export const CSS_PATTERN_MAP: Record<string, string> = {
  NDOP:    'avs-pattern-ndop-sultan',
  KENTE:   'avs-pattern-kente-royale',
  BOGOLAN: 'avs-pattern-bogolan-fanga',
  WAX:     'avs-pattern-wax-dakar',
  ADINKRA: 'avs-pattern-adinkra-sankofa',
  TOGHU:   'avs-pattern-toghu-bamileke',
  MUDCLOTH: 'avs-pattern-mudcloth',
  BARKCLOTH: 'avs-pattern-barkcloth',
  KUBA:    'avs-pattern-kuba-kasai',
  BERBER:  'avs-pattern-berber-amazigh',
  NDEBELE: 'avs-pattern-ndebele-amabhaxa',
};
