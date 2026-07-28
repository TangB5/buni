'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Shapes, Sliders, Palette, Component, PenTool, BookMarked, Plug } from 'lucide-react';
import { useTranslations } from '@buni/i18n';

interface Brick {
  icon: LucideIcon;
  label: string;
  detail: string;
  span: string; // tailwind col/row span — encodes weight in the infrastructure, not decoration
}

const getBricks = (t: (key: string) => string): Brick[] => [
  { icon: Shapes,     label: t('infrastructure.motifs'),         detail: t('infrastructure.motifsDetail'),       span: 'sm:col-span-2 sm:row-span-2' },
  { icon: Sliders,    label: t('infrastructure.designTokens'),  detail: t('infrastructure.designTokensDetail'),          span: 'sm:col-span-1' },
  { icon: Palette,    label: t('infrastructure.palettes'),       detail: t('infrastructure.palettesDetail'),          span: 'sm:col-span-1' },
  { icon: Component,  label: t('infrastructure.components'),     detail: t('infrastructure.componentsDetail'),                    span: 'sm:col-span-1' },
  { icon: PenTool,    label: t('infrastructure.svg'),            detail: t('infrastructure.svgDetail'),            span: 'sm:col-span-1' },
  { icon: BookMarked, label: t('infrastructure.documentation'),  detail: t('infrastructure.documentationDetail'),                span: 'sm:col-span-2' },
  { icon: Plug,       label: t('infrastructure.api'),            detail: t('infrastructure.apiDetail'),           span: 'sm:col-span-2' },
];

export function InfrastructureGrid() {
  const t = useTranslations('about');
  const BRICKS = getBricks(t);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {BRICKS.map(({ icon: Icon, label, detail, span }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-avs-secondary/12 bg-avs-secondary/[0.04] p-5 transition-all duration-300 hover:border-avs-primary/30 hover:bg-avs-secondary/[0.07] ${span}`}
        >
          <div
            className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg bg-avs-primary/12 text-avs-primary transition-transform duration-300 group-hover:scale-110"
            aria-hidden
          >
            <Icon size={16} />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-avs-secondary sm:text-base">{label}</h3>
            <p className="mt-1 text-[12px] leading-snug text-avs-secondary/45">{detail}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}