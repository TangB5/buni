import { Suspense } from 'react';
import { PatternsContent } from './components/patterns-content';

export const metadata = {
  title: 'Encyclopédie des Motifs Africains | Buni',
  description: 'Fiches ethnographiques complètes — symboles constitutifs, histoire, technique, sources primaires.',
  openGraph: {
    title: 'Encyclopédie des Motifs Africains | Buni',
    description: 'Fiches ethnographiques complètes — symboles constitutifs, histoire, technique, sources primaires.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Encyclopédie des Motifs Africains | Buni',
    description: 'Fiches ethnographiques complètes — symboles constitutifs, histoire, technique, sources primaires.',
  },
};

export default function PatternsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-avs-secondary text-avs-accent/50">Chargement...</div>}>
      <PatternsContent />
    </Suspense>
  );
}
