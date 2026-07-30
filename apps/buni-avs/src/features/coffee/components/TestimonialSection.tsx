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

export function TestimonialSection() {
  const t = useTranslations('coffee.testimonial');

  return (
    <section
      aria-labelledby="testimonial-title"
      className="avs-pattern-kente-royale relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-black/80" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-br from-avs-primary/5 via-transparent to-avs-accent/5" />
      
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="text-center">
          <motion.div
            {...fadeUp}
            className="avs-pattern-ndop-sultan mx-auto mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-avs-primary/10 ring-1 ring-avs-primary/20"
          >
            <i className="pi pi-quote-right text-2xl text-avs-primary"></i>
          </motion.div>

          {/* Stars */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="flex justify-center gap-2 mb-8"
          >
            {[...Array(5)].map((_, i) => (
              <i key={i} className="pi pi-star text-lg text-avs-primary"></i>
            ))}
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="mb-10"
          >
            <p
              className="font-display font-light leading-relaxed text-avs-accent text-2xl lg:text-3xl italic"
              style={{ lineHeight: '1.6' }}
            >
              "{t('quote')}"
            </p>
          </motion.blockquote>

          {/* Author */}
          <motion.cite
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="not-italic"
          >
            <div className="font-display font-bold text-avs-primary text-lg mb-1">
              {t('author')}
            </div>
            <div className="text-sm text-avs-accent/50">
              Community Supporter
            </div>
          </motion.cite>

          {/* CTA */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.25 }}
            className="mt-14"
          >
            <CoffeeCTA variant="primary" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
