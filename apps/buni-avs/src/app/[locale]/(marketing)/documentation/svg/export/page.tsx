import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';

const space = NAV_SPACES.find(s => s.slug === 'svg')!;

export const metadata = {
  title: "Guide d'export - AVS Documentation",
  description: "Guide pour exporter et utiliser les fichiers SVG d'AVS.",
};

export default function ExportPage() {
  return (
    <DocPageTemplate
      space={space}
      title="Guide d'export"
      summary="Instructions pour exporter et intégrer les fichiers SVG haute-fidélité dans vos projets."
      explanation={<p>Contenu à venir.</p>}
      toc={[]}
    />
  );
}
