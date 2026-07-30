import { DocPageTemplate } from '../../doc-page-template';
import { useNavSpaces } from '../../nav-data';
import { useTranslations } from '@/i18n';

export default function CataloguePage() {
  const t = useTranslations('documentation.icones.catalogue');
  const NAV_SPACES = useNavSpaces();
  const space = NAV_SPACES.find(s => s.slug === 'icones')!;

  return (
    <DocPageTemplate
      space={space}
      title={t('title')}
      summary={t('summary')}
      explanation={<p>Contenu à venir.</p>}
      toc={[]}
    />
  );
}
