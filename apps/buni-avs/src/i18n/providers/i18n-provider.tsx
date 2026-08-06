'use client';

import { NextIntlClientProvider } from 'next-intl';

export function I18nProvider({ children, ...props }: any) {
  return (
    <NextIntlClientProvider timeZone="Europe/Paris" {...props}>
      {children}
    </NextIntlClientProvider>
  );
}
