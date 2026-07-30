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

export function CommunitySection() {
  const t = useTranslations('coffee.contribution');

  const supporters = [
    { name: 'Amara D.', location: 'Dakar', contribution: 'Espresso' },
    { name: 'Kofi M.', location: 'Accra', contribution: 'Cappuccino' },
    { name: 'Nia J.', location: 'Nairobi', contribution: 'Pour Over' },
    { name: 'Tariq S.', location: 'Casablanca', contribution: 'Espresso' },
  ];

  return (
    <section aria-labelledby="community-title" className="relative overflow-hidden bg-avs-accent px-4 py-28 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 55% 60% at 85% 20%, rgba(192,87,62,0.12) 0%, transparent 70%)' }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <SectionLabel>{t('label')}</SectionLabel>
          <motion.h2
            {...fadeUp}
            id="community-title"
            className="font-display font-black leading-tight text-avs-secondary"
            style={{ fontSize: 'clamp(2rem,4vw,3.25rem)', letterSpacing: '-0.025em' }}
          >
            {t('title')}
          </motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-avs-secondary/55">
            {t('text')}
          </motion.p>
        </div>

        {/* Supporters grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-16">
          {supporters.map((supporter, index) => (
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
                <span className="text-avs-primary font-display font-bold text-sm">
                  {supporter.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-avs-secondary sm:text-base">{supporter.name}</h3>
                <p className="mt-1 text-[12px] leading-snug text-avs-secondary/45">{supporter.location}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-avs-primary/80">
                  <i className="pi pi-coffee text-[11px]"></i>
                  {supporter.contribution}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-16">
          {[
            { icon: <i className="pi pi-comments text-sm"></i>, title: 'Share your story', desc: 'Tell us why you support' },
            { icon: <i className="pi pi-share-alt text-sm"></i>, title: 'Spread the word', desc: 'Help us grow the community' },
            { icon: <i className="pi pi-star text-sm"></i>, title: 'Become a patron', desc: 'Join our recurring supporters' },
          ].map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-avs-secondary/12 bg-avs-secondary/[0.04] p-5 transition-all duration-300 hover:border-avs-primary/30 hover:bg-avs-secondary/[0.07] cursor-pointer"
            >
              <div
                className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg bg-avs-primary/12 text-avs-primary transition-transform duration-300 group-hover:scale-110"
                aria-hidden
              >
                <span className="text-avs-primary">{action.icon}</span>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-avs-secondary sm:text-base">{action.title}</h3>
                <p className="mt-1 text-[12px] leading-snug text-avs-secondary/45">{action.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <CoffeeCTA variant="emotional" />
        </div>
      </div>
    </section>
  );
}
