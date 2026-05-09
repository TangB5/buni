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
 * Universal Pattern Component
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
  const patternClass = CSS_PATTERN_MAP[type.toUpperCase()] || CSS_PATTERN_MAP.KENTE;
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

// Export as default for easy importing
export default pattern;
