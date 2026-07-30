import { DocPageTemplate } from '../../doc-page-template';
import { useNavSpaces } from '../../nav-data';
import { StructureExplanation, StructureWhy } from './structure-content';
import { useTranslations } from '@/i18n';

export default function StructurePage() {
  const t = useTranslations('documentation.structure');
  const NAV_SPACES = useNavSpaces();
  const space = NAV_SPACES.find(s => s.slug === 'commencer')!;

  return (
    <DocPageTemplate
      space={space}
      title={t('title')}
      summary={t('summary')}
      why={<StructureWhy />}
      explanation={<StructureExplanation />}
      toc={[
        { id: 'pourquoi', level: 2, label: t('toc.why') },
        { id: 'explication', level: 2, label: t('toc.explanation') },
      ]}
      prev={{ href: '/documentation/commencer/installation', title: t('prev') }}
      next={{ href: '/documentation/concepts/philosophie', title: t('next') }}
    />
  );
}
