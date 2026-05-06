'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { Copy, Check, Download, ArrowUpRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface ColorToken {
  name:    string;
  hex:     string;
  meaning: string;
  origin:  string;
  css:     string;
}
interface Palette {
  id:          string;
  name:        string;
  origin:      string;
  description: string;
  tokens:      ColorToken[];
  patternCSS:  string;
  accentColor: string;
}
type ExportFormat = 'css' | 'json' | 'tailwind';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const PALETTES: Palette[] = [
  {
    id: 'avs-core', name: 'AVS Core', origin: 'Standard AVS', accentColor: '#C0573E',
    description: 'La palette officielle du standard African Visual Standard — terracotta, lin naturel et obsidienne.',
    patternCSS: 'avs-pattern-wax-dakar',
    tokens: [
      { name: 'avs-primary',   hex: '#C0573E', meaning: 'Terre brûlée — chaleur, énergie, identité', origin: 'Poterie Yoruba',  css: '--avs-primary'   },
      { name: 'avs-secondary', hex: '#F5EBE0', meaning: 'Lin naturel — repos, clarté, neutralité',   origin: 'Tissu Fulani',   css: '--avs-secondary' },
      { name: 'avs-accent',    hex: '#1D1D1B', meaning: 'Obsidienne — profondeur, autorité, nuit',   origin: 'Basalte Kenya',  css: '--avs-accent'    },
    ],
  },
  {
    id: 'kente', name: 'Kente Asante', origin: 'Ghana', accentColor: '#D4A017',
    description: 'Palette extraite du tissu royal Akan — or royal, noir sacré, rouge du sacrifice.',
    patternCSS: 'avs-pattern-kente-royale',
    tokens: [
      { name: 'kente-gold',  hex: '#D4A017', meaning: 'Or royal — richesse, royauté, soleil',        origin: 'Fil de soie Asante', css: '--avs-kente'   },
      { name: 'kente-black', hex: '#1D1D1B', meaning: 'Noir maturité — sagesse, énergie cosmique',   origin: 'Encre de charbon',   css: '--avs-accent'  },
      { name: 'kente-red',   hex: '#C0573E', meaning: 'Rouge sang — sacrifice, courage, ancêtres',   origin: 'Ocre ferrugineux',   css: '--avs-primary' },
      { name: 'kente-green', hex: '#4A6741', meaning: 'Vert forêt — croissance, vie, renouveau',     origin: 'Plantes indigo',     css: '--avs-ndop'    },
    ],
  },
  {
    id: 'ndop', name: 'Ndop Bamoum', origin: 'Cameroun', accentColor: '#2A4A6B',
    description: 'Teintes profondes du tissu sacré Bamoum — indigo cosmos, or raphia, ivoire rituel.',
    patternCSS: 'avs-pattern-ndop-sultan',
    tokens: [
      { name: 'ndop-indigo',  hex: '#0D2340', meaning: 'Indigo cosmos — eaux primordiales, infini', origin: 'Indigo de Foumban',  css: '--ndop-indigo' },
      { name: 'ndop-raffia',  hex: '#C8A96E', meaning: 'Or raphia — richesse naturelle, soleil',    origin: 'Fibre de palmier',  css: '--avs-raffia'  },
      { name: 'ndop-ivory',   hex: '#F5EBE0', meaning: 'Ivoire — pureté, paix, ancêtres',           origin: 'Ivoire végétal',    css: '--avs-secondary'},
      { name: 'ndop-royal',   hex: '#2A4A6B', meaning: 'Bleu royal — autorité, ciel, puissance',    origin: 'Teinture naturelle',css: '--avs-indigo'  },
    ],
  },
  {
    id: 'earth', name: "Terres d'Afrique", origin: 'Pan-Africain', accentColor: '#8B4513',
    description: 'Ocres, siennas et terres minérales extraits des pigments naturels du continent.',
    patternCSS: 'avs-pattern-bogolan-fanga',
    tokens: [
      { name: 'earth-sienna', hex: '#8B4513', meaning: 'Sienna brûlée — sol fertile, ancrage',     origin: 'Argile du Sahel',    css: '--avs-earth'    },
      { name: 'earth-ochre',  hex: '#C8821A', meaning: 'Ocre chaude — lumière rasante, crépuscule', origin: 'Oxyde de fer',       css: '--earth-ochre'  },
      { name: 'earth-sand',   hex: '#E8C99A', meaning: 'Sable doré — Sahara, voyage, ouverture',   origin: 'Dunes sahariennes',  css: '--earth-sand'   },
      { name: 'earth-baobab', hex: '#5C3317', meaning: 'Écorce de baobab — durée, mémoire',        origin: 'Bois de baobab',     css: '--earth-baobab' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function isLightColor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

function generateExport(palette: Palette, format: ExportFormat): string {
  switch (format) {
    case 'css':
      return `:root {\n${palette.tokens.map((t) => `  ${t.css}: ${t.hex}; /* ${t.name} */`).join('\n')}\n}`;
    case 'json':
      return JSON.stringify(Object.fromEntries(palette.tokens.map((t) => [t.name, { hex: t.hex, css: t.css }])), null, 2);
    case 'tailwind':
      return `// tailwind.config.ts\ncolors: {\n${palette.tokens.map((t) => `  '${t.name}': '${t.hex}',`).join('\n')}\n}`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR SWATCH
// ─────────────────────────────────────────────────────────────────────────────
function ColorSwatch({ token, index }: { token: ColorToken; index: number }) {
  const [copied, setCopied] = useState<'hex' | 'css' | null>(null);

  const copy = useCallback(async (text: string, type: 'hex' | 'css') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1800);
  }, []);

  const light = isLightColor(token.hex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-2xl transition-all duration-300"
      style={{ border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${token.hex}22`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      {/* Swatch */}
      <button
        className="relative h-28 w-full cursor-pointer overflow-hidden"
        style={{ background: token.hex }}
        onClick={() => void copy(token.hex, 'hex')}
        aria-label={`Copier ${token.hex}`}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.10)' }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={copied === 'hex' ? 'done' : 'copy'}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold backdrop-blur-sm"
              style={{ background: light ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.18)', color: light ? '#fff' : '#fff' }}
            >
              {copied === 'hex' ? <Check size={11} /> : <Copy size={11} />}
              {copied === 'hex' ? 'Copié !' : token.hex}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Color value — always visible, bottom-right */}
        <span
          className="absolute bottom-2.5 right-3 font-mono text-[10px] font-bold opacity-60"
          style={{ color: light ? '#000' : '#fff' }}
        >{token.hex}</span>
      </button>

      {/* Info */}
      <div className="p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="font-mono text-xs font-bold" style={{ color: 'var(--clr-text)' }}>{token.name}</p>
          <button
            onClick={() => void copy(`var(${token.css})`, 'css')}
            className="flex items-center gap-1 font-mono text-[9px] transition-colors"
            style={{ color: copied === 'css' ? '#22c55e' : 'var(--clr-hint)' }}
            title={`Copier var(${token.css})`}
          >
            {copied === 'css' ? <Check size={9} /> : null}
            {token.css}
          </button>
        </div>
        <p className="text-xs leading-snug" style={{ color: 'var(--clr-muted)' }}>{token.meaning}</p>
        <p className="mt-1.5 text-[10px] italic" style={{ color: 'var(--clr-hint)' }}>Source : {token.origin}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT PANEL
// ─────────────────────────────────────────────────────────────────────────────
function ExportPanel({ palette }: { palette: Palette }) {
  const [format, setFormat]   = useState<ExportFormat>('css');
  const [copied, setCopied]   = useState(false);
  const code = generateExport(palette, format);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const ext  = format === 'json' ? 'json' : format === 'tailwind' ? 'ts' : 'css';
    const blob = new Blob([code], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `avs-palette-${palette.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Export card */}
      <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--clr-border)' }}>
          <h3 className="font-display text-sm font-bold" style={{ color: 'var(--clr-text)', letterSpacing: '-0.01em' }}>Exporter</h3>
          {/* Format tabs */}
          <div className="flex items-center gap-0.5 rounded-xl p-0.5" style={{ background: 'var(--clr-subtle)', border: '1px solid var(--clr-border)' }}>
            {(['css', 'json', 'tailwind'] as ExportFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className="rounded-lg px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.14em] uppercase transition-all duration-150"
                style={format === fmt
                  ? { background: 'var(--clr-primary)', color: '#fff' }
                  : { color: 'var(--clr-hint)' }
                }
              >{fmt}</button>
            ))}
          </div>
        </div>

        {/* Code block */}
        <div className="relative">
          <pre
            className="overflow-x-auto p-5 font-mono text-[11px] leading-[1.8]"
            style={{ background: '#141412', color: '#d4d0c8' }}
          >{code}</pre>
          {/* Traffic lights + copy */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2.5" style={{ background: '#1a1a18' }}>
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/65" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/65" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/65" />
            </div>
            <button
              onClick={() => void copyCode()}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[9px] font-semibold text-white/40 transition-all hover:bg-white/10 hover:text-white/75"
            >
              {copied ? <><Check size={9} className="text-emerald-400" /> Copié</> : <><Copy size={9} /> Copier</>}
            </button>
          </div>
          {/* Pad top for header */}
          <div className="h-9" style={{ background: '#141412' }} />
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={download}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
        style={{ background: palette.accentColor, boxShadow: `0 4px 16px ${palette.accentColor}30` }}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
        <Download size={14} aria-hidden />
        Télécharger la palette
        <ArrowUpRight size={12} className="opacity-60" aria-hidden />
      </button>

      {/* Cultural note */}
      <div
        className="rounded-xl p-4 text-xs leading-relaxed"
        style={{ background: `${palette.accentColor}09`, borderLeft: `3px solid ${palette.accentColor}40`, border: `1px solid ${palette.accentColor}20`, borderLeftWidth: 3 }}
      >
        <p className="mb-1 font-mono text-[9px] font-black tracking-[0.18em] uppercase" style={{ color: palette.accentColor }}>Note culturelle</p>
        <p style={{ color: 'var(--clr-muted)' }}>
          Chaque couleur est documentée avec sa source primaire — artisan, région, matière. Cliquez sur un swatch pour copier le HEX.
        </p>
      </div>

      {/* Color grid preview (mini) */}
      <div className="overflow-hidden rounded-xl" style={{ border: '1px solid var(--clr-border)' }}>
        <div className="flex h-10">
          {PALETTES.find((p) => p.id === palette.id)?.tokens.map((t) => (
            <div key={t.hex} className="flex-1" style={{ background: t.hex }} title={t.name} />
          ))}
        </div>
        <div className="flex px-3 py-2.5" style={{ background: 'var(--clr-surface)', borderTop: '1px solid var(--clr-border)' }}>
          {PALETTES.find((p) => p.id === palette.id)?.tokens.map((t) => (
            <div key={t.hex} className="flex-1 text-center">
              <p className="font-mono text-[8px]" style={{ color: 'var(--clr-hint)' }}>{t.hex}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ColorsPage() {
  const [activePalette, setActivePalette] = useState(PALETTES[0]!.id);
  const palette = PALETTES.find((p) => p.id === activePalette) ?? PALETTES[0]!;

  return (
    <>
      <style>{`
        :root {
          --clr-bg:        #faf8f5;
          --clr-surface:   #ffffff;
          --clr-subtle:    rgba(29,29,27,0.04);
          --clr-border:    rgba(29,29,27,0.09);
          --clr-border-md: rgba(29,29,27,0.15);
          --clr-text:      #1D1D1B;
          --clr-muted:     rgba(29,29,27,0.55);
          --clr-hint:      rgba(29,29,27,0.35);
          --clr-primary:   #C0573E;
          --clr-primary-10:rgba(192,87,62,0.08);
        }
        .dark {
          --clr-bg:        #111110;
          --clr-surface:   #1a1917;
          --clr-subtle:    rgba(255,255,255,0.05);
          --clr-border:    rgba(255,255,255,0.07);
          --clr-border-md: rgba(255,255,255,0.13);
          --clr-text:      #ece8e1;
          --clr-muted:     rgba(236,232,225,0.50);
          --clr-hint:      rgba(236,232,225,0.30);
          --clr-primary:   #d4694e;
          --clr-primary-10:rgba(212,105,78,0.10);
        }

        .palette-tab {
          padding: 0.625rem 1.25rem;
          border-radius: 0.75rem;
          font-size: 0.8125rem;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.18s;
          border: 1px solid transparent;
          color: var(--clr-muted);
          background: transparent;
        }
        .palette-tab:hover:not([data-state="active"]) {
          color: var(--clr-text);
          background: var(--clr-subtle);
          border-color: var(--clr-border);
        }
        .palette-tab[data-state="active"] {
          color: #ffffff;
          border-color: transparent;
        }
      `}</style>

      <div style={{ background: 'var(--clr-bg)', minHeight: '100vh' }}>

        {/* ══════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8" style={{ borderBottom: '1px solid var(--clr-border)' }}>
          {/* Pattern bg */}
          <div className="avs-pattern-wax-dakar absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" aria-hidden />
          {/* Warm halo */}
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 80% at 5% 50%, rgba(192,87,62,0.06) 0%, transparent 65%)' }} aria-hidden />

          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px w-8" style={{ background: '#C0573E' }} aria-hidden />
                  <span className="font-mono text-[9px] font-bold tracking-[0.26em] uppercase" style={{ color: '#C0573E' }}>Design Tokens</span>
                </div>
                <h1
                  className="font-display font-black leading-none"
                  style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'var(--clr-text)', letterSpacing: '-0.03em' }}
                >
                  Palettes &amp; Couleurs
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-relaxed" style={{ color: 'var(--clr-muted)' }}>
                  Chaque couleur extraite de pigments naturels africains, documentée avec sa signification
                  culturelle. Exportez en CSS, JSON ou Tailwind.
                </p>
              </div>

              {/* Quick stats */}
              <div className="flex shrink-0 gap-3">
                {[
                  { v: `${PALETTES.length}`,                                     l: 'palettes'   },
                  { v: `${PALETTES.reduce((a, p) => a + p.tokens.length, 0)}`,   l: 'couleurs'   },
                  { v: '3',                                                       l: 'formats'    },
                ].map(({ v, l }) => (
                  <div key={l} className="rounded-xl px-4 py-3 text-center" style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)' }}>
                    <p className="font-display text-2xl font-black leading-none" style={{ color: 'var(--clr-text)', letterSpacing: '-0.02em' }}>{v}</p>
                    <p className="mt-1 font-mono text-[9px] tracking-wide uppercase" style={{ color: 'var(--clr-hint)' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════════════════════ */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Tabs.Root value={activePalette} onValueChange={setActivePalette}>

            {/* ── Palette tabs ─────────────────────────────────────────────── */}
            <Tabs.List
              aria-label="Palettes culturelles"
              className="mb-8 flex gap-2 overflow-x-auto pb-2"
            >
              {PALETTES.map((p) => (
                <Tabs.Trigger
                  key={p.id}
                  value={p.id}
                  className="palette-tab"
                  style={activePalette === p.id
                    ? { background: p.accentColor, boxShadow: `0 4px 16px ${p.accentColor}30` }
                    : {}
                  }
                >
                  {/* Color dot */}
                  <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: p.accentColor }} aria-hidden />
                  {p.name}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* ── Palette content ──────────────────────────────────────────── */}
            {PALETTES.map((p) => (
              <Tabs.Content key={p.id} value={p.id} forceMount>
                <AnimatePresence mode="wait">
                  {activePalette === p.id && (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="grid gap-8 lg:grid-cols-[1fr_300px]"
                    >
                      {/* Left — swatches */}
                      <div>
                        {/* Palette hero banner */}
                        <div className={`${p.patternCSS} relative mb-6 overflow-hidden rounded-2xl`}>
                          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.93) 0%, rgba(26,18,8,0.82) 100%)' }} />
                          {/* Warm halo */}
                          <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 55% 80% at 0% 50%, ${p.accentColor}22 0%, transparent 65%)` }} aria-hidden />
                          <div className="relative px-7 py-6">
                            <div className="mb-1 flex items-center gap-2">
                              <div className="h-px w-6" style={{ background: p.accentColor }} aria-hidden />
                              <p className="font-mono text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: p.accentColor }}>{p.origin}</p>
                            </div>
                            <h2 className="font-display text-2xl font-black leading-tight text-white" style={{ letterSpacing: '-0.02em' }}>{p.name}</h2>
                            <p className="mt-1.5 max-w-md text-sm leading-relaxed" style={{ color: 'rgba(245,235,224,0.60)' }}>{p.description}</p>

                            {/* Token count badge */}
                            <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                              style={{ background: `${p.accentColor}18`, border: `1px solid ${p.accentColor}30` }}>
                              <span className="font-mono text-[9px] font-bold tracking-wide uppercase" style={{ color: p.accentColor }}>
                                {p.tokens.length} couleurs
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Swatch grid */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {p.tokens.map((token, i) => (
                            <ColorSwatch key={token.name} token={token} index={i} />
                          ))}
                        </div>

                        {/* All-in-one color strip */}
                        <div className="mt-6 overflow-hidden rounded-xl" style={{ border: '1px solid var(--clr-border)' }}>
                          <div className="flex h-12">
                            {p.tokens.map((t, i) => (
                              <motion.div
                                key={t.hex}
                                className="group relative flex-1 cursor-pointer overflow-hidden"
                                style={{ background: t.hex }}
                                whileHover={{ flex: 2 }}
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                title={`${t.name} · ${t.hex}`}
                              >
                                <div className="absolute inset-0 flex items-end justify-center pb-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                  <span className="font-mono text-[8px] font-bold" style={{ color: isLightColor(t.hex) ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.75)' }}>
                                    {t.hex}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right — export panel */}
                      <ExportPanel palette={p} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </div>
      </div>
    </>
  );
}