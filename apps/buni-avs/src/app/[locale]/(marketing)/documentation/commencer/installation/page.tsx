import { DocPageTemplate } from '../../doc-page-template';
import { useNavSpaces } from '../../nav-data';
import { InstallationExplanation, InstallationWhy } from './installation-content';
import { useTranslations } from '@/i18n';

export default function InstallationPage() {
  const t = useTranslations('documentation.installation');
  const NAV_SPACES = useNavSpaces();
  const space = NAV_SPACES.find(s => s.slug === 'commencer')!;

  return (
    <DocPageTemplate
      space={space}
      title={t('title')}
      summary={t('summary')}
      why={<InstallationWhy />}
      explanation={<InstallationExplanation />}
      toc={[
        { id: 'pourquoi', level: 2, label: t('toc.why') },
        { id: 'explication', level: 2, label: t('toc.explanation') },
      ]}
      prev={{ href: '/documentation/commencer/introduction', title: t('prev') }}
      next={{ href: '/documentation/commencer/structure', title: t('next') }}
    />
  );
}
