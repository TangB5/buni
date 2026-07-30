import { getTranslations as getNextIntlTranslations } from 'next-intl/server';
import { messages } from '../config';

/**
 * Server-side helper to get translations for metadata generation
 * This is a thin wrapper around next-intl's getTranslations
 */
export async function getTranslations(namespace?: string) {
  return getNextIntlTranslations(namespace);
}

/**
 * Get all messages for a locale (useful for metadata)
 */
export function getMessages(locale: string) {
  return messages[locale as keyof typeof messages];
}
