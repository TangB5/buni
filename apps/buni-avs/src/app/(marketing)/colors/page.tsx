'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { Copy, Check, Download } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ColorToken {
  name: string;
  hex: string;
  meaning: string;
  origin: string;
  css: string;
}

interface Palette {
  id: string;
  name: string;
  origin: string;
  description: string;
  tokens: ColorToken[];
  patternCSS: string;
}

// ── Données ────────────────────────────────────────────────────────────────────
const PALETTES: Palette[] = [
  {
    id: 'avs-core',
    name: 'AVS Core',
    origin: 'Standard AVS',
    description:
      'La palette officielle du standard African Visual Standard — terracotta, lin naturel et obsidienne.',
    patternCSS: 'avs-pattern-wax',
    tokens: [
      {
        name: 'avs-primary',
        hex: '#C0573E',
        meaning: 'Terre brûlée — chaleur, énergie, identité',
        origin: 'Poterie Yoruba',
        css: '--avs-primary',
      },
      {
        name: 'avs-secondary',
        hex: '#F5EBE0',
        meaning: 'Lin naturel — repos, clarté, neutralité',
        origin: 'Tissu Fulani',
        css: '--avs-secondary',
      },
      {
        name: 'avs-accent',
        hex: '#1D1D1B',
        meaning: 'Obsidienne — profondeur, autorité, nuit',
        origin: 'Basalte Kenya',
        css: '--avs-accent',
      },
    ],
  },
  {
    id: 'kente',
    name: 'Kente Asante',
    origin: 'Ghana',
    description: 'Palette extraite du tissu royal Akan — or royal, noir sacré, rouge du sacrifice.',
    patternCSS: 'avs-pattern-kente',
    tokens: [
      {
        name: 'kente-gold',
        hex: '#D4A017',
        meaning: 'Or royal — richesse, royauté, soleil',
        origin: 'Fil de soie Asante',
        css: '--avs-kente',
      },
      {
        name: 'kente-black',
        hex: '#1D1D1B',
        meaning: 'Noir maturité — sagesse, énergie cosmique',
        origin: 'Encre de charbon',
        css: '--avs-accent',
      },
      {
        name: 'kente-red',
        hex: '#C0573E',
        meaning: 'Rouge sang — sacrifice, courage, ancêtres',
        origin: 'Ocre ferrugineux',
        css: '--avs-primary',
      },
      {
        name: 'kente-green',
        hex: '#4A6741',
        meaning: 'Vert forêt — croissance, vie, renouveau',
        origin: 'Plantes indigo',
        css: '--avs-ndop',
      },
    ],
  },
  {
    id: 'ndop',
    name: 'Ndop Bamoum',
    origin: 'Cameroun',
    description:
      'Teintes profondes du tissu sacré Bamoum — indigo cosmos, or raphia, ivoire rituel.',
    patternCSS: 'avs-pattern-ndop-royal',
    tokens: [
      {
        name: 'ndop-indigo',
        hex: '#0D2340',
        meaning: 'Indigo cosmos — eaux primordiales, infini',
        origin: 'Indigo de Foumban',
        css: '--ndop-indigo',
      },
      {
        name: 'ndop-raffia',
        hex: '#C8A96E',
        meaning: 'Or raphia — richesse naturelle, soleil',
        origin: 'Fibre de palmier',
        css: '--avs-raffia',
      },
      {
        name: 'ndop-ivory',
        hex: '#F5EBE0',
        meaning: 'Ivoire — pureté, paix, ancêtres',
        origin: 'Ivoire végétal',
        css: '--avs-secondary',
      },
      {
        name: 'ndop-royal',
        hex: '#2A4A6B',
        meaning: 'Bleu royal — autorité, ciel, puissance',
        origin: 'Teinture naturelle',
        css: '--avs-indigo',
      },
    ],
  },
  {
    id: 'earth',
    name: "Terres d'Afrique",
    origin: 'Pan-Africain',
    description: 'Ocres, siennas et terres minérales extraits des pigments naturels du continent.',
    patternCSS: 'avs-pattern-wax-bold',
    tokens: [
      {
        name: 'earth-sienna',
        hex: '#8B4513',
        meaning: 'Sienna brûlée — sol fertile, ancrage',
        origin: 'Argile du Sahel',
        css: '--avs-earth',
      },
      {
        name: 'earth-ochre',
        hex: '#C8821A',
        meaning: 'Ocre chaude — lumière rasante, crépuscule',
        origin: 'Oxyde de fer',
        css: '--earth-ochre',
      },
      {
        name: 'earth-sand',
        hex: '#E8C99A',
        meaning: 'Sable doré — Sahara, voyage, ouverture',
        origin: 'Dunes sahariennes',
        css: '--earth-sand',
      },
      {
        name: 'earth-baobab',
        hex: '#5C3317',
        meaning: 'Écorce de baobab — durée, mémoire',
        origin: 'Bois de baobab',
        css: '--earth-baobab',
      },
    ],
  },
];

