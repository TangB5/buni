import type { Combo, Role, ExportFormat } from './data';

// ─────────────────────────────────────────────────────────────────────────────
// COLOR UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export function isLightColor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

export function readableOn(hex: string) {
  return isLightColor(hex) ? '#1D1D1B' : '#F5EBE0';
}

export function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

export function getLuminance(r: number, g: number, b: number) {
  const rgb = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const [R, G, B] = rgb;
  return 0.2126 * R! + 0.7152 * G! + 0.0722 * B!;
}

export function getContrastRatio(hex1: string, hex2: string) {
  const { r: r1, g: g1, b: b1 } = hexToRgb(hex1);
  const { r: r2, g: g2, b: b2 } = hexToRgb(hex2);
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getAccessibilityLevel(ratio: number) {
  if (ratio >= 7) return { level: 'AAA', color: 'text-emerald-500' };
  if (ratio >= 4.5) return { level: 'AA', color: 'text-blue-500' };
  if (ratio >= 3) return { level: 'AA Large', color: 'text-amber-500' };
  return { level: 'Fail', color: 'text-red-500' };
}

export function colorByRole(combo: Combo, role: Role) {
  return combo.colors.find((c) => c.role === role) ?? combo.colors[0]!;
}

export function generateExport(combo: Combo, format: ExportFormat): string {
  switch (format) {
    case 'css':
      return `:root {\n${combo.colors.map((c) => `  ${c.css}: ${c.hex}; /* ${c.role} · ${c.name} */`).join('\n')}\n}`;
    case 'json':
      return JSON.stringify(
        Object.fromEntries(combo.colors.map((c) => [c.role, { name: c.name, hex: c.hex, css: c.css }])),
        null, 2,
      );
    case 'tailwind':
      return `// tailwind.config.ts\ncolors: {\n${combo.colors.map((c) => `  '${c.name}': '${c.hex}',  // ${c.role}`).join('\n')}\n}`;
  }
}
