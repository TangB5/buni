import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';
import { ReferenceExplanation } from './reference-content';

const space = NAV_SPACES.find(s => s.slug === 'tokens')!;

export const metadata = {
  title: 'Référence des tokens - AVS Documentation',
  description: 'Référence complète des design tokens AVS.',
};

export default function ReferencePage() {
  return (
    <DocPageTemplate
      space={space}
      title="Référence des tokens"
      summary="Liste complète des design tokens utilisés dans AVS : couleurs, espacements, typographie, etc."
      explanation={<ReferenceExplanation/>}
      toc={[]}
    />
  );
}
