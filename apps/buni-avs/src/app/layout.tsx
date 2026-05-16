import type { Metadata, Viewport } from 'next';

import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Providers } from '../components/layout/Providers';
import '@/theme/tokens/avs-tokens.css';
import '@/theme/patterns/patterns.css';
import './globals.css';
import { AuthListener } from '../components/auth/AuthListener';
import { AuthHydrator } from '../components/auth/AuthHydrator';
import { ErrorBoundary } from '../components/feedback';
import localFont from "next/font/local";

export const dmSans = localFont({
  src: "../../public/fonts/DM_Sans/DMSans-Regular.ttf",
  variable: "--font-body",
});

export const playfair=localFont({
  src:"../../public/fonts/Playfair_Display/PlayfairDisplay-Regular.ttf",
  variable:"--font-display"
})

export const jetbrains=localFont({
  src:"../../public/fonts/JetBrains_Mono/JetBrainsMono-Regular.ttf",
  variable:"--font-mono"
})


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    template: '%s | AVS — African Visual Standard',
    default: 'AVS — African Visual Standard',
  },
  description:
    'Le standard visuel africain — motifs ancestraux, palettes vivantes et patrimoine culturel documenté pour designers, artisans et développeurs.',
  keywords: [
    'african',
    'visual',
    'standard',
    'kente',
    'ndop',
    'bogolan',
    'adinkra',
    'design',
    'pattern',
  ],
  authors: [{ name: 'AVS Collective', url: 'https://avs-standard.com' }],
  creator: 'AVS Collective',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'AVS — African Visual Standard',
    title: 'AVS — African Visual Standard',
    description: 'Le standard du patrimoine visuel africain.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVS — African Visual Standard',
    description: 'Le standard du patrimoine visuel africain.',
  },
};

export const viewport: Viewport = {
  themeColor: '#C0573E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-avs-secondary font-body text-avs-accent selection:bg-avs-primary/20 selection:text-avs-primary min-h-screen antialiased">
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
      </body>
    </html>
  );
}
