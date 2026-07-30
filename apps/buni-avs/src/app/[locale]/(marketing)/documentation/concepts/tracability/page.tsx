import type { Metadata } from 'next';
import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';
import { PropTable } from '../../doc-primitives';
import { useNavSpaces } from '../../nav-data';
import { useTranslations } from '@/i18n';

export const metadata: Metadata = {
  title: 'Traçabilité',
  description: 'Comment chaque ressource AVS reste traçable jusqu\'à sa source.',
};

export default function TracabilitePage() {
  const t = useTranslations('documentation.tracability');
  const NAV_SPACES = useNavSpaces();
  const space = NAV_SPACES.find(s => s.slug === 'concepts')!;

  const TOC: DocTocEntry[] = [
    { id: 'explication', label: t('toc.explanation'), level: 2 },
    { id: 'cas-usage', label: t('toc.useCases'), level: 2 }
  ];

  return (
    <DocPageTemplate
      space={space}
      title={t('title')}
      summary={t('summary')}
      explanation={
        <PropTable
          rows={[
            ['source_ethnie', t('explanation.table.source_ethnie.type'), t('explanation.table.source_ethnie.default'), t('explanation.table.source_ethnie.desc')],
            ['source_pays', t('explanation.table.source_pays.type'), t('explanation.table.source_pays.default'), t('explanation.table.source_pays.desc')],
            ['artisan_verifie', t('explanation.table.artisan_verifie.type'), t('explanation.table.artisan_verifie.default'), t('explanation.table.artisan_verifie.desc')],
            ['licence', t('explanation.table.licence.type'), t('explanation.table.licence.default'), t('explanation.table.licence.desc')],
          ]}
        />
      }
      useCases={<p>{t('useCases')}</p>}
      toc={TOC}
      prev={{ href: '/documentation/concepts/philosophie', title: t('prev') }}
      next={{ href: '/documentation/motifs/ndop-bamoum', title: t('next') }}
    />
  );
}