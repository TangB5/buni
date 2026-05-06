'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SvgPatternDisplayProps {
  patternKey: string;
  className?: string;
  alt?: string;
  priority?: boolean;
}

export function SvgPatternDisplay({
  patternKey,
  className = '',
  alt = 'Motif SVG',
  priority = false,
}: SvgPatternDisplayProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(`/patterns/${patternKey}.svg`);
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.statusText}`);
        }
        const svg = await response.text();
        setSvgContent(svg);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error(`Error loading SVG pattern ${patternKey}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSvg();
  }, [patternKey]);

  if (isLoading) {
    return <div className={`${className} bg-gray-200 animate-pulse`} />;
  }

  if (error) {
    return (
      <div
        className={`${className} bg-gray-100 flex items-center justify-center text-xs text-gray-500`}
        title={`Error: ${error}`}
      >
        ⚠ {patternKey}
      </div>
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      style={{
        backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
      }}
      role="img"
      aria-label={alt}
    />
  );
}

interface SvgPatternBackgroundProps {
  patternKey: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Component that displays an SVG pattern as a background
 * Usage: <SvgPatternBackground patternKey="ndop-bamoum" className="h-64 w-64">
 *          Your content here
 *        </SvgPatternBackground>
 */
export function SvgPatternBackground({
  patternKey,
  className = '',
  children,
}: SvgPatternBackgroundProps) {
  const svgUrl = `/patterns/${patternKey}.svg`;

  return (
    <div
      className={className}
      style={{
        backgroundImage: `url('${svgUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'scroll',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Map CSS pattern classes to SVG pattern keys
 * Use this to easily migrate from CSS to SVG patterns
 */
export const PATTERN_CSS_TO_SVG: Record<string, string> = {
  'avs-pattern-kente-royale': 'ndop6', // fallback
  'avs-pattern-kente-etoile': 'ndop2', // fallback
  'avs-pattern-ndop-ceremoniel': 'ndop3',
  'avs-pattern-ndop-sultan': 'ndop-bamoum',
  'avs-pattern-bogolan-terre': 'ndop4',
  'avs-pattern-bogolan-fanga': 'ndop5',
  'avs-pattern-adinkra-sankofa': 'ndop6',
  'avs-pattern-adinkra-nkyinkyin': 'ndop1',
  'avs-pattern-wax-dakar': 'toghu-bamileke',
  'avs-pattern-wax-lagos': 'toghu-bamenda',
  'avs-pattern-kuba-kasai': 'ndop2', 
  'avs-pattern-ndebele-amabhaxa': 'toghu-bamileke',
  'avs-pattern-berber-amazigh': 'ndop4',
  'avs-pattern-wax': 'toghu-bamileke',
  'avs-pattern-wax-bold': 'ndop5',
  'avs-pattern-ndop': 'ndop3',
  'avs-pattern-ndop-royal': 'ndop-bamoum',
  'avs-pattern-kente': 'ndop1',
};

interface PatternReplacerProps {
  cssClass: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Automatically converts a CSS pattern class to SVG pattern background
 * Usage: <PatternReplacer cssClass="avs-pattern-ndop-sultan" className="h-64" />
 */
export function PatternReplacer({
  cssClass,
  className = '',
  children,
}: PatternReplacerProps) {
  const svgKey = PATTERN_CSS_TO_SVG[cssClass];

  if (!svgKey) {
    console.warn(`No SVG mapping found for CSS class: ${cssClass}`);
    // Fallback to CSS if no mapping exists
    return <div className={`${cssClass} ${className}`}>{children}</div>;
  }

  return (
    <SvgPatternBackground patternKey={svgKey} className={className}>
      {children}
    </SvgPatternBackground>
  );
}