type ExportFormat = 'css' | 'json' | 'tailwind';

// ── Composant ColorSwatch ──────────────────────────────────────────────────────
function ColorSwatch({ token }: { token: ColorToken }) {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const isLight = parseInt(token.hex.slice(1), 16) > 0xaaaaaa;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-avs-lg border-avs-accent/10 shadow-avs overflow-hidden border"
    >
      {/* Swatch couleur */}
      <div
        className="relative h-28 cursor-pointer"
        style={{ backgroundColor: token.hex }}
        onClick={() => void copy(token.hex)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') void copy(token.hex);
        }}
        aria-label={`Copier ${token.hex}`}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <span
            className={`rounded-avs flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold backdrop-blur-sm ${isLight ? 'bg-avs-accent/20 text-avs-accent' : 'bg-white/20 text-white'}`}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copié !' : token.hex}
          </span>
        </div>
      </div>

      {/* Infos */}
      <div className="bg-white p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-avs-accent font-mono text-xs font-semibold">{token.name}</p>
          <button
            onClick={() => void copy(`var(${token.css})`)}
            className="text-avs-accent/30 hover:text-avs-primary font-mono text-[10px]"
            title={`Copier var(${token.css})`}
          >
            {token.css}
          </button>
        </div>
        <p className="text-avs-accent/55 text-xs leading-snug">{token.meaning}</p>
        <p className="text-avs-accent/35 mt-1.5 text-[10px] italic">Source : {token.origin}</p>
      </div>
    </motion.div>
  );
}

