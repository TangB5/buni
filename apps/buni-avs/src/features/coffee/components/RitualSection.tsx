'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '@/i18n';
import { CoffeeCTA } from './CoffeeCTA';

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

export function RitualSection() {
  const t = useTranslations('coffee.ritual');

  return (
    <section
      aria-labelledby="ritual-title"
      className="avs-pattern-ndop-sultan relative overflow-hidden border-b border-avs-accent/9 px-4 py-28 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-black/70" aria-hidden />
      
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            {...fadeUp}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden ring-1 ring-avs-accent/10">
              <div className="absolute inset-0 bg-gradient-to-br from-avs-primary/20 to-avs-accent/20" />
              <img
                src="/images/coffee-ritual.jpg"
                alt={t('imageAlt')}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay pattern */}
              <div className="absolute inset-0 avs-pattern-kente-royale opacity-10" />
            </div>
            
            {/* Floating quote */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="absolute -bottom-6 -right-6 avs-card p-6 rounded-2xl max-w-xs shadow-avs"
            >
              <p className="font-display text-lg text-avs-accent italic leading-relaxed">
                "Coffee is not just a drink — it's an invitation to belong."
              </p>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
          >
            <div className="mb-6">
              <SectionLabel>{t('label')}</SectionLabel>
            </div>

            <motion.h2
              {...fadeUp}
              id="ritual-title"
              className="font-display font-black leading-[.95] text-avs-accent mb-8"
              style={{ fontSize: 'clamp(2rem,4.2vw,3.5rem)', letterSpacing: '-0.025em' }}
            >
              {t('title')}
            </motion.h2>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className="space-y-6 text-[15px] leading-relaxed text-avs-accent/60"
            >
              <p>{t('paragraph1')}</p>
              <p>{t('paragraph2')}</p>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="mt-10"
            >
              <CoffeeCTA variant="emotional" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
