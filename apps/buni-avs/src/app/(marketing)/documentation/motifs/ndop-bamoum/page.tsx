import type { Metadata } from 'next';
import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';
import { MotifSheet, type MotifData } from '../../motif-sheet';
import { Callout, CodeBlock } from '../../doc-primitives';

export const metadata: Metadata = {
  title: 'Ndop Bamoum',
  description: 'Origine, symbolique et usages du motif Ndop Bamoum — documentation African Visual System.',
};

const MOTIF: MotifData = {
  name: 'Ndop Bamoum',
  pattern: 'avs-pattern-ndop-sultan',
  origin: 'Royaume Bamoum',
  ethnicGroup: 'Bamoum',
  country: 'Cameroun',
  region: 'Ouest, Foumban',
  meaning: "Grille de cercles concentriques associée aux régalia royaux et aux tissus cérémoniels du royaume Bamoum.",
  uses: ['Tentures de cour royale', 'Tissus cérémoniels', 'Reliures de manuscrits Bamoum', 'Décors architecturaux du palais de Foumban'],
  symbolism: "Chaque cercle représente un cercle de pouvoir concentrique — du roi (Mfon) vers la communauté. La répétition évoque la continuité dynastique.",
  history: "Documenté depuis le règne du roi Njoya (fin XIXe siècle), qui a aussi codifié l'écriture Shümom. Le motif a été transmis oralement par les tisserands de la cour avant sa première documentation écrite dans les années 1980.",
  variants: [
    { name: 'Ndop royal', pattern: 'avs-pattern-ndop-sultan', note: 'Réservé aux tissus de cour' },
    { name: 'Ndop civil', pattern: 'avs-pattern-ndop-sultan', note: 'Variante simplifiée, usage courant' },
    { name: 'Ndop funéraire', pattern: 'avs-pattern-ndop-sultan', note: 'Cercles inversés, rites de deuil' },
  ],
  bibliography: [
    { author: 'Geary, C.', work: 'Images from Bamum', year: '1988' },
    { author: 'Njoya, I.', work: "Histoire et coutumes des Bamum", year: '1952' },
  ],
};

const TOC: DocTocEntry[] = [
  { id: 'explication', label: 'Explication', level: 2 },
  { id: 'exemples', label: 'Exemples interactifs', level: 2 },
  { id: 'bonnes-pratiques', label: 'Bonnes pratiques', level: 2 },
  { id: 'references-culturelles', label: 'Références culturelles', level: 2 },
  { id: 'telechargements', label: 'Téléchargements', level: 2 },
];

export default function NdopBamoumPage() {
  return (
    <DocPageTemplate
      space={{ label: 'Motifs', color: '#D4A017', icon: 'th-large' }}
      title="Ndop Bamoum"
      summary="Un motif de cercles concentriques issu du royaume Bamoum, aujourd'hui documenté, vectorisé et prêt à intégrer dans vos projets."
      why={
        <p>
          Le Ndop est l&apos;un des motifs les plus réutilisés — et les plus mal attribués — du web design
          « inspiré d&apos;Afrique ». Documenter sa source exacte permet de l&apos;utiliser avec justesse plutôt
          qu&apos;en décor générique.
        </p>
      }
      explanation={
        <>
          <p>Le token CSS <code>avs-pattern-ndop-sultan</code> reproduit fidèlement la grille de cercles du motif royal, vectorisée à partir de pièces textiles d&apos;archive.</p>
          <Callout type="tip" title="Bonne pratique">
            Réservez ce motif à des contextes évoquant l&apos;autorité ou la cérémonie — évitez-le en fond décoratif neutre.
          </Callout>
        </>
      }
      interactive={<MotifSheet motif={MOTIF} />}
      bestPractices={
        <ul>
          <li>Utiliser en opacité réduite (≤ 8%) comme texture de fond, jamais en motif principal illisible.</li>
          <li>Toujours citer la source (« Ndop Bamoum, Cameroun ») dans les crédits visibles du projet.</li>
        </ul>
      }
      pitfalls={
        <ul>
          <li>Ne pas confondre avec le Ndop civil, moins restrictif dans son usage.</li>
          <li>Éviter toute recoloration s&apos;éloignant de la palette indigo/ocre d&apos;origine.</li>
        </ul>
      }
      culturalRefs={<p>Voir l&apos;espace <em>Études culturelles</em> pour l&apos;histoire complète du royaume Bamoum et de l&apos;écriture Shümom.</p>}
      downloads={[
        { label: 'Ndop Bamoum — SVG source', href: '#', format: 'SVG' },
        { label: 'Ndop Bamoum — palette', href: '#', format: 'JSON' },
      ]}
      toc={TOC}
      prev={{ href: '/documentation/motifs/kente-royale', title: 'Kente Royale' }}
      next={{ href: '/documentation/motifs/bogolan-fanga', title: 'Bogolan Fanga' }}
    />
  );
}