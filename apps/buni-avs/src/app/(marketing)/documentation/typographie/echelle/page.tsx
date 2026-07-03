import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';

const space = NAV_SPACES.find(s => s.slug === 'typographie')!;

export const metadata = {
  title: 'Échelle typographique - AVS Documentation',
  description: 'Échelle typographique et familles de polices AVS.',
};

export default function EchellePage() {
  return (
    <DocPageTemplate
      space={space}
      title="Échelle typographique"
      summary="Découvrez l'échelle typographique, les familles de polices et leurs usages recommandés dans AVS."
      explanation={<p>Contenu à venir.</p>}
      toc={[]}
    />
  );
}
