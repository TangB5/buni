import type { Metadata } from 'next';
import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';
import { Callout } from '../../doc-primitives';
import { useNavSpaces } from '../../nav-data';
import { useTranslations } from '@/i18n';

export const metadata: Metadata = {
  title: 'Philosophie',
  description: 'La philosophie qui guide African Visual System.',
};

export default function PhilosophiePage() {
  const t = useTranslations('documentation.philosophie');
  const NAV_SPACES = useNavSpaces();
  const space = NAV_SPACES.find(s => s.slug === 'concepts')!;

  const TOC: DocTocEntry[] = [
    { id: 'explication', label: t('toc.explanation'), level: 2 },
    { id: 'references-culturelles', label: t('toc.culturalRefs'), level: 2 }
  ];

  return (
    <DocPageTemplate
      space={space}
      title={t('title')}
      summary={t('summary')}
      why={<p>{t('why')}</p>}
      explanation={
        <ol>
          <li><strong>{t('explanation.pillar1')}</strong></li>
          <li><strong>{t('explanation.pillar2')}</strong></li>
          <li><strong>{t('explanation.pillar3')}</strong></li>
        </ol>
      }
      culturalRefs={
        <Callout type="info">
          {t('culturalRefs')}
        </Callout>
      }
      toc={TOC}
      prev={{ href: '/documentation/commencer/structure', title: t('prev') }}
      next={{ href: '/documentation/concepts/tracability', title: t('next') }}
    />
  );
}