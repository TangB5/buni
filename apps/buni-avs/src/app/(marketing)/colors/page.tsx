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
  accentClass: string;   // text-avs-* Tailwind class — must be in safelist: text-avs-primary, text-avs-kente, text-avs-indigo, text-avs-earth, text-avs-etruscan, text-avs-olive
  accentHex:   string;   // kept only for dynamic inline uses (boxShadow, radial-gradient) that Tailwind can't express
}
type ExportFormat = 'css' | 'json' | 'tailwind';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const PALETTES: Palette[] = [
  {
    id: 'avs-core', name: 'AVS Core', origin: 'Standard AVS',
    accentClass: 'text-avs-primary', accentHex: '#C0573E',
    description: 'La palette officielle du standard African Visual Standard — terracotta, lin naturel et obsidienne.',
    patternCSS: 'avs-pattern-wax-dakar',
    tokens: [
      { name: 'avs-primary',   hex: '#C0573E', meaning: 'Terre brûlée — chaleur, énergie, identité', origin: 'Poterie Yoruba',  css: '--avs-primary'   },
      { name: 'avs-secondary', hex: '#F5EBE0', meaning: 'Lin naturel — repos, clarté, neutralité',   origin: 'Tissu Fulani',   css: '--avs-secondary' },
      { name: 'avs-accent',    hex: '#1D1D1B', meaning: 'Obsidienne — profondeur, autorité, nuit',   origin: 'Basalte Kenya',  css: '--avs-accent'    },
      { name: 'avs-mist',      hex: '#B0C4C8', meaning: 'Brume lagunaire — sérénité, horizon',       origin: 'Lagune de Cotonou', css: '--avs-mist'   },
    ],
  },
  {
    id: 'kente', name: 'Kente Asante', origin: 'Ghana',
    accentClass: 'text-avs-kente', accentHex: '#D4A017',
    description: 'Palette extraite du tissu royal Akan — or royal, noir sacré, rouge du sacrifice.',
    patternCSS: 'avs-pattern-kente-royale',
    tokens: [
      { name: 'kente-gold',    hex: '#D4A017', meaning: 'Or royal — richesse, royauté, soleil',      origin: 'Fil de soie Asante', css: '--avs-kente'      },
      { name: 'kente-black',   hex: '#1D1D1B', meaning: 'Noir maturité — sagesse, énergie cosmique', origin: 'Encre de charbon',   css: '--avs-accent'     },
      { name: 'kente-red',     hex: '#C0573E', meaning: 'Rouge sang — sacrifice, courage, ancêtres', origin: 'Ocre ferrugineux',   css: '--avs-primary'    },
      { name: 'kente-green',   hex: '#4A6741', meaning: 'Vert forêt — croissance, vie, renouveau',   origin: 'Plantes indigo',     css: '--avs-ndop'       },
      { name: 'kente-ivory',   hex: '#F5EBE0', meaning: 'Ivoire — pureté rituelle, lumière douce',   origin: 'Coton blanchi',      css: '--avs-secondary'  },
    ],
  },
  {
    id: 'ndop', name: 'Ndop Bamoum', origin: 'Cameroun',
    accentClass: 'text-avs-indigo', accentHex: '#2A4A6B',
    description: 'Teintes profondes du tissu sacré Bamoum — indigo cosmos, or raphia, ivoire rituel.',
    patternCSS: 'avs-pattern-ndop-sultan',
    tokens: [
      { name: 'ndop-indigo',   hex: '#0D2340', meaning: 'Indigo cosmos — eaux primordiales, infini', origin: 'Indigo de Foumban',  css: '--ndop-indigo'  },
      { name: 'ndop-raffia',   hex: '#C8A96E', meaning: 'Or raphia — richesse naturelle, soleil',    origin: 'Fibre de palmier',  css: '--avs-raffia'   },
      { name: 'ndop-ivory',    hex: '#F5EBE0', meaning: 'Ivoire — pureté, paix, ancêtres',           origin: 'Ivoire végétal',    css: '--avs-secondary'},
      { name: 'ndop-royal',    hex: '#2A4A6B', meaning: 'Bleu royal — autorité, ciel, puissance',    origin: 'Teinture naturelle',css: '--avs-indigo'   },
      { name: 'ndop-nile',     hex: '#A8CCCC', meaning: 'Eau du Nil — apaisement, fluidité, vie',    origin: 'Pigment de Foumban',css: '--avs-nile'     },
    ],
  },
  {
    id: 'earth', name: "Terres d'Afrique", origin: 'Pan-Africain',
    accentClass: 'text-avs-earth', accentHex: '#8B4513',
    description: 'Ocres, siennas et terres minérales extraits des pigments naturels du continent.',
    patternCSS: 'avs-pattern-bogolan-fanga',
    tokens: [
      { name: 'earth-sienna',  hex: '#8B4513', meaning: 'Sienna brûlée — sol fertile, ancrage',      origin: 'Argile du Sahel',   css: '--avs-earth'    },
      { name: 'earth-ochre',   hex: '#C8821A', meaning: 'Ocre chaude — lumière rasante, crépuscule',  origin: 'Oxyde de fer',      css: '--earth-ochre'  },
      { name: 'earth-sand',    hex: '#E8C99A', meaning: 'Sable doré — Sahara, voyage, ouverture',     origin: 'Dunes sahariennes', css: '--earth-sand'   },
      { name: 'earth-baobab',  hex: '#5C3317', meaning: 'Écorce de baobab — durée, mémoire',          origin: 'Bois de baobab',    css: '--earth-baobab' },
      { name: 'earth-clay',    hex: '#D4A882', meaning: 'Argile pâle — douceur, construction, foyer', origin: 'Latérite du Sahel', css: '--earth-clay'   },
    ],
  },
  {
    // Palette 5 — inspirée du Dictionnaire de combinaisons de couleurs (Seigensha)
    // Combinaisons 025 + 026 + 065 : rouge étrusque, bleu Nil, jaune sulfin, ocre doré
    id: 'seigensha-warm', name: 'Contraste Chaud', origin: 'Seigensha · Combinaisons',
    accentClass: 'text-avs-etruscan', accentHex: '#B84A36',
    description: 'Harmonie chaude tirée du Dictionnaire de combinaisons de couleurs — rouge étrusque, bleu Nil, or sulfin, ocre de palmier.',
    patternCSS: 'avs-pattern-wax-dakar',
    tokens: [
      { name: 'sg-etruscan',   hex: '#B84A36', meaning: 'Rouge étrusque — force, feu, caractère',    origin: 'Dict. comb. #025',  css: '--avs-etruscan'  },
      { name: 'sg-nile-blue',  hex: '#BDD8DC', meaning: 'Bleu Nil — repos, eau, horizon serein',     origin: 'Dict. comb. #025',  css: '--avs-nile-blue' },
      { name: 'sg-umber',      hex: '#6B3A1F', meaning: 'Ombre brûlée — terre, profondeur, racines', origin: 'Dict. comb. #026',  css: '--avs-umber'     },
      { name: 'sg-golden',     hex: '#D4881A', meaning: 'Jaune doré — lumière, chaleur, récolte',    origin: 'Dict. comb. #026',  css: '--avs-golden'    },
      { name: 'sg-sulphine',   hex: '#C8B020', meaning: 'Jaune sulfin — éclat, vitalité, savane',   origin: 'Dict. comb. #065',  css: '--avs-sulphine'  },
    ],
  },
  {
    // Palette 6 — inspirée du Dictionnaire de combinaisons de couleurs (Seigensha)
    // Combinaisons 066 + 106 + 289 : olive, ocre, violet, indigo, vert-jaune
    id: 'seigensha-deep', name: 'Profondeur & Contraste', origin: 'Seigensha · Combinaisons',
    accentClass: 'text-avs-olive', accentHex: '#5A6320',
    description: 'Profondeur tonale du Dictionnaire Seigensha — olive sacré, indigo nuit, ocre jaune et vert chartreuse.',
    patternCSS: 'avs-pattern-ndop-sultan',
    tokens: [
      { name: 'sg-olive',      hex: '#5A6320', meaning: 'Vert olive — maturité, ancrage, équilibre',  origin: 'Dict. comb. #066',  css: '--avs-olive'     },
      { name: 'sg-ocher',      hex: '#C8A020', meaning: 'Ocre olive — chaleur sèche, steppe, soleil', origin: 'Dict. comb. #066',  css: '--avs-ocher'     },
      { name: 'sg-violet-nuit',hex: '#1A1440', meaning: 'Violet nuit — cosmos, mystère, infini',      origin: 'Dict. comb. #106',  css: '--avs-violet-nuit'},
      { name: 'sg-antwarp',    hex: '#2070B8', meaning: 'Bleu Antwarp — clarté, confiance, mer',      origin: 'Dict. comb. #106',  css: '--avs-antwarp'   },
      { name: 'sg-chartreuse', hex: '#B8C018', meaning: 'Vert chartreuse — fraîcheur, nature, espoir',origin: 'Dict. comb. #289',  css: '--avs-chartreuse'},
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
      className="group overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: 'none' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${token.hex}22`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      {/* Swatch */}
      <button
        className="relative h-28 w-full cursor-pointer overflow-hidden"
        style={{ background: token.hex }}
        onClick={() => void copy(token.hex, 'hex')}
        aria-label={`Copier ${token.hex}`}
      >
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.10)' }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={copied === 'hex' ? 'done' : 'copy'}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-avs-secondary backdrop-blur-sm"
              style={{ background: light ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.18)' }}
            >
              {copied === 'hex' ? <Check size={11} /> : <Copy size={11} />}
              {copied === 'hex' ? 'Copié !' : token.hex}
            </motion.span>
          </AnimatePresence>
        </div>
        <span
          className="absolute bottom-2.5 right-3 font-mono text-[10px] font-bold opacity-60"
          style={{ color: light ? '#000' : '#fff' }}
        >{token.hex}</span>
      </button>

      {/* Info */}
      <div className="p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="font-mono text-xs font-bold text-avs-accent">{token.name}</p>
          <button
            onClick={() => void copy(`var(${token.css})`, 'css')}
            className={`flex items-center gap-1 font-mono text-[9px] transition-colors ${copied === 'css' ? 'text-emerald-500' : 'text-avs-accent/35'}`}
            title={`Copier var(${token.css})`}
          >
            {copied === 'css' && <Check size={9} />}
            {token.css}
          </button>
        </div>
        <p className="text-xs leading-snug text-avs-accent/55">{token.meaning}</p>
        <p className="mt-1.5 text-[10px] italic text-avs-accent/35">Source : {token.origin}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT PANEL
// ─────────────────────────────────────────────────────────────────────────────

function ExportPanel({ palette }: { palette: Palette }) {
  const [format, setFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);
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
      <div className="overflow-hidden rounded-2xl border border-avs-accent/9 bg-avs-secondary">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-avs-accent/9">
          <h3 className="font-display text-sm font-bold text-avs-accent" style={{ letterSpacing: '-0.01em' }}>Exporter</h3>
          {/* Format tabs */}
          <div className="flex items-center gap-0.5 rounded-xl p-0.5 bg-avs-accent/4 border border-avs-accent/9">
            {(['css', 'json', 'tailwind'] as ExportFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`rounded-lg px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.14em] uppercase transition-all duration-150 ${format === fmt ? 'bg-avs-primary text-avs-secondary' : 'text-avs-accent/35'}`}
              >{fmt}</button>
            ))}
          </div>
        </div>

        {/* Code block */}
        <div className="relative">
          {/* Traffic lights header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-avs-accent/90">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/65" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/65" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/65" />
            </div>
            <button
              onClick={() => void copyCode()}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[9px] font-semibold text-avs-secondary/40 transition-all hover:bg-avs-secondary/10 hover:text-avs-secondary/75"
            >
              {copied
                ? <><Check size={9} className="text-emerald-400" /> Copié</>
                : <><Copy size={9} /> Copier</>
              }
            </button>
          </div>
          <pre className="overflow-x-auto px-5 py-5 font-mono text-[11px] leading-[1.8] bg-avs-accent text-avs-secondary/80">
            <code>{code}</code>
          </pre>
        </div>
      </div>

      {/* Download button — accentHex justified inline for dynamic boxShadow */}
      <button
        onClick={download}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-sm font-bold text-avs-secondary transition-all duration-300 hover:-translate-y-0.5"
        style={{ background: palette.accentHex, boxShadow: `0 4px 16px ${palette.accentHex}30` }}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
        <Download size={14} aria-hidden />
        Télécharger la palette
        <ArrowUpRight size={12} className="opacity-60" aria-hidden />
      </button>

      {/* Cultural note — accentHex justified inline for dynamic border/bg tints */}
      <div
        className="rounded-xl p-4 text-xs leading-relaxed"
        style={{
          background: `${palette.accentHex}09`,
          borderLeft: `3px solid ${palette.accentHex}40`,
          border: `1px solid ${palette.accentHex}20`,
          borderLeftWidth: 3,
        }}
      >
        <p className={`mb-1 font-mono text-[9px] font-black tracking-[0.18em] uppercase ${palette.accentClass}`}>
          Note culturelle
        </p>
        <p className="text-avs-accent/55">
          Chaque couleur est documentée avec sa source primaire — artisan, région, matière. Cliquez sur un swatch pour copier le HEX.
        </p>
      </div>

      {/* Color grid preview (mini) */}
      <div className="overflow-hidden rounded-xl border border-avs-accent/9">
        <div className="flex h-10">
          {PALETTES.find((p) => p.id === palette.id)?.tokens.map((t) => (
            <div key={t.hex} className="flex-1" style={{ background: t.hex }} title={t.name} />
          ))}
        </div>
        <div className="flex px-3 py-2.5 bg-avs-secondary border-t border-avs-accent/9">
          {PALETTES.find((p) => p.id === palette.id)?.tokens.map((t) => (
            <div key={t.hex} className="flex-1 text-center">
              <p className="font-mono text-[8px] text-avs-accent/35">{t.hex}</p>
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
    <div className="min-h-screen bg-avs-secondary-dark">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 border-b border-avs-accent/9">
        <div className="avs-pattern-wax-dakar absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" aria-hidden />
        {/* Warm halo — justified inline: radial-gradient with dynamic palette color */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 80% at 5% 50%, rgba(192,87,62,0.06) 0%, transparent 65%)' }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-avs-primary" aria-hidden />
                <span className="font-mono text-[9px] font-bold tracking-[0.26em] uppercase text-avs-primary">Design Tokens</span>
              </div>
              <h1
                className="font-display font-black leading-none text-avs-accent"
                style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.03em' }}
              >
                Palettes &amp; Couleurs
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-avs-accent/55">
                Chaque couleur extraite de pigments naturels africains, documentée avec sa signification
                culturelle. Exportez en CSS, JSON ou Tailwind.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex shrink-0 gap-3">
              {[
                { v: `${PALETTES.length}`,                                   l: 'palettes' },
                { v: `${PALETTES.reduce((a, p) => a + p.tokens.length, 0)}`, l: 'couleurs' },
                { v: '3',                                                     l: 'formats'  },
                { v: '2',                                                     l: 'sources'  },
              ].map(({ v, l }) => (
                <div key={l} className="rounded-xl px-4 py-3 text-center bg-avs-secondary border border-avs-accent/9">
                  <p className="font-display text-2xl font-black leading-none text-avs-accent" style={{ letterSpacing: '-0.02em' }}>{v}</p>
                  <p className="mt-1 font-mono text-[9px] tracking-wide uppercase text-avs-accent/35">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Tabs.Root value={activePalette} onValueChange={setActivePalette}>

          {/* Palette tabs */}
          <Tabs.List aria-label="Palettes culturelles" className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {PALETTES.map((p) => (
              <Tabs.Trigger
                key={p.id}
                value={p.id}
                className={`
                  shrink-0 whitespace-nowrap rounded-xl px-5 py-2.5 text-[13px] font-semibold
                  border transition-all duration-180
                  data-[state=inactive]:text-avs-accent/55 data-[state=inactive]:border-transparent
                  data-[state=inactive]:hover:bg-avs-accent/4 data-[state=inactive]:hover:border-avs-accent/9 data-[state=inactive]:hover:text-avs-accent
                  data-[state=active]:text-avs-secondary data-[state=active]:border-transparent
                `}
                style={activePalette === p.id
                  ? { background: p.accentHex, boxShadow: `0 4px 16px ${p.accentHex}30` }
                  : {}
                }
              >
                <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: p.accentHex }} aria-hidden />
                {p.name}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Palette content */}
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
                        {/* Multi-stop gradient — justified inline */}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.93) 0%, rgba(26,18,8,0.82) 100%)' }} />
                        {/* Dynamic radial halo — accentHex justified inline */}
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{ background: `radial-gradient(ellipse 55% 80% at 0% 50%, ${p.accentHex}22 0%, transparent 65%)` }}
                          aria-hidden
                        />
                        <div className="relative px-7 py-6">
                          <div className="mb-1 flex items-center gap-2">
                            <div className="h-px w-6" style={{ background: p.accentHex }} aria-hidden />
                            <p className={`font-mono text-[9px] font-bold tracking-[0.22em] uppercase ${p.accentClass}`}>{p.origin}</p>
                          </div>
                          <h2 className="font-display text-2xl font-black leading-tight text-avs-secondary" style={{ letterSpacing: '-0.02em' }}>{p.name}</h2>
                          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-avs-secondary/60">{p.description}</p>

                          {/* Token count badge — accentHex justified inline for dynamic bg/border */}
                          <div
                            className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                            style={{ background: `${p.accentHex}18`, border: `1px solid ${p.accentHex}30` }}
                          >
                            <span className={`font-mono text-[9px] font-bold tracking-wide uppercase ${p.accentClass}`}>
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
                      <div className="mt-6 overflow-hidden rounded-xl border border-avs-accent/9">
                        <div className="flex h-12">
                          {p.tokens.map((t) => (
                            <motion.div
                              key={t.hex}
                              className="group relative flex-1 cursor-pointer overflow-hidden"
                              style={{ background: t.hex }}
                              whileHover={{ flex: 2 }}
                              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                              title={`${t.name} · ${t.hex}`}
                            >
                              <div className="absolute inset-0 flex items-end justify-center pb-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                <span
                                  className="font-mono text-[8px] font-bold"
                                  style={{ color: isLightColor(t.hex) ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.75)' }}
                                >
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
  );
}