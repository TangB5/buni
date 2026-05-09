'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Download, Eye } from 'lucide-react';

import type { Pattern } from '../types';
import { Badge, cn } from 'apps/buni-avs/src/components/ui';

// ── CSS patterns map ──────────────────────────────────────────────────────────
const PATTERN_CSS: Record<string, string> = {
  kente:   'avs-pattern-kente',
  ndop:    'avs-pattern-ndop-royal',
  bogolan: 'avs-pattern-wax-bold',
  wax:     'avs-pattern-wax',
  adinkra: 'avs-pattern-kente',
  ndebele: 'avs-pattern-wax',
};

interface PatternCardProps {
  pattern:    Pattern;
  index?:     number;
  featured?:  boolean;
  className?: string;
}

export function PatternCard({ pattern, index = 0, featured = false, className }: PatternCardProps) {
  const patternCSS = PATTERN_CSS[pattern.patternType] ?? 'avs-pattern-wax';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={cn(
        'group overflow-hidden rounded-avs-lg border border-avs-accent/10 bg-avs-secondary shadow-avs',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-avs-md',
        featured && 'md:col-span-2',
        className
      )}
    >
      <Link href={`/patterns/${pattern.slug}`} aria-label={`Voir le motif ${pattern.nameFr}`}>

        {/* Visuel */}
        <div className={cn('relative overflow-hidden', featured ? 'h-52' : 'h-44')}>
          {pattern.assets.previewUrl ? (
            <Image
              src={pattern.assets.previewUrl}
              alt={`Aperçu — ${pattern.nameFr}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={cn('h-full w-full', patternCSS)} aria-hidden />
          )}

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-linear-to-t from-avs-accent/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          {/* Badges */}
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="bg-avs-accent/80 text-avs-secondary backdrop-blur-sm">
              {pattern.patternType.toUpperCase()}
            </Badge>
          </div>
          {pattern.isFeatured && (
            <div className="absolute right-3 top-3">
              <Badge variant="kente">✦ Vedette</Badge>
            </div>
          )}

          {/* Stats hover */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="flex items-center gap-1 rounded-avs bg-avs-accent/70 px-2 py-0.5 text-[10px] font-semibold text-avs-secondary backdrop-blur-sm">
              <Eye size={10} aria-hidden /> {pattern.viewCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 rounded-avs bg-avs-accent/70 px-2 py-0.5 text-[10px] font-semibold text-avs-secondary backdrop-blur-sm">
              <Download size={10} aria-hidden /> {pattern.downloads.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4">
          <h3 className="font-display font-bold text-avs-accent line-clamp-1">{pattern.nameFr}</h3>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-avs-accent/50">
            <MapPin size={10} aria-hidden />
            <span>{pattern.country.toUpperCase()} · {pattern.region.replace('-', ' ')}</span>
          </div>
          <p className="mt-2 text-xs text-avs-accent/60 line-clamp-2 leading-relaxed">{pattern.descFr}</p>

          {/* Palette */}
          <div className="mt-3 flex gap-1.5">
            {[pattern.colors.primary, pattern.colors.secondary, ...(pattern.colors.additional.slice(0,2))].map(c => (
              <span
                key={c}
                className="h-4 w-4 rounded-full border border-avs-accent/10 shadow-sm"
                style={{ backgroundColor: c }}
                title={c}
                aria-label={`Couleur ${c}`}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
export function PatternCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-avs-lg border border-avs-accent/10 bg-avs-secondary shadow-avs animate-avs-pulse">
      <div className="h-44 bg-avs-accent/8" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 rounded-avs bg-avs-accent/8" />
        <div className="h-3 w-1/2 rounded-avs bg-avs-accent/6" />
        <div className="h-3 w-full rounded-avs bg-avs-accent/6" />
        <div className="flex gap-1.5 mt-3">
          {[0,1,2].map(i => <div key={i} className="h-4 w-4 rounded-full bg-avs-accent/8" />)}
        </div>
      </div>
    </div>
  );
}