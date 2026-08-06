import { DocPageTemplate } from '../../doc-page-template';
import { useNavSpaces } from '../../nav-data';
import { IntroductionExplanation, IntroductionWhy } from './introduction-content';
import { useTranslations } from 'next-intl';

export default function IntroductionPage() {
  const t = useTranslations('documentation.introduction');
  const NAV_SPACES = useNavSpaces();
  const space = NAV_SPACES.find(s => s.slug === 'commencer')!;

  return (
    <DocPageTemplate
      space={space}
      title={t('title')}
      summary={t('summary')}
      why={<IntroductionWhy />}
      explanation={<IntroductionExplanation />}
      toc={[
        { id: 'pourquoi', level: 2, label: t('toc.why') },
        { id: 'explication', level: 2, label: t('toc.explanation') },
      ]}
      next={{ href: '/documentation/commencer/installation', title: t('next') }}
    />
  );
}
