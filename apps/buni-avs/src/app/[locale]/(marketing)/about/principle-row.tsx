'use client';

import { motion } from 'framer-motion';
import { Shield, Heart, Globe, BookOpen } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONFIG
// ─────────────────────────────────────────────────────────────────────────────

type IconName = 'shield' | 'heart' | 'globe' | 'book';

interface PrincipleRowProps {
  iconName: IconName;
  index:    number;   // 0-based position — drives the displayed number & stagger
  total:    number;
  title:    string;
  text:     string;
  color:    string;   // per-principle accent — kept as inline style, can't be tokenised at build time
}

const ICON_MAP: Record<IconName, typeof Shield> = {
  shield: Shield,
  heart:  Heart,
  globe:  Globe,
  book:   BookOpen,
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT — editorial row, not a card: big faded ordinal, hairline rule,
// content offset to alternate sides for an asymmetric rhythm down the page.
// ─────────────────────────────────────────────────────────────────────────────

export function PrincipleRow({ iconName, index, total, title, text, color }: PrincipleRowProps) {
  const Icon = ICON_MAP[iconName];
  const odd = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative grid grid-cols-[auto_1fr] gap-6 border-t border-avs-accent/10 py-10 sm:grid-cols-[140px_1fr] sm:gap-10 sm:py-12 ${
        odd ? 'sm:pl-16' : ''
      }`}
    >
      {/* Ordinal — oversized, low-contrast, purely structural */}
      <span
        aria-hidden
        className="font-display select-none text-[3.5rem] font-black leading-none text-avs-accent/[0.06] transition-colors duration-500 group-hover:text-avs-accent/[0.10] sm:text-[5rem]"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <div
          className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: `${color}12`, color }}
        >
          <Icon size={18} aria-hidden />
        </div>

        <h3 className="font-display text-xl font-bold text-avs-accent sm:text-2xl" style={{ letterSpacing: '-0.01em' }}>
          {title}
        </h3>

        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-avs-accent/55">{text}</p>

        {/* Progress mark — this content is a numbered sequence, so the count carries real information */}
        <div className="mt-5 flex items-center gap-1.5" aria-hidden>
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === index ? '18px' : '6px',
                background: i === index ? color : 'currentColor',
                opacity: i === index ? 1 : 0.12,
              }}
            />
          ))}
        </div>
      </div>
    </motion.article>
  );
}