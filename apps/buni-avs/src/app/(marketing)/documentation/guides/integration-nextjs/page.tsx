import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';

const space = NAV_SPACES.find(s => s.slug === 'guides')!;

export const metadata = {
  title: 'Intégration Next.js - AVS Documentation',
  description: 'Guide pour intégrer AVS dans un projet Next.js.',
};

export default function IntegrationNextjsPage() {
  return (
    <DocPageTemplate
      space={space}
      title="Intégration Next.js"
      summary="Tutoriel pas à pas pour intégrer AVS dans votre application Next.js existante."
      explanation={<p>Contenu à venir.</p>}
      toc={[]}
    />
  );
}
