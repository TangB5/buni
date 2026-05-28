import { PatternSymbol } from '@buni/patterns';

export interface UploadablePatternSymbol
  extends PatternSymbol {
  image?: File;
}
