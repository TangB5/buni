import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';

const space = NAV_SPACES.find(s => s.slug === 'exemples')!;

export const metadata = {
  title: 'Showcase - AVS Documentation',
  description: 'Projets exemples construits avec AVS.',
};

export default function ShowcasePage() {
  return (
    <DocPageTemplate
      space={space}
      title="Showcase"
      summary="Découvrez des projets réels construits avec le standard visuel africain."
      explanation={<p>Contenu à venir.</p>}
      toc={[]}
    />
  );
}
