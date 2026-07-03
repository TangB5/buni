import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';

const space = NAV_SPACES.find(s => s.slug === 'api')!;

export const metadata = {
  title: 'Référence API - AVS Documentation',
  description: 'Référence de l\'API AVS.',
};

export default function ApiReferencePage() {
  return (
    <DocPageTemplate
      space={space}
      title="Référence API"
      summary="Documentation complète de l'API programmatique pour accéder au standard AVS."
      explanation={<p>Contenu à venir.</p>}
      toc={[]}
    />
  );
}