// ── Générateurs d'export ──────────────────────────────────────────────────────
function generateExport(palette: Palette, format: ExportFormat): string {
  switch (format) {
    case 'css':
      return `:root {\n${palette.tokens.map((t) => `  ${t.css}: ${t.hex}; /* ${t.name} */`).join('\n')}\n}`;
    case 'json':
      return JSON.stringify(
        Object.fromEntries(palette.tokens.map((t) => [t.name, { hex: t.hex, css: t.css }])),
        null,
        2,
      );
    case 'tailwind':
      return `// tailwind.config.ts\ncolors: {\n${palette.tokens.map((t) => `  '${t.name}': '${t.hex}',`).join('\n')}\n}`;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ColorsPage() {
  const [activePalette, setActivePalette] = useState(PALETTES[0]!.id);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);

  const palette = PALETTES.find((p) => p.id === activePalette) ?? PALETTES[0]!;
  const exportCode = generateExport(palette, exportFormat);

  const copyExport = async () => {
    await navigator.clipboard.writeText(exportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-avs-secondary min-h-screen">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="avs-pattern-wax border-avs-accent/10 border-b px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="text-avs-primary text-xs font-bold tracking-[0.2em] uppercase">
            Design Tokens
          </span>
          <h1 className="font-display text-avs-accent mt-1 text-4xl font-bold sm:text-5xl">
            Palettes & Couleurs
          </h1>
          <p className="text-avs-accent/60 mt-3 max-w-lg leading-relaxed">
            Chaque couleur extrait de pigments naturels africains, documentée avec sa signification
            culturelle. Exportez en CSS, JSON ou Tailwind.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Onglets palettes ────────────────────────────────────────────────── */}
        <Tabs.Root value={activePalette} onValueChange={setActivePalette}>
          <Tabs.List
            aria-label="Palettes culturelles"
            className="mb-8 flex gap-2 overflow-x-auto pb-1"
          >
            {PALETTES.map((p) => (
              <Tabs.Trigger
                key={p.id}
                value={p.id}
                className="rounded-avs text-avs-accent/60 hover:text-avs-accent data-[state=active]:bg-avs-primary data-[state=active]:text-avs-secondary data-[state=active]:shadow-avs shrink-0 px-5 py-2.5 text-sm font-semibold transition-all"
              >
                {p.name}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {PALETTES.map((p) => (
            <Tabs.Content key={p.id} value={p.id}>
              <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                {/* Swatches */}
                <div>
                  {/* En-tête palette */}
                  <div
                    className={`${p.patternCSS} rounded-avs-lg relative mb-6 overflow-hidden p-6`}
                  >
                    <div className="bg-avs-accent/60 absolute inset-0" />
                    <div className="relative">
                      <p className="text-avs-primary text-xs font-bold tracking-widest uppercase">
                        {p.origin}
                      </p>
                      <h2 className="font-display text-avs-secondary text-2xl font-bold">
                        {p.name}
                      </h2>
                      <p className="text-avs-secondary mt-1 text-sm">{p.description}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {p.tokens.map((token) => (
                      <ColorSwatch key={token.name} token={token} />
                    ))}
                  </div>
                </div>

                {/* Export panel */}
                <div className="space-y-4">
                  <div className="rounded-avs-lg border-avs-accent/10 shadow-avs border bg-white p-5">
                    <h3 className="font-display text-avs-accent mb-4 font-bold">Exporter</h3>

                    {/* Format selector */}
                    <div className="mb-4 flex gap-2">
                      {(['css', 'json', 'tailwind'] as ExportFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setExportFormat(fmt)}
                          className={`rounded-avs px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${exportFormat === fmt ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'border-avs-accent/15 text-avs-accent/60 hover:text-avs-accent border'}`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>

                    {/* Code block */}
                    <div className="relative">
                      <pre className="rounded-avs bg-avs-accent text-avs-secondary overflow-x-auto p-4 font-mono text-[11px] leading-relaxed">
                        {exportCode}
                      </pre>
                      <button
                        onClick={() => void copyExport()}
                        className="rounded-avs bg-avs-secondary/10 text-avs-secondary/60 hover:text-avs-secondary absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-[10px] font-semibold"
                        aria-label="Copier le code"
                      >
                        {copied ? <Check size={11} /> : <Copy size={11} />}
                        {copied ? 'Copié' : 'Copier'}
                      </button>
                    </div>
                  </div>

                  {/* Télécharger */}
                  <button className="rounded-avs-lg bg-avs-primary text-avs-secondary shadow-avs hover:shadow-avs-md flex w-full items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5">
                    <Download size={15} aria-hidden />
                    Télécharger la palette complète
                  </button>

                  {/* Note culturelle */}
                  <div className="rounded-avs border-avs-kente bg-avs-kente/5 text-avs-accent/70 border-l-4 p-4 text-xs leading-relaxed">
                    <strong className="text-avs-accent">Note culturelle :</strong> Chaque couleur
                    est documentée avec sa source primaire. Cliquez sur un swatch pour copier le
                    HEX.
                  </div>
                </div>
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </div>
  );
}
