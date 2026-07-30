import { DocPageTemplate } from '../../doc-page-template';
import { useNavSpaces } from '../../nav-data';
import { ReferenceExplanation } from './reference-content';
import { useTranslations } from '@/i18n';

export default function ReferencePage() {
  const t = useTranslations('documentation.tokens.reference');
  const NAV_SPACES = useNavSpaces();
  const space = NAV_SPACES.find(s => s.slug === 'tokens')!;

  return (
    <DocPageTemplate
      space={space}
      title={t('title')}
      summary={t('summary')}
      explanation={<ReferenceExplanation/>}
      toc={[]}
    />
  );
}
