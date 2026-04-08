import type { Metadata, Viewport } from 'next';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { QueryProvider } from '@/components/layout/Providers';
import { ToastProvider } from '@buni/ui';
import '@buni/tokens/css';
import './globals.css';
 
const playfair = Playfair_Display({ subsets:['latin'], variable:'--font-display', display:'swap' });
const dmSans   = DM_Sans({ subsets:['latin'], variable:'--font-body', display:'swap' });
const mono     = JetBrains_Mono({ subsets:['latin'], variable:'--font-mono', display:'swap' });
 
export const metadata: Metadata = {
  title: { template: '%s | Buni Mode', default: 'Buni Mode — Mode Africaine Digitale' },
  description: 'Créez, stylez et partagez des tenues africaines sur mannequin 3D virtuel.',
  keywords: ['mode africaine','styliste','wax','kente','ndop','mannequin 3D','bogolan'],
  openGraph: { siteName: 'Buni Mode', locale: 'fr_FR', type: 'website' },
};
export const viewport: Viewport = { themeColor: '#8B4513' };
 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable} ${mono.variable}`}>
      <body className="font-body bg-[#0C0806] text-avs-secondary antialiased">
        <QueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
