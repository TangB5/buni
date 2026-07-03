import type { Metadata } from 'next';
import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';
import { MotifSheet, type MotifData } from '../../motif-sheet';

export const metadata: Metadata = { title: 'Bogolan Fanga', description: 'Origine, symbolique et usages du motif Bogolan.' };

const MOTIF: MotifData = {
  name: 'Bogolan Fanga',
  pattern: 'avs-pattern-bogolan-fanga',
  origin: 'Tradition Bambara',
  ethnicGroup: 'Bambara',
  country: 'Mali',
  region: 'San, Ségou',
  meaning: "Toile de coton teinte à la boue fermentée, historiquement portée par les chasseurs comme protection spirituelle.",
  uses: ['Vêtements de chasseurs', 'Textiles décoratifs contemporains', 'Rites de passage féminins'],
  symbolism: "Les motifs géométriques bruns et ocres encodent des symboles protecteurs transmis de mère en fille lors de la teinture.",
  history: "Technique de teinture documentée depuis plusieurs siècles ; standardisée et diffusée internationalement à partir des années 1970 par des coopératives maliennes.",
  variants: [
    { name: 'Bogolan classique', pattern: 'avs-pattern-bogolan-fanga', note: 'Fond ocre, motifs bruns' },
    { name: 'Bogolan inversé', pattern: 'avs-pattern-bogolan-fanga', note: 'Fond brun, motifs clairs' },
  ],
  bibliography: [{ author: 'Rovine, V.', work: 'Bogolan: Shaping Culture through Cloth', year: '2001' }],
};

const TOC: DocTocEntry[] = [{ id: 'exemples', label: 'Fiche complète', level: 2 }];

export default function BogolanFangaPage() {
  return (
    <DocPageTemplate
          space={{ label: 'Motifs', color: '#D4A017', icon: 'th-large' }}
          title="Bogolan Fanga"
          summary="Une teinture à la boue fermentée devenue motif graphique — chaque symbole a un sens protecteur précis."
          interactive={<MotifSheet motif={MOTIF} />}
          toc={TOC}
          prev={{ href: '/documentation/motifs/kente-royale', title: 'Kente Royale' }}
          next={{ href: '/documentation/couleurs/palette-principale', title: 'Palette principale' }} explanation={undefined}    />
  );
}