import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';
import { StructureContent } from './structure-content';

const space = NAV_SPACES.find(s => s.slug === 'commencer')!;

export const metadata = {
  title: 'Structure du projet - AVS Documentation',
  description: 'Comprendre l\'architecture et l\'organisation du projet AVS.',
};

export default function StructurePage() {
  return (
    <DocPageTemplate
      space={space}
      title="Structure du projet"
      summary="Architecture monorepo avec Nx, organisation des packages et structure des dossiers pour une maintenance optimale."
      why={<StructureContent.Why />}
      explanation={<StructureContent.Explanation />}
      toc={[
        { id: 'pourquoi', level: 2, label: 'Pourquoi ce sujet est important' },
        { id: 'explication', level: 2, label: 'Explication' },
      ]}
      prev={{ href: '/documentation/commencer/installation', title: 'Installation' }}
      next={{ href: '/documentation/concepts/philosophie', title: 'Philosophie' }}
    />
  );
}
