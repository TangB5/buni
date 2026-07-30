export { I18nProvider } from './providers/i18n-provider';
export { useTranslations } from './hooks/use-i18n';
export { useLocale } from './hooks/use-locale';
export { LocaleToggle } from './components/locale-toggle';
export { locales, defaultLocale, messages } from './config';
export { getTranslations, getMessages } from './helpers/get-translations';
export type { Locale } from './config';

// Re-export types from next-intl
export type { TranslationValues } from 'next-intl';
