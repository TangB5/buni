import { messages } from '../config';

/**
 * Server-side helper to get translations for metadata generation
 * This uses the local messages directly instead of next-intl/server
 * to avoid configuration issues in generateMetadata
 */
export async function getTranslations(namespace?: string, locale: string = 'fr') {
  // Return a function that can access nested translations
  return (key: string) => {
    const keys = key.split('.');
    let value: any = messages[locale as keyof typeof messages];
    
    if (namespace) {
      value = value[namespace];
      if (!value) return key;
    }
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    return value;
  };
}

/**
 * Get all messages for a locale (useful for metadata)
 */
export function getMessages(locale: string) {
  return messages[locale as keyof typeof messages];
}
