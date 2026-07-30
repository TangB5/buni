import { DocPageTemplate } from '../../doc-page-template';
import { useNavSpaces } from '../../nav-data';
import { MotifsExplanation, MotifsWhy } from './motifs-content';
import { useTranslations } from '@/i18n';

export default function MotifsPage() {
  const t = useTranslations('documentation.motifs.intro');
  const NAV_SPACES = useNavSpaces();
  const space = NAV_SPACES.find(s => s.slug === 'motifs')!;

  return (
    <DocPageTemplate
      space={space}
      title={t('title')}
      summary={t('summary')}
      why={<MotifsWhy />}
      explanation={<MotifsExplanation />}
      toc={[
        { id: 'pourquoi', level: 2, label: t('toc.why') },
        { id: 'explication', level: 2, label: t('toc.explanation') },
      ]}
    />
  );
}
