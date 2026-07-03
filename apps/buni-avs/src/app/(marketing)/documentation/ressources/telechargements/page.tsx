import type { Metadata } from 'next';
import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';

export const metadata: Metadata = { title: 'Téléchargements', description: 'Kits, fichiers source et bibliographie AVS prêts à télécharger.' };

const TOC: DocTocEntry[] = [{ id: 'telechargements', label: 'Fichiers', level: 2 }];

export default function TelechargementsPage() {
  return (
    <DocPageTemplate
      space={{ label: 'Ressources', color: '#4A6741', icon: 'download' }}
      title="Téléchargements"
      summary="Kits complets pour Figma, palettes exportées et bibliographie complète du projet."
      explanation={<p>Chaque fichier ci-dessous est versionné et daté — vérifiez la dernière mise à jour avant intégration en production.</p>}
      downloads={[
        { label: 'Kit Figma AVS', href: '#', format: 'FIG' },
        { label: 'Palettes complètes', href: '#', format: 'JSON' },
        { label: 'Bibliographie complète', href: '#', format: 'PDF' },
        { label: 'Motifs vectoriels (lot complet)', href: '#', format: 'ZIP' },
      ]}
      toc={TOC}
      prev={{ href: '/documentation/exemples/showcase', title: 'Exemples' }}
    />
  );
}