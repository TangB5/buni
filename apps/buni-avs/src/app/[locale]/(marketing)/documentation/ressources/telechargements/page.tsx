import type { Metadata } from 'next';
import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';
import { useNavSpaces } from '../../nav-data';
import { useTranslations } from '@/i18n';

export const metadata: Metadata = {
  title: 'Téléchargements',
  description: 'Kits, fichiers source et bibliographie AVS prêts à télécharger.',
};

export default function TelechargementsPage() {
  const t = useTranslations('documentation.ressources.telechargements');
  const NAV_SPACES = useNavSpaces();
  const space = NAV_SPACES.find(s => s.slug === 'ressources')!;

  const TOC: DocTocEntry[] = [{ id: 'telechargements', label: t('toc.files'), level: 2 }];

  return (
    <DocPageTemplate
      space={space}
      title={t('title')}
      summary={t('summary')}
      explanation={<p>{t('explanation')}</p>}
      downloads={[
        { label: t('downloads.figma'), href: '#', format: 'FIG' },
        { label: t('downloads.palettes'), href: '#', format: 'JSON' },
        { label: t('downloads.bibliography'), href: '#', format: 'PDF' },
        { label: t('downloads.patterns'), href: '#', format: 'ZIP' },
      ]}
      toc={TOC}
      prev={{ href: '/documentation/exemples/showcase', title: t('prev') }}
    />
  );
}