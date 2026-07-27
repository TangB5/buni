
import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';
import { MotifsExplanation, MotifsWhy } from './motifs-content';

const space = NAV_SPACES.find(s => s.slug === 'motifs')!;

export const metadata = {
  title: 'Motifs - AVS Documentation',
  description: 'Catalogue des motifs CSS africains générés entièrement en CSS.',
};

export default function MotifsPage() {
  return (
    <DocPageTemplate
      space={space}
      title="Motifs"
      summary="Des motifs africains générés entièrement en CSS — sans image, sans SVG. Utilisation instantanée via className."
      why={<MotifsWhy />}
      explanation={<MotifsExplanation />}
      toc={[
        { id: 'pourquoi', level: 2, label: 'Pourquoi ce sujet est important' },
        { id: 'explication', level: 2, label: 'Explication' },
      ]}
    />
  );
}
