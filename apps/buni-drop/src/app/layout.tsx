import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const dmSans   = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const jetBrains= JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Buni Drop — E-commerce Artisans',
  description: 'Buni — African Visual Ecosystem',
  metadataBase: new URL('https://drop.buni.africa'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="${playfair.variable} ${dmSans.variable} ${jetBrains.variable}">
      <body className="font-body bg-avs-secondary text-avs-accent antialiased">
        {children}
      </body>
    </html>
  );
}
