import { I18nProvider, messages } from '@buni/i18n';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Providers } from '../../components/layout/Providers';
import { AuthListener } from '../../components/auth/AuthListener';
import { AuthHydrator } from '../../components/auth/AuthHydrator';
import { ErrorBoundary } from '../../components/feedback';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <I18nProvider messages={messages[locale as keyof typeof messages]} locale={locale}>
      <ErrorBoundary>
        <Providers>
          <AuthHydrator />
          <AuthListener />

          <a
            href="#main-content"
            className="focus:rounded-avs focus:bg-avs-primary focus:text-avs-secondary sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:text-sm focus:font-bold"
          >
            Aller au contenu principal
          </a>

          <Header />

          <main id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </main>

          <Footer />
        </Providers>
      </ErrorBoundary>
    </I18nProvider>
  );
}
