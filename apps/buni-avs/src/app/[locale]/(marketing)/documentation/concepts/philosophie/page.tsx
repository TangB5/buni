import type { Metadata } from 'next';
import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';
import { Callout } from '../../doc-primitives';

export const metadata: Metadata = { title: 'Philosophie', description: 'La philosophie qui guide African Visual System.' };

const TOC: DocTocEntry[] = [{ id: 'explication', label: 'Les trois piliers', level: 2 }, { id: 'references-culturelles', label: 'Ancrage culturel', level: 2 }];

export default function PhilosophiePage() {
  return (
    <DocPageTemplate
      space={{ label: 'Concepts fondamentaux', color: '#2A4A6B', icon: 'compass' }}
      title="Philosophie"
      summary="AVS repose sur trois piliers : rigueur documentaire, souveraineté culturelle, accès universel."
      why={<p>Comprendre la philosophie avant les outils évite les usages hors-contexte — un motif sans sa source n&apos;est qu&apos;un décor.</p>}
      explanation={
        <ol>
          <li><strong>Rigueur documentaire</strong> — chaque ressource porte sa source, sa région, son époque.</li>
          <li><strong>Souveraineté culturelle</strong> — les communautés sources gardent un droit de regard permanent.</li>
          <li><strong>Accès universel</strong> — la majorité des ressources est libre (CC BY 4.0).</li>
        </ol>
      }
      culturalRefs={
        <Callout type="info">
          Ces principes sont directement inspirés des standards de gouvernance muséale (ICOM) adaptés à un contexte numérique.
        </Callout>
      }
      toc={TOC}
      prev={{ href: '/documentation/commencer/structure', title: 'Structure du projet' }}
      next={{ href: '/documentation/concepts/tracability', title: 'Traçabilité' }}
    />
  );
}