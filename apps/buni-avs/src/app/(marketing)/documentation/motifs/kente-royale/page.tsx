import type { Metadata } from 'next';
import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';
import { MotifSheet, type MotifData } from '../../motif-sheet';

export const metadata: Metadata = { title: 'Kente Royale', description: 'Origine, symbolique et usages du motif Kente Royale.' };

const MOTIF: MotifData = {
  name: 'Kente Royale',
  pattern: 'avs-pattern-kente-royale',
  origin: 'Royaume Ashanti',
  ethnicGroup: 'Akan',
  country: 'Ghana',
  region: 'Ashanti',
  meaning: "Bandelettes tissées entrelacées, portées historiquement par la royauté Ashanti lors des cérémonies d'État.",
  uses: ['Étoles cérémonielles', 'Tenues de mariage', 'Régalia royaux', 'Diplomatie panafricaine contemporaine'],
  symbolism: "Chaque combinaison de couleurs et de motifs géométriques encode un proverbe ou une valeur — le kente se 'lit' autant qu'il se porte.",
  history: "Tissé depuis le XVIIe siècle par les artisans Akan, popularisé à l'international après les indépendances africaines des années 1950-60 comme symbole panafricain.",
  variants: [
    { name: 'Adweneasa', pattern: 'avs-pattern-kente-royale', note: 'Motif le plus complexe, réservé aux chefs' },
    { name: 'Oyokoman', pattern: 'avs-pattern-kente-royale', note: 'Couleurs du clan Oyoko' },
    { name: 'Sika Fre Mogya', pattern: 'avs-pattern-kente-royale', note: "« L'argent attire le sang » — motif d'avertissement" },
  ],
  bibliography: [
    { author: 'Ross, D.', work: 'Wrapped in Pride: Ghanaian Kente', year: '1998' },
    { author: 'Boateng, B.', work: 'The Copyright Thing Doesn\u2019t Work Here', year: '2011' },
  ],
};

const TOC: DocTocEntry[] = [{ id: 'exemples', label: 'Fiche complète', level: 2 }, { id: 'bonnes-pratiques', label: 'Bonnes pratiques', level: 2 }];

export default function KenteRoyalePage() {
  return (
    <DocPageTemplate
          space={{ label: 'Motifs', color: '#D4A017', icon: 'th-large' }}
          title="Kente Royale"
          summary="Le motif tissé le plus reconnu du continent — bandelettes entrelacées porteuses de sens, pas de simple décor coloré."
          interactive={<MotifSheet motif={MOTIF} />}
          bestPractices={<p>Utiliser en couleurs pleines (jamais désaturé) : le kente perd son sens sans son code chromatique.</p>}
          toc={TOC}
          prev={{ href: '/documentation/motifs/ndop-bamoum', title: 'Ndop Bamoum' }}
          next={{ href: '/documentation/motifs/bogolan-fanga', title: 'Bogolan Fanga' }} explanation={undefined}    />
  );
}