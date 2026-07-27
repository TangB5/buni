'use client';

import { Shield, Heart, Globe, BookOpen } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONFIG
// ─────────────────────────────────────────────────────────────────────────────

type IconName = 'shield' | 'heart' | 'globe' | 'book';

interface ValueCardProps {
  iconName: IconName;
  title:    string;
  text:     string;
  color:    string;   // kept only for dynamic inline tints (accent line, icon bg, glow)
  index:    number;
}

const ICON_MAP: Record<IconName, typeof Shield> = {
  shield: Shield,
  heart:  Heart,
  globe:  Globe,
  book:   BookOpen,
};

// Pattern assigned per card for visual variety
const PATTERN_MAP: Record<IconName, string> = {
  shield: 'avs-pattern-ndop-sultan',
  heart:  'avs-pattern-kente-royale',
  globe:  'avs-pattern-wax-dakar',
  book:   'avs-pattern-bogolan-fanga',
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function ValueCard({ iconName, title, text, color, index }: ValueCardProps) {
  const Icon    = ICON_MAP[iconName];
  const pattern = PATTERN_MAP[iconName];

  return (
    <article
      className="value-card group relative overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary p-7 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        animationDelay: `${index * 0.08}s`,
        // dynamic shadow & border tint on hover — can't be tokenised without knowing `color` at build time
        boxShadow: 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
        (e.currentTarget as HTMLElement).style.boxShadow  = `0 8px 32px ${color}14`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '';
        (e.currentTarget as HTMLElement).style.boxShadow  = 'none';
      }}
    >
      {/* ── Top accent line ─────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl" style={{ background: color }} aria-hidden />

      {/* ── Watermark pattern ────────────────────────────────────────────── */}
      <div
        className={`${pattern} pointer-events-none absolute inset-0 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.05]`}
        aria-hidden
      />

      {/* ── Icon ─────────────────────────────────────────────────────────── */}
      <div
        className="value-icon relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ background: `${color}12`, color }}
      >
        <Icon size={20} aria-hidden />
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <h3
        className="font-display text-lg font-bold text-avs-accent"
        style={{ letterSpacing: '-0.01em' }}
      >
        {title}
      </h3>

      <p className="mt-2.5 text-sm leading-relaxed text-avs-accent/55">{text}</p>

      {/* ── Number badge ─────────────────────────────────────────────────── */}
      <div
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[8px] font-black tracking-[0.18em] uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `${color}10`, color }}
      >
        <span className="h-1 w-1 rounded-full" style={{ background: color }} aria-hidden />
        En savoir plus
      </div>

      {/* ── Corner glow ──────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `${color}20` }}
        aria-hidden
      />
    </article>
  );
}