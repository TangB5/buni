import { I18nProvider, messages } from '@buni/i18n';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messagesContent = await getMessages();

  return (
    <I18nProvider messages={messagesContent} locale={locale}>
      {children}
    </I18nProvider>
  );
}
