'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useTranslations } from '@/i18n';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED MOTION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionLabel({ children, tone = 'accent' }: { children: React.ReactNode; tone?: 'accent' | 'secondary' }) {
  const text = tone === 'accent' ? 'text-avs-primary' : 'text-avs-primary';
  return (
    <motion.div {...fadeUp} className="mb-4 flex items-center gap-3">
      <div className="h-px w-8 bg-avs-primary" aria-hidden />
      <span className={`font-mono text-[9px] tracking-[0.26em] uppercase ${text}`}>{children}</span>
    </motion.div>
  );
}

export function EmotionalHero() {
  const t = useTranslations('coffee.hero');

  return (
    <section
      aria-labelledby="hero-title"
      className="avs-pattern-kente-royale relative flex min-h-[92vh] items-center overflow-hidden px-4 py-32 sm:px-6 lg:px-8"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-black/30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(10,8,6,0.74) 0%, rgba(10,8,6,0.97) 100%)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 40%, rgba(192,87,62,0.18) 0%, transparent 70%)' }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-avs-primary/8"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-avs-primary/12"
        />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black leading-[.9] tracking-[-0.03em] text-avs-secondary"
          style={{ fontSize: 'clamp(2.75rem,7.5vw,6rem)' }}
        >
          {t('title')}<br />
          <span className="text-avs-primary">{t('titleLine2')}</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 h-0.5 w-24 origin-left rounded-full bg-avs-primary"
          aria-hidden
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-avs-secondary/60"
        >
          {t('description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-16 flex justify-center"
        >
          <ArrowDown size={18} className="animate-bounce text-avs-secondary/30" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
}
