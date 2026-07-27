import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';

const space = NAV_SPACES.find(s => s.slug === 'icones')!;

export const metadata = {
  title: 'Catalogue - AVS Documentation',
  description: 'Catalogue complet des icônes AVS.',
};

export default function CataloguePage() {
  return (
    <DocPageTemplate
      space={space}
      title="Catalogue"
      summary="Explorez la collection complète d'icônes cohérentes avec le standard visuel africain."
      explanation={<p>Contenu à venir.</p>}
      toc={[]}
    />
  );
}
