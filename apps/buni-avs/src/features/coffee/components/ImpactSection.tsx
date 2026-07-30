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

export function ImpactSection() {
  const t = useTranslations('coffee.whySupport');

  const impacts = [
    {
      icon: <i className="pi pi-code text-xl" />,
      title: t('cards.openSource.title'),
      description: t('cards.openSource.text'),
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: <i className="pi pi-book text-xl" />,
      title: t('cards.content.title'),
      description: t('cards.content.text'),
      color: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: <i className="pi pi-shield text-xl" />,
      title: t('cards.independence.title'),
      description: t('cards.independence.text'),
      color: 'from-green-500/20 to-emerald-500/20',
    },
    {
      icon: <i className="pi pi-globe text-xl" />,
      title: t('cards.heritage.title'),
      description: t('cards.heritage.text'),
      color: 'from-orange-500/20 to-red-500/20',
    },
  ];

  return (
    <section aria-labelledby="impact-title" className="relative overflow-hidden bg-avs-accent px-4 py-28 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 55% 60% at 85% 20%, rgba(192,87,62,0.12) 0%, transparent 70%)' }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <SectionLabel>{t('label')}</SectionLabel>
          <motion.h2
            {...fadeUp}
            id="impact-title"
            className="font-display font-black leading-[.95] text-avs-secondary"
            style={{ fontSize: 'clamp(2rem,4.2vw,3.5rem)', letterSpacing: '-0.025em' }}
          >
            {t('title')}
          </motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mt-6 text-[15px] leading-relaxed text-avs-secondary/55">
            Your support creates ripples that extend far beyond a single cup
          </motion.p>
        </div>

        {/* Impact cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-16">
          {impacts.map((impact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-avs-secondary/12 bg-avs-secondary/[0.04] p-5 transition-all duration-300 hover:border-avs-primary/30 hover:bg-avs-secondary/[0.07]"
            >
              <div
                className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg bg-avs-primary/12 text-avs-primary transition-transform duration-300 group-hover:scale-110"
                aria-hidden
              >
                <span className="text-sm">{impact.icon}</span>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-avs-secondary sm:text-base">{impact.title}</h3>
                <p className="mt-1 text-[12px] leading-snug text-avs-secondary/45">{impact.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-16">
          {[
            { value: '100%', label: 'Open Source', icon: <i className="pi pi-bolt text-sm"></i> },
            { value: '0', label: 'External Dependencies', icon: <i className="pi pi-shield text-sm"></i> },
            { value: '∞', label: 'Creative Freedom', icon: <i className="pi pi-heart text-sm"></i> },
            { value: '54', label: 'Countries Represented', icon: <i className="pi pi-globe text-sm"></i> },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-avs-secondary/12 bg-avs-secondary/[0.04] p-5 transition-all duration-300 hover:border-avs-primary/30 hover:bg-avs-secondary/[0.07]"
            >
              <div
                className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg bg-avs-primary/12 text-avs-primary transition-transform duration-300 group-hover:scale-110"
                aria-hidden
              >
                <span className="text-avs-primary">{stat.icon}</span>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-avs-secondary sm:text-base">{stat.value}</h3>
                <p className="mt-1 text-[12px] leading-snug text-avs-secondary/45">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <CoffeeCTA variant="primary" />
        </div>
      </div>
    </section>
  );
}
