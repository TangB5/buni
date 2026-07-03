import { DocPageTemplate } from '../../doc-page-template';
import { NAV_SPACES } from '../../nav-data';
import { IntroductionContent } from './introduction-content';


const space = NAV_SPACES.find(s => s.slug === 'commencer')!;

export const metadata = {
  title: 'Introduction - AVS Documentation',
  description: 'Découvrez AVS - African Visual Standard, un design system open-source inspiré du patrimoine visuel africain.',
};

export default function IntroductionPage() {
  return (
    <DocPageTemplate
      space={space}
      title="Introduction"
      summary="AVS est un design system open-source inspiré du patrimoine visuel africain. Découvrez sa philosophie et ses principes fondamentaux."
      why={<IntroductionContent.Why />}
      explanation={<IntroductionContent.Explanation />}
      toc={[
        { id: 'pourquoi', level: 2, label: 'Pourquoi ce sujet est important' },
        { id: 'explication', level: 2, label: 'Explication' },
      ]}
      next={{ href: '/documentation/commencer/installation', title: 'Installation' }}
    />
  );
}
