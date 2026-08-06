import { useTranslations } from '@/i18n';
import { COMBOS, CULTURAL_CONTEXT, SWATCH_LIBRARY } from './data';
import { Combo, SwatchFamily } from './data';

export function useColorsData() {
  const t = useTranslations('colors.combosData');
  const culturalT = useTranslations('colors.culturalContext');
  const swatchT = useTranslations('colors.swatchLibrary');

  // Map region keys from French to translation keys
  const regionKeyMap: Record<string, string> = {
    "Afrique de l'Ouest": 'west-africa',
    'Afrique Centrale': 'central-africa',
    'Afrique de l\'Est': 'east-africa',
    'Afrique Australe': 'southern-africa',
    'Afrique du Nord': 'north-africa',
    'Pan-Africain': 'pan-african',
    'International': 'international',
  };

  // Transform combos with translations
  const translatedCombos: Combo[] = COMBOS.map((combo) => {
    const comboData = t.raw(combo.id) as any;
    
    return {
      ...combo,
      name: comboData?.name || combo.name,
      origin: comboData?.origin || combo.origin,
      description: comboData?.description || combo.description,
      colors: combo.colors.map((color) => {
        const colorData = comboData?.colors?.[color.role] as any;
        return {
          ...color,
          name: colorData?.name || color.name,
          meaning: colorData?.meaning || color.meaning,
          origin: colorData?.origin || color.origin,
        };
      }),
    };
  });

  // Transform cultural context with translations
  const translatedCulturalContext = Object.keys(CULTURAL_CONTEXT).reduce((acc, region) => {
    const key = regionKeyMap[region];
    const contextData = culturalT.raw(key) as any;
    const localContext = CULTURAL_CONTEXT[region];
    acc[region] = {
      description: contextData?.description || localContext?.description || '',
      significance: contextData?.significance || localContext?.significance || '',
    };
    return acc;
  }, {} as typeof CULTURAL_CONTEXT);

  // Transform swatch library with translations
  const translatedSwatchLibrary: SwatchFamily[] = SWATCH_LIBRARY.map((family) => {
    const familyData = swatchT.raw(family.id) as any;
    return {
      ...family,
      label: familyData?.label || family.label,
      swatches: family.swatches.map((swatch, index) => {
        const swatchData = familyData?.swatches?.[index] as any;
        return {
          ...swatch,
          name: swatchData?.name || swatch.name,
          meaning: swatchData?.meaning || swatch.meaning,
        };
      }),
    };
  });

  return {
    combos: translatedCombos,
    culturalContext: translatedCulturalContext,
    swatchLibrary: translatedSwatchLibrary,
  };
}
