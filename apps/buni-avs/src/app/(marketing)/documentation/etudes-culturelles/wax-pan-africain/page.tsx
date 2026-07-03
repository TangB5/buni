import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';

const space = NAV_SPACES.find(s => s.slug === 'etudes-culturelles')!;

export const metadata = {
  title: 'Le wax pan-africain - AVS Documentation',
  description: 'Étude culturelle sur le wax pan-africain.',
};

export default function WaxPanAfricainPage() {
  return (
    <DocPageTemplate
      space={space}
      title="Le wax pan-africain"
      summary="Origine, symbolique et histoire du wax dans le contexte pan-africain."
      explanation={<p>Contenu à venir.</p>}
      toc={[]}
    />
  );
}
