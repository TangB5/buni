export { I18nProvider } from './providers/i18n-provider';
export { useTranslations } from './hooks/use-i18n';
export { locales, defaultLocale, messages } from './config';
export type { Locale } from './config';

// Re-export types from next-intl
export type { TranslationValues } from 'next-intl';
