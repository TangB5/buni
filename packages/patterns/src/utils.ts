import { PatternType } from './registry';
import type { Pattern, PatternCard} from './types';

// ─────────────────────────────────────────────────────────────
// TRANSFORMER
// ─────────────────────────────────────────────────────────────

export function toPatternCard(pattern: Pattern): PatternCard {
  return {
    id: pattern.id,
    slug: pattern.slug,
    name: pattern.name,
    localName: pattern.localName,
    type: pattern.type,

    svgUrl: pattern.svgUrl,

    region: pattern.origin.region,
    country: pattern.origin.country,

    colors: pattern.colors.map(c => c.hex),

    summary: pattern.summary,

    views: pattern.views,
    featured: pattern.featured,
  };
}

// ─────────────────────────────────────────────────────────────
// FILTERS
// ─────────────────────────────────────────────────────────────

export function getPatternsByType(
  patterns: Pattern[],
  type: PatternType
): Pattern[] {
  return patterns.filter(p => p.type === type);
}

// ─────────────────────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────────────────────

export function searchPatterns(
  patterns: Pattern[],
  query: string
): Pattern[] {
  const q = query.toLowerCase();

  return patterns.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.localName?.toLowerCase().includes(q) ||
    p.summary.toLowerCase().includes(q) ||
    p.origin.people.toLowerCase().includes(q)
  );
}

export function generatePaletteJson(
  pattern: Pattern
): string {
  return JSON.stringify(
    {
      id: pattern.id,
      name: pattern.name,
      localName: pattern.localName,
      type: pattern.type,
      origin: pattern.origin,
      colors: pattern.colors,
      license: pattern.license,
      source:
        'AVS — African Visual Standard · avs-standard.com',
    },
    null,
    2
  );
}