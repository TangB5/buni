import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';
import { InstallationExplanation, InstallationWhy } from './installation-content';

const space = NAV_SPACES.find(s => s.slug === 'commencer')!;

export const metadata = {
  title: 'Installation - AVS Documentation',
  description: 'Guide d\'installation d\'AVS dans votre projet Next.js.',
};

export default function InstallationPage() {
  return (
    <DocPageTemplate
      space={space}
      title="Installation"
      summary="Plusieurs méthodes pour intégrer AVS dans votre projet. La méthode CLI est recommandée pour démarrer rapidement."
      why={<InstallationWhy />}
      explanation={<InstallationExplanation />}
      toc={[
        { id: 'pourquoi', level: 2, label: 'Pourquoi ce sujet est important' },
        { id: 'explication', level: 2, label: 'Explication' },
      ]}
      prev={{ href: '/documentation/commencer/introduction', title: 'Introduction' }}
      next={{ href: '/documentation/commencer/structure', title: 'Structure du projet' }}
    />
  );
}
