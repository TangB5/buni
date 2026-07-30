import fr from './locales/fr.json';
import en from './locales/en.json';

export const locales = ['fr', 'en'] as const;
export const defaultLocale = 'fr' as const;

export const messages = {
  fr,
  en,
} as const;

export type Locale = (typeof locales)[number];
