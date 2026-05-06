'use client';

import { Shield, Heart, Globe, BookOpen } from 'lucide-react';

interface ValueCardProps {
  iconName: 'shield' | 'heart' | 'globe' | 'book';
  title: string;
  text: string;
  color: string;
  index: number;
}

const iconMap = {
  shield: Shield,
  heart: Heart,
  globe: Globe,
  book: BookOpen,
};

export function ValueCard({ iconName, title, text, color, index }: ValueCardProps) {
  const Icon = iconMap[iconName];

  return (
    <div
      className="value-card group relative overflow-hidden rounded-2xl p-7 transition-all duration-300"
      style={{
        background: 'var(--about-surface)',
        border: '1px solid var(--about-border)',
        animationDelay: `${index * 0.08}s`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${color}14`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--about-border)';
        (e.currentTarget as HTMLElement).style.transform = 'none';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Top accent line — color per card */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl" style={{ background: color }} aria-hidden />

      {/* Icon */}
      <div
        className="value-icon mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ background: `${color}12`, color }}
      >
        <Icon size={20} aria-hidden />
      </div>

      <h3
        className="font-display text-lg font-bold"
        style={{ color: 'var(--about-text)', letterSpacing: '-0.01em' }}
      >
        {title}
      </h3>

      <p className="mt-2.5 text-sm leading-relaxed" style={{ color: 'var(--about-muted)' }}>{text}</p>

      {/* Corner glow on hover */}
      <div
        className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `${color}20` }}
        aria-hidden
      />
    </div>
  );
}
