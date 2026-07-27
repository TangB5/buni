'use client';

import { motion } from 'framer-motion';

interface Stat {
  value: string;
  label: string;
  detail: string;
}

const HERO_STAT: Stat = { value: '1 248', label: 'Motifs documentés', detail: 'Vectorisés, sourcés, prêts pour la production' };

const SUPPORTING: Stat[] = [
  { value: '54',    label: 'Pays représentés', detail: 'Sur les 54 pays du continent' },
  { value: '312',   label: 'Artisans vérifiés', detail: 'Droit de regard permanent sur leur patrimoine' },
  { value: '5 ans',  label: "D'archive vivante", detail: 'De recherche terrain continue depuis 2024' },
];

export function StatsComposition() {
  return (
    <div className="grid gap-4 sm:grid-cols-3 sm:grid-rows-2 sm:gap-5">
      {/* Hero stat — spans full height on the left, the anchor of the composition */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-avs-primary/25 bg-avs-primary/[0.08] p-8 sm:row-span-2 sm:p-10"
      >
        <div className="avs-pattern-wax-dakar pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden />
        <span
          className="font-display relative block font-black leading-[0.9] text-avs-accent"
          style={{ fontSize: 'clamp(3rem,7vw,5rem)', letterSpacing: '-0.03em' }}
        >
          {HERO_STAT.value}
        </span>
        <p className="relative mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-avs-primary">
          {HERO_STAT.label}
        </p>
        <p className="relative mt-2 max-w-[220px] text-[13px] leading-relaxed text-avs-accent/50">{HERO_STAT.detail}</p>
      </motion.div>

      {SUPPORTING.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center rounded-2xl border border-avs-accent/10 bg-avs-secondary p-6"
        >
          <span className="font-display font-black leading-none text-avs-accent" style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)', letterSpacing: '-0.02em' }}>
            {stat.value}
          </span>
          <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-avs-primary">{stat.label}</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-avs-accent/45">{stat.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}