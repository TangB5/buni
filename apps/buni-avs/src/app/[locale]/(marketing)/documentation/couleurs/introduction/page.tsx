import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';
import { useTranslations } from '@/i18n';
import { useNavSpaces } from '../../nav-data';

export default function IntroductionPage() {
  const t = useTranslations('documentation.colors.introduction');
  const NAV_SPACES = useNavSpaces();
  const space = NAV_SPACES.find(s => s.slug === 'couleurs')!;

  const TOC: DocTocEntry[] = [
    { id: 'pourquoi', label: t('toc.why'), level: 2 },
    { id: 'concept', label: t('toc.concept'), level: 2 },
  ];

  return (
    <DocPageTemplate
      space={space}
      title={t('title')}
      summary={t('summary')}
      
      why={
        <p className="text-avs-accent/70 leading-relaxed">
          {t('why.description')}
        </p>
      }

      explanation={
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3">{t('explanation.conceptTitle')}</h3>
            <p className="text-avs-accent/70 leading-relaxed mb-4">
              {t('explanation.conceptDesc')}
            </p>
            <ul className="space-y-2 text-avs-accent/70">
              <li><strong>Primary</strong> — {t('explanation.primary')}</li>
              <li><strong>Secondary</strong> — {t('explanation.secondary')}</li>
              <li><strong>Accent</strong> — {t('explanation.accent')}</li>
              <li><strong>Neutral</strong> — {t('explanation.neutral')}</li>
            </ul>
          </div>
        </div>
      }

      toc={TOC}
      prev={{ href: '/documentation', title: t('prev') }}
      next={{ href: '/documentation/couleurs/color-picker', title: t('next') }}
    />
  );
}
