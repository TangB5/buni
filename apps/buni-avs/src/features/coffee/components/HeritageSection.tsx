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

export function HeritageSection() {
  const t = useTranslations('coffee.whyAfrica');

  return (
    <section
      aria-labelledby="heritage-title"
      className="avs-pattern-adinkra-sankofa relative overflow-hidden border-b border-avs-accent/9 px-4 py-28 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-black/70" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-br from-avs-accent/5 via-transparent to-avs-primary/5" />
      
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content side - reversed order */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="order-2 lg:order-1"
          >
            <div className="mb-6">
              <SectionLabel>{t('label')}</SectionLabel>
            </div>

            <motion.h2
              {...fadeUp}
              id="heritage-title"
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

            {/* Emotional highlight */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="mt-8 p-6 avs-pattern-ndop-sultan bg-avs-primary/5 rounded-2xl border border-avs-primary/10"
            >
              <p className="font-display text-lg text-avs-primary italic">
                "Every pattern tells a story. Every story deserves to be told with care."
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.25 }}
              className="mt-10"
            >
              <CoffeeCTA variant="secondary" />
            </motion.div>
          </motion.div>

          {/* Image side */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden ring-1 ring-avs-accent/10">
              <div className="absolute inset-0 bg-gradient-to-br from-avs-accent/20 to-avs-primary/20" />
              <img
                src="/images/african-heritage.jpg"
                alt={t('imageAlt')}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Cultural pattern overlay */}
              <div className="absolute inset-0 avs-pattern-kente-royale opacity-15" />
              
              {/* Floating badge */}
              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.3 }}
                className="absolute top-6 right-6 avs-card px-4 py-2 rounded-full"
              >
                <span className="text-xs font-medium text-avs-primary">Made in Africa</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
