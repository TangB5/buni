'use client';

import React, { JSX } from 'react';
import { CSS_PATTERN_MAP } from './index';

interface UniversalPatternProps {
  /** Pattern type (KENTE, NDOP, BOGOLAN, etc.) */
  type: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Children content */
  children?: React.ReactNode;
  /** HTML tag to render */
  as?: keyof JSX.IntrinsicElements;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Universal Pattern Component (CSS-based)
 *
 * Usage:
 * <pattern type="KENTE" className="my-class" />
 * <pattern type="NDOP" as="section" />
 * <pattern type="BOGOLAN" style={{opacity: 0.5}} />
 */
export function pattern({
  type,
  className = '',
  style = {},
  children,
  as: Component = 'div',
  onClick,
}: UniversalPatternProps) {
  
  const patternKey = type.toLowerCase() as keyof typeof CSS_PATTERN_MAP;

  const patternClass = CSS_PATTERN_MAP[patternKey] ?? CSS_PATTERN_MAP.kente;
  const combinedClasses = `${patternClass} ${className}`.trim();

  return (
    <Component
      className={combinedClasses}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </Component>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern Component (SVG-based with Supabase support)
// ─────────────────────────────────────────────────────────────────────────────

interface PatternProps {
  /** Pattern slug for fetching from Supabase */
  slug: string;
  /** Additional CSS classes */
  className?: string;
  /** Color class (e.g., "text-avs-kente", "text-avs-primary") */
  color?: string;
  /** Opacity (0-100) */
  opacity?: number;
  /** Children content */
  children?: React.ReactNode;
  /** HTML tag to render */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Pattern Component - Loads SVG from Supabase
 *
 * Usage:
 * <Pattern slug="ndop-sultan" className="opacity-30" color="text-avs-kente" />
 * <Pattern slug="kente-royale" className="opacity-20 mix-blend-multiply" />
 */
export function Pattern({
  slug,
  className = '',
  color = 'text-avs-accent',
  opacity = 20,
  children,
  as: Component = 'div',
}: PatternProps) {
  // Construct Supabase URL - you may need to adjust this based on your setup
  const svgUrl = `https://zexnfalycvlfsyrtdqxu.supabase.co/storage/v1/object/public/patterns/${slug}.svg`;

  return (
    <Component className={`relative overflow-hidden ${className}`}>
      <img
        src={svgUrl}
        alt={`Pattern ${slug}`}
        className={`absolute inset-0 w-full h-full object-cover ${color}`}
        style={{ opacity: opacity / 100 }}
        aria-hidden="true"
      />
      {children && <div className="relative z-10">{children}</div>}
    </Component>
  );
}

// Export as default for easy importing
export default pattern;
