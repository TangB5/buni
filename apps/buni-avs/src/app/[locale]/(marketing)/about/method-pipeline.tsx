'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Search, FileText, UserCheck, ScanLine, Palette, Component, Rocket } from 'lucide-react';
import { useTranslations } from '@buni/i18n';

const getStages = (t: (key: string) => string): { icon: LucideIcon; label: string; detail: string }[] => [
  { icon: Search,     label: t('method.research'),           detail: t('method.researchDetail') },
  { icon: FileText,   label: t('method.documentation'),        detail: t('method.documentationDetail') },
  { icon: UserCheck,  label: t('method.validation'),   detail: t('method.validationDetail') },
  { icon: ScanLine,   label: t('method.digitization'),         detail: t('method.digitizationDetail') },
  { icon: Palette,    label: t('method.designTokens'),        detail: t('method.designTokensDetail') },
  { icon: Component,  label: t('method.components'),           detail: t('method.componentsDetail') },
  { icon: Rocket,     label: t('method.publication'),          detail: t('method.publicationDetail') },
];

export function MethodPipeline() {
  const t = useTranslations('about');
  const STAGES = getStages(t);

  return (
    <div className="relative mx-auto max-w-2xl">
      {/* Woven thread — the connecting spine, referencing textile lineage */}
      <div className="absolute bottom-6 left-[19px] top-6 w-px bg-gradient-to-b from-avs-primary/60 via-avs-primary/25 to-transparent sm:left-[23px]" aria-hidden />

      <ol className="relative space-y-2">
        {STAGES.map(({ icon: Icon, label, detail }, i) => (
          <motion.li
            key={label}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex gap-5 rounded-xl px-2 py-4 transition-colors duration-300 hover:bg-avs-accent/[0.03] sm:gap-6 sm:px-3"
          >
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-avs-primary/40 bg-avs-secondary text-avs-primary transition-all duration-300 group-hover:border-avs-primary group-hover:bg-avs-primary group-hover:text-avs-secondary sm:h-12 sm:w-12">
              <Icon size={16} aria-hidden />
            </div>

            <div className="min-w-0 pb-2">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-[10px] font-black tracking-[0.14em] text-avs-primary/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-base font-bold text-avs-accent sm:text-lg">{label}</h3>
              </div>
              <p className="mt-1 max-w-md text-[13px] leading-relaxed text-avs-accent/50">{detail}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}