import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';

const space = NAV_SPACES.find(s => s.slug === 'accessibilite')!;

export const metadata = {
  title: 'Checklist WCAG - AVS Documentation',
  description: 'Checklist d\'accessibilité WCAG pour AVS.',
};

export default function ChecklistPage() {
  return (
    <DocPageTemplate
      space={space}
      title="Checklist WCAG"
      summary="Liste de contrôle pour assurer l'accessibilité de vos interfaces selon les normes WCAG."
      explanation={<p>Contenu à venir.</p>}
      toc={[]}
    />
  );
}
