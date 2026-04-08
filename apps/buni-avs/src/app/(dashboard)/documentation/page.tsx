'use client';

import { useState, useRef, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Copy,
  Check,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  BookOpen,
  Hash,
  ArrowLeft,
  ArrowRight,
  Sun,
  Layers,
  ChevronDown,
  AlertCircle,
  Info,
  Lightbulb,
} from 'lucide-react';

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════
interface TocEntry {
  id: string;
  label: string;
  level: 1 | 2 | 3;
}
interface DocPage {
  id: string;
  title: string;
  content: React.FC;
  toc: TocEntry[];
}
interface DocSection {
  id: string;
  title: string;
  icon: string;
  pages: DocPage[];
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED MICRO-COMPONENTS (used inside doc pages)
// ══════════════════════════════════════════════════════════════════════════════
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback(async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2200);
  }, []);
  return { copied, copy };
}

function CodeBlock({
  code,
  lang = 'tsx',
  id,
  title,
}: {
  code: string;
  lang?: string;
  id: string;
  title?: string;
}) {
  const { copied, copy } = useCopy();
  return (
    <div className="group rounded-avs-lg border-avs-accent/12 shadow-avs my-5 overflow-hidden border">
      <div className="border-avs-accent/12 flex items-center justify-between border-b bg-[#1a1a18] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-3 w-3 rounded-full bg-red-500/60" />
            <span className="h-3 w-3 rounded-full bg-amber-400/60" />
            <span className="h-3 w-3 rounded-full bg-green-500/60" />
          </div>
          {title && <span className="font-mono text-[10px] text-white/30">{title}</span>}
          {!title && (
            <span className="font-mono text-[10px] tracking-widest text-white/25 uppercase">
              {lang}
            </span>
          )}
        </div>
        <button
          onClick={() => void copy(code, id)}
          className="rounded-avs flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold text-white/40 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/10 hover:text-white/80"
        >
          {copied === id ? (
            <>
              <Check size={11} /> Copié !
            </>
          ) : (
            <>
              <Copy size={11} /> Copier
            </>
          )}
        </button>
      </div>
      <pre className="scrollbar-thin overflow-x-auto bg-[#141412] p-5 font-mono text-[12px] leading-[1.75] text-[#d4d0c8]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: 'info' | 'tip' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
}) {
  const conf = {
    info: {
      css: 'border-l-avs-indigo bg-avs-indigo/6 border-avs-indigo/40',
      icon: Info,
      tc: 'text-avs-indigo',
      label: title ?? 'Info',
    },
    tip: {
      css: 'border-l-avs-ndop  bg-avs-ndop/6  border-avs-ndop/40',
      icon: Lightbulb,
      tc: 'text-avs-ndop',
      label: title ?? 'Astuce',
    },
    warning: {
      css: 'border-l-amber-500 bg-amber-50    border-amber-200',
      icon: AlertCircle,
      tc: 'text-amber-700',
      label: title ?? 'Attention',
    },
    danger: {
      css: 'border-l-red-500   bg-red-50      border-red-200',
      icon: AlertCircle,
      tc: 'text-red-600',
      label: title ?? 'Important',
    },
  }[type];
  const Icon = conf.icon;
  return (
    <div className={`rounded-r-avs-lg my-5 flex gap-3 border border-l-4 px-4 py-4 ${conf.css}`}>
      <Icon size={16} className={`mt-0.5 shrink-0 ${conf.tc}`} aria-hidden />
      <div>
        <p className={`mb-1 text-xs font-bold tracking-wider uppercase ${conf.tc}`}>{conf.label}</p>
        <div className="text-avs-accent/70 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function PropTable({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <div className="rounded-avs-lg border-avs-accent/10 my-5 overflow-x-auto border">
      <table className="w-full min-w-[560px] text-xs">
        <thead>
          <tr className="border-avs-accent/10 bg-avs-accent/4 border-b">
            {['Prop', 'Type', 'Défaut', 'Description'].map((h) => (
              <th
                key={h}
                className="text-avs-accent/40 px-4 py-2.5 text-left font-bold tracking-wider uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-avs-accent/6 divide-y bg-white">
          {rows.map(([prop, type, def, desc]) => (
            <tr key={prop} className="hover:bg-avs-primary/3 transition-colors">
              <td className="text-avs-primary px-4 py-2.5 font-mono font-bold">{prop}</td>
              <td className="text-avs-indigo/80 px-4 py-2.5 font-mono">{type}</td>
              <td className="text-avs-accent/45 px-4 py-2.5 font-mono">{def}</td>
              <td className="text-avs-accent/65 px-4 py-2.5">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LiveDemo({
  children,
  label = 'Démonstration live',
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className="rounded-avs-lg border-avs-accent/10 my-5 overflow-hidden border">
      <div className="border-avs-accent/10 bg-avs-accent/4 flex items-center gap-2 border-b px-4 py-2.5">
        <span className="bg-avs-primary h-2 w-2 rounded-full" aria-hidden />
        <span className="text-avs-accent/40 text-[10px] font-bold tracking-widest uppercase">
          {label}
        </span>
      </div>
      <div
        className="bg-avs-secondary/50 p-8"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(29,29,27,0.04) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SectionAnchor({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={id} className="group flex scroll-mt-24 items-center gap-2">
      {children}
      <a
        href={`#${id}`}
        className="text-avs-accent/30 hover:text-avs-primary opacity-0 transition-opacity group-hover:opacity-100"
        aria-label={`Lien vers ${id}`}
      >
        <Hash size={14} />
      </a>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE CONTENTS — each is a standalone React component
// ══════════════════════════════════════════════════════════════════════════════

// ── Introduction ──────────────────────────────────────────────────────────────
const IntroductionPage: React.FC = () => (
  <div className="prose-avs">
    <div className="avs-pattern-ndop-royal rounded-avs-lg relative mb-8 overflow-hidden">
      <div className="from-avs-accent/95 to-avs-accent/75 absolute inset-0 bg-gradient-to-r" />
      <div className="relative px-8 py-10">
        <p className="text-avs-primary mb-2 text-[10px] font-bold tracking-[0.2em] uppercase">
          v1.0 · Open Standard
        </p>
        <h1 className="font-display text-avs-secondary text-3xl font-bold">
          AVS — African Visual Standard
        </h1>
        <p className="text-avs-secondary/65 mt-3 max-w-lg text-sm leading-relaxed">
          Bibliothèque de composants UI open-source construite avec React, Radix UI et Tailwind CSS.
          Inspirée du patrimoine visuel africain. Aucun compte requis.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            'React 18+',
            'Next.js 14+',
            'TypeScript',
            'Tailwind CSS',
            'Radix UI',
            'Framer Motion',
          ].map((t) => (
            <span
              key={t}
              className="rounded-avs bg-avs-secondary/15 text-avs-secondary/70 px-2.5 py-1 font-mono text-[10px] font-semibold"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>

    <SectionAnchor id="philosophie">
      <h2>Philosophie</h2>
    </SectionAnchor>
    <p>
      AVS adopte l&apos;approche <strong>Copy &amp; Paste</strong> popularisée par Shadcn/UI : vous
      copiez les composants dans votre projet, ils vous appartiennent entièrement. Pas de dépendance
      opaque, pas de lock-in.
    </p>

    <div className="my-6 grid gap-4 sm:grid-cols-2">
      {[
        {
          icon: '🌍',
          title: 'Culturellement ancré',
          desc: 'Chaque token de couleur, motif et composant est documenté avec sa source primaire africaine.',
        },
        {
          icon: '🔓',
          title: 'Public par défaut',
          desc: 'Composants, motifs, templates — tout est accessible sans authentification, comme PrimeReact.',
        },
        {
          icon: '⚡',
          title: 'Copy & Paste',
          desc: 'Vous possédez votre code. Aucune dépendance lourde. Adaptez, étendez, supprimez.',
        },
        {
          icon: '🎨',
          title: 'Design System cohérent',
          desc: 'Palette extraite de pigments naturels africains, tokens CSS, motifs CSS pur.',
        },
      ].map(({ icon, title, desc }) => (
        <div key={title} className="rounded-avs-lg border-avs-accent/10 border bg-white p-5">
          <div className="mb-2 text-2xl">{icon}</div>
          <h3 className="font-display text-avs-accent mb-1 text-sm font-bold">{title}</h3>
          <p className="text-avs-accent/55 text-xs leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>

    <SectionAnchor id="comparaison">
      <h2>Comparaison avec PrimeReact</h2>
    </SectionAnchor>
    <div className="rounded-avs-lg border-avs-accent/10 my-4 overflow-x-auto border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-avs-accent/10 bg-avs-accent/4 border-b">
            {['Fonctionnalité', 'AVS', 'PrimeReact', 'Shadcn'].map((h) => (
              <th
                key={h}
                className="text-avs-accent/40 px-4 py-2.5 text-left font-bold tracking-wider uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-avs-accent/6 divide-y bg-white">
          {[
            ['Accès sans compte', '✅', '✅', '✅'],
            ['Copy & Paste', '✅', '❌', '✅'],
            ['Design africain', '✅', '❌', '❌'],
            ['SVG natifs', '✅', '⚠️', '❌'],
            ['Motifs CSS', '✅', '❌', '❌'],
            ['Radix UI', '✅', '❌', '✅'],
            ['TypeScript strict', '✅', '✅', '✅'],
            ['CDN disponible', '✅', '✅', '❌'],
          ].map(([feat, ...vals]) => (
            <tr key={feat} className="hover:bg-avs-primary/3 transition-colors">
              <td className="text-avs-accent px-4 py-2.5 font-semibold">{feat}</td>
              {vals.map((v, i) => (
                <td key={i} className="px-4 py-2.5 text-center">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Callout type="tip" title="Bonne pratique">
      Commencez par lire la section Installation, puis explorez les Composants directement sur la
      page{' '}
      <a href="/components" className="text-avs-primary font-semibold hover:underline">
        /components
      </a>{' '}
      qui propose des previews live interactives.
    </Callout>
  </div>
);

// ── Installation ──────────────────────────────────────────────────────────────
const InstallationPage: React.FC = () => {
  const [pkgMgr, setPkgMgr] = useState<'npm' | 'pnpm' | 'yarn'>('npm');
  const cmds = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add' };

  return (
    <div className="prose-avs">
      <SectionAnchor id="installation">
        <h1>Installation</h1>
      </SectionAnchor>
      <p>
        Plusieurs méthodes pour intégrer AVS dans votre projet. La méthode CLI est recommandée pour
        démarrer rapidement.
      </p>

      <SectionAnchor id="methode-cli">
        <h2>Méthode 1 — CLI (recommandé)</h2>
      </SectionAnchor>
      <p>
        Le CLI AVS initialise votre projet et ajoute uniquement les composants dont vous avez
        besoin.
      </p>
      <CodeBlock
        id="cli-init"
        lang="bash"
        title="Terminal"
        code={`# Initialiser AVS dans un projet Next.js existant
npx @avs/cli init

# Répondre aux questions :
# ✔ Chemin src/ ? › src
# ✔ Alias import ? › @/*
# ✔ Ajouter les motifs CSS ? › Oui
# ✔ Ajouter le design system complet ? › Oui`}
      />
      <CodeBlock
        id="cli-add"
        lang="bash"
        title="Terminal"
        code={`# Ajouter des composants individuellement
npx @avs/cli add button
npx @avs/cli add badge
npx @avs/cli add pattern-card
npx @avs/cli add svg-pattern
npx @avs/cli add toast

# Lister tous les composants disponibles
npx @avs/cli list`}
      />

      <SectionAnchor id="methode-npm">
        <h2>Méthode 2 — Package npm</h2>
      </SectionAnchor>

      {/* Sélecteur gestionnaire de packages */}
      <div className="rounded-avs border-avs-accent/15 mb-2 flex w-fit items-center gap-1 border p-0.5">
        {(['npm', 'pnpm', 'yarn'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setPkgMgr(m)}
            className={`rounded-avs px-3 py-1.5 font-mono text-xs font-semibold transition-all ${pkgMgr === m ? 'bg-avs-primary text-avs-secondary shadow-avs' : 'text-avs-accent/55 hover:text-avs-accent'}`}
          >
            {m}
          </button>
        ))}
      </div>
      <CodeBlock
        id="npm-install"
        lang="bash"
        title="Terminal"
        code={`${cmds[pkgMgr]} @avs/ui @avs/icons
${cmds[pkgMgr]} @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-tabs
${cmds[pkgMgr]} framer-motion clsx tailwind-merge class-variance-authority`}
      />

      <SectionAnchor id="methode-cdn">
        <h2>Méthode 3 — CDN (HTML pur)</h2>
      </SectionAnchor>
      <p>Pour intégrer AVS dans un projet HTML sans build tool :</p>
      <CodeBlock
        id="cdn"
        lang="html"
        title="index.html"
        code={`<!DOCTYPE html>
<html lang="fr">
<head>
  <!-- Design System AVS -->
  <link rel="stylesheet" href="https://cdn.avs-standard.com/ui/latest/avs-ui.min.css" />
</head>
<body>
  <!-- Composants Web AVS -->
  <avs-button variant="primary">Cliquez ici</avs-button>

  <!-- Motif SVG depuis CDN -->
  <img src="https://cdn.avs-standard.com/icons/v1/ndop-bamoum.svg"
       alt="Ndop Bamoum" width="64" height="64" />

  <script src="https://cdn.avs-standard.com/ui/latest/avs-ui.min.js"></script>
</body>
</html>`}
      />

      <SectionAnchor id="methode-copier">
        <h2>Méthode 4 — Copy & Paste</h2>
      </SectionAnchor>
      <p>
        Comme Shadcn/UI, copiez le code depuis la page{' '}
        <a href="/components" className="text-avs-primary font-semibold hover:underline">
          /components
        </a>
        . Chaque composant affiche son code source complet prêt à copier.
      </p>

      <Callout type="info">
        Les fichiers SVG sont déjà dans <code>public/patterns/</code> si vous avez cloné le repo.
        Sinon, téléchargez-les depuis{' '}
        <a href="/icons" className="text-avs-primary font-semibold">
          la page Icônes
        </a>
        .
      </Callout>

      <SectionAnchor id="configuration">
        <h2>Configuration Tailwind</h2>
      </SectionAnchor>
      <p>
        Ajoutez la configuration AVS dans votre <code>tailwind.config.ts</code> :
      </p>
      <CodeBlock
        id="tailwind-config"
        lang="ts"
        title="tailwind.config.ts"
        code={`import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'avs-primary':   '#C0573E',   // Terre brûlée
        'avs-secondary': '#F5EBE0',   // Lin naturel
        'avs-accent':    '#1D1D1B',   // Obsidienne
        'avs-kente':     '#D4A017',   // Or kente
        'avs-ndop':      '#4A6741',   // Vert Bamiléké
        'avs-indigo':    '#2A4A6B',   // Bleu bogolan
        'avs-earth':     '#8B4513',   // Ocre savane
        'avs-raffia':    '#C8A96E',   // Raphia naturel
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        'avs':    '0.375rem',
        'avs-lg': '1.5rem',
        'avs-xl': '3rem',
      },
      boxShadow: {
        'avs':    '3px 3px 0px 0px #1D1D1B',
        'avs-md': '5px 5px 0px 0px #C0573E',
        'avs-lg': '8px 8px 0px 0px #1D1D1B',
      },
    },
  },
};

export default config;`}
      />

      <SectionAnchor id="globals">
        <h2>globals.css</h2>
      </SectionAnchor>
      <CodeBlock
        id="globals"
        lang="css"
        title="src/app/globals.css"
        code={`@tailwind base;
@tailwind components;
@tailwind utilities;

/* Design tokens AVS */
@import '../theme/tokens/avs-tokens.css';

/* Motifs africains CSS */
@import '../theme/patterns/patterns.css';

/* Classes utilitaires */
@layer components {
  .avs-input  { @apply w-full rounded-avs border-2 border-avs-accent/15 bg-white px-4 py-2.5 text-sm focus:border-avs-primary focus:outline-none; }
  .avs-btn-primary   { @apply inline-flex items-center justify-center gap-2 rounded-avs bg-avs-primary px-5 py-2.5 text-sm font-bold text-avs-secondary shadow-avs hover:-translate-y-0.5 hover:shadow-avs-md transition-all; }
  .avs-btn-secondary { @apply inline-flex items-center justify-center gap-2 rounded-avs border-2 border-avs-accent/20 px-5 py-2.5 text-sm font-semibold text-avs-accent hover:border-avs-primary hover:text-avs-primary transition-all; }
}`}
      />
    </div>
  );
};

// ── Design Tokens ─────────────────────────────────────────────────────────────
const DesignTokensPage: React.FC = () => {
  const { copied, copy } = useCopy();

  const palette = [
    {
      name: 'avs-primary',
      hex: '#C0573E',
      label: 'Terre brûlée',
      origin: 'Poterie Yoruba',
      tw: 'bg-avs-primary',
    },
    {
      name: 'avs-secondary',
      hex: '#F5EBE0',
      label: 'Lin naturel',
      origin: 'Tissu Fulani',
      tw: 'bg-avs-secondary border border-avs-accent/20',
    },
    {
      name: 'avs-accent',
      hex: '#1D1D1B',
      label: 'Obsidienne',
      origin: 'Basalte Kenya',
      tw: 'bg-avs-accent',
    },
    {
      name: 'avs-kente',
      hex: '#D4A017',
      label: 'Or kente',
      origin: 'Fil soie Asante',
      tw: 'bg-avs-kente',
    },
    {
      name: 'avs-ndop',
      hex: '#4A6741',
      label: 'Vert Bamiléké',
      origin: 'Plantes indigo',
      tw: 'bg-avs-ndop',
    },
    {
      name: 'avs-indigo',
      hex: '#2A4A6B',
      label: 'Bleu bogolan',
      origin: 'Teinture Bambara',
      tw: 'bg-avs-indigo',
    },
    {
      name: 'avs-earth',
      hex: '#8B4513',
      label: 'Ocre savane',
      origin: 'Argile du Sahel',
      tw: 'bg-avs-earth',
    },
    {
      name: 'avs-raffia',
      hex: '#C8A96E',
      label: 'Raphia naturel',
      origin: 'Fibre de palmier',
      tw: 'bg-avs-raffia',
    },
  ];

  return (
    <div className="prose-avs">
      <SectionAnchor id="tokens">
        <h1>Design Tokens</h1>
      </SectionAnchor>
      <p>
        La palette AVS est extraite de pigments naturels africains. Chaque couleur est documentée
        avec sa source ethnographique primaire. Cliquez sur un swatch pour copier le HEX.
      </p>

      <SectionAnchor id="palette">
        <h2>Palette principale</h2>
      </SectionAnchor>
      <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {palette.map(({ name, hex, label, origin, tw }) => (
          <button
            key={name}
            onClick={() => void copy(hex, name)}
            className="group rounded-avs-lg border-avs-accent/10 shadow-avs hover:shadow-avs-md overflow-hidden border text-left transition-all hover:-translate-y-0.5"
          >
            <div className={`relative h-14 ${tw}`}>
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-[10px] font-bold text-white">
                  {copied === name ? '✓ Copié' : 'Copier HEX'}
                </span>
              </div>
            </div>
            <div className="bg-white p-2.5">
              <p className="text-avs-accent/40 font-mono text-[9px]">{hex}</p>
              <p className="text-avs-accent mt-0.5 text-xs font-semibold">{label}</p>
              <p className="text-avs-accent/30 mt-0.5 font-mono text-[8px]">{name}</p>
              <p className="text-avs-accent/25 mt-0.5 text-[8px] italic">{origin}</p>
            </div>
          </button>
        ))}
      </div>

      <SectionAnchor id="usage-tailwind">
        <h2>Usage Tailwind</h2>
      </SectionAnchor>
      <CodeBlock
        id="tw-usage"
        lang="tsx"
        code={`// Couleurs de fond
<div className="bg-avs-primary" />
<div className="bg-avs-secondary" />
<div className="bg-avs-kente" />

// Couleurs de texte
<p className="text-avs-primary" />
<p className="text-avs-accent" />

// Bordures
<div className="border-avs-primary" />
<div className="border-avs-accent/20" />   {/* avec opacité */}

// Avec opacités arbitraires
<div className="bg-avs-primary/10" />     {/* 10% */}
<div className="bg-avs-primary/50" />     {/* 50% */}`}
      />

      <SectionAnchor id="css-variables">
        <h2>CSS Custom Properties</h2>
      </SectionAnchor>
      <CodeBlock
        id="css-vars"
        lang="css"
        title="src/theme/tokens/avs-tokens.css"
        code={`:root {
  --avs-primary:   #C0573E;
  --avs-secondary: #F5EBE0;
  --avs-accent:    #1D1D1B;
  --avs-kente:     #D4A017;
  --avs-ndop:      #4A6741;
  --avs-indigo:    #2A4A6B;
  --avs-earth:     #8B4513;
  --avs-raffia:    #C8A96E;

  /* Ombres */
  --shadow-avs:    3px 3px 0px 0px var(--avs-accent);
  --shadow-avs-md: 5px 5px 0px 0px var(--avs-primary);

  /* Rayons */
  --radius-avs:    0.375rem;
  --radius-avs-lg: 1.5rem;

  /* Transitions */
  --transition: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}`}
      />

      <SectionAnchor id="typography">
        <h2>Typographie</h2>
      </SectionAnchor>
      <LiveDemo label="Échelle typographique">
        <div className="space-y-3">
          <p className="font-display text-avs-accent text-4xl font-bold">
            Display — Playfair Display
          </p>
          <p className="font-body text-avs-accent/70 text-base">
            Body — DM Sans · Texte courant et interfaces
          </p>
          <p className="text-avs-accent/60 font-mono text-sm">
            Mono — JetBrains Mono · Code et tokens
          </p>
        </div>
      </LiveDemo>
      <CodeBlock
        id="fonts"
        lang="tsx"
        title="src/app/layout.tsx"
        code={`import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';

const playfair = Playfair_Display({ subsets:['latin'], variable:'--font-display' });
const dmSans   = DM_Sans({ subsets:['latin'], variable:'--font-body' });
const mono     = JetBrains_Mono({ subsets:['latin'], variable:'--font-mono' });

// Dans le <html> :
className={\`\${playfair.variable} \${dmSans.variable} \${mono.variable}\`}

// Usage
<h1 className="font-display">Titre</h1>
<p  className="font-body">Texte</p>
<code className="font-mono">Code</code>`}
      />
    </div>
  );
};

// ── CSS Patterns ───────────────────────────────────────────────────────────────
const CssPatternsPage: React.FC = () => (
  <div className="prose-avs">
    <SectionAnchor id="patterns">
      <h1>Motifs CSS</h1>
    </SectionAnchor>
    <p>
      Des motifs africains générés entièrement en CSS — sans image, sans SVG. Utilisation
      instantanée via <code>className</code>.
    </p>

    <SectionAnchor id="patterns-list">
      <h2>Catalogue</h2>
    </SectionAnchor>
    <div className="my-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[
        {
          cls: 'avs-pattern-kente',
          label: 'Kente',
          origin: 'Akan, Ghana',
          desc: 'Bandelettes entrelacées',
        },
        {
          cls: 'avs-pattern-ndop',
          label: 'Ndop',
          origin: 'Bamoum, Cameroun',
          desc: 'Grille et cercles rituels',
        },
        {
          cls: 'avs-pattern-ndop-royal',
          label: 'Ndop Royal',
          origin: 'Sultanat Bamoum',
          desc: 'Fond indigo profond',
        },
        {
          cls: 'avs-pattern-wax',
          label: 'Wax',
          origin: 'Pan-africain',
          desc: 'Losanges et points',
        },
        {
          cls: 'avs-pattern-wax-bold',
          label: 'Wax Bold',
          origin: 'Pan-africain',
          desc: 'Haute densité, foncé',
        },
      ].map(({ cls, label, origin, desc }) => (
        <div
          key={cls}
          className="rounded-avs-lg border-avs-accent/10 shadow-avs overflow-hidden border"
        >
          <div className={`${cls} h-24`} />
          <div className="bg-white p-3">
            <p className="font-display text-avs-accent text-sm font-bold">{label}</p>
            <p className="text-avs-primary mt-0.5 text-[10px] font-semibold">{origin}</p>
            <p className="text-avs-accent/45 mt-0.5 text-[10px]">{desc}</p>
            <p className="text-avs-accent/30 mt-1 font-mono text-[9px]">.{cls}</p>
          </div>
        </div>
      ))}
    </div>

    <SectionAnchor id="patterns-usage">
      <h2>Usages typiques</h2>
    </SectionAnchor>
    <LiveDemo label="Applications des motifs">
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Fond de section */}
        <div className="avs-pattern-ndop-royal rounded-avs-lg relative overflow-hidden">
          <div className="bg-avs-accent/75 absolute inset-0" />
          <div className="relative p-4 text-center">
            <p className="text-avs-secondary text-xs font-bold">Section Hero</p>
          </div>
        </div>
        {/* Avatar */}
        <div className="flex items-center justify-center gap-3">
          <div className="avs-pattern-kente border-avs-secondary shadow-avs flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2">
            <span className="font-display text-avs-secondary text-lg font-black drop-shadow">
              A
            </span>
          </div>
          <span className="text-avs-accent/60 text-xs">Avatar</span>
        </div>
        {/* Spinner */}
        <div className="flex items-center justify-center gap-3">
          <div className="avs-pattern-kente animate-avs-spin h-10 w-10 rounded-full opacity-80" />
          <span className="text-avs-accent/60 text-xs">Spinner</span>
        </div>
      </div>
    </LiveDemo>

    <CodeBlock
      id="patterns-code"
      lang="tsx"
      code={`// Import
import '@/theme/patterns/patterns.css';

// Fond de section
<section className="avs-pattern-ndop-royal relative min-h-screen">
  <div className="absolute inset-0 bg-avs-accent/80" />
  <div className="relative">{/* contenu */}</div>
</section>

// Avatar circulaire
<div className="avs-pattern-kente h-10 w-10 rounded-full border-2 border-white">
  <span className="font-display font-black text-white">A</span>
</div>

// Spinner animé
<div className="avs-pattern-kente h-10 w-10 animate-avs-spin rounded-full" />

// Bande décorative
<div className="avs-pattern-wax h-2 w-full" />

// Card avec pattern header
<div className="avs-card overflow-hidden p-0">
  <div className="avs-pattern-ndop h-1.5 w-full" />
  <div className="p-5">{/* contenu */}</div>
</div>`}
    />

    <Callout type="info">
      Les motifs CSS utilisent des <code>linear-gradient</code> et <code>radial-gradient</code>{' '}
      imbriqués. Ils sont définis dans <code>src/theme/patterns/patterns.css</code> et peuvent être
      surchargés.
    </Callout>
  </div>
);

// ── Button ─────────────────────────────────────────────────────────────────────
const ButtonPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="prose-avs">
      <SectionAnchor id="button">
        <h1>Button</h1>
      </SectionAnchor>
      <p>
        Composant bouton multi-variantes basé sur <strong>CVA</strong> (class-variance-authority) et{' '}
        <strong>Radix Slot</strong>. Supporte le polymorphisme via <code>asChild</code>.
      </p>

      <SectionAnchor id="btn-import">
        <h2>Import</h2>
      </SectionAnchor>
      <CodeBlock
        id="btn-import-code"
        lang="tsx"
        code={`import { Button } from '@/components/ui';
// ou
import { Button } from '@avs/ui';`}
      />

      <SectionAnchor id="btn-variantes">
        <h2>Variantes</h2>
      </SectionAnchor>
      <LiveDemo>
        <div className="flex flex-wrap items-center gap-3">
          {[
            {
              v: 'Primaire',
              cls: 'bg-avs-primary text-avs-secondary shadow-avs hover:-translate-y-0.5 hover:shadow-avs-md',
            },
            {
              v: 'Secondaire',
              cls: 'border-2 border-avs-accent/20 text-avs-accent hover:border-avs-primary hover:text-avs-primary',
            },
            { v: 'Ghost', cls: 'text-avs-primary hover:bg-avs-primary/10' },
            { v: 'Kente', cls: 'bg-avs-kente text-avs-accent shadow-avs hover:-translate-y-0.5' },
            { v: 'Danger', cls: 'bg-red-600 text-white shadow-avs hover:-translate-y-0.5' },
          ].map(({ v, cls }) => (
            <button
              key={v}
              className={`rounded-avs px-4 py-2 text-xs font-bold transition-all ${cls}`}
            >
              {v}
            </button>
          ))}
        </div>
      </LiveDemo>
      <CodeBlock
        id="btn-variants-code"
        lang="tsx"
        code={`<Button variant="primary">Primaire</Button>
<Button variant="secondary">Secondaire</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="kente">Kente</Button>
<Button variant="danger">Danger</Button>`}
      />

      <SectionAnchor id="btn-tailles">
        <h2>Tailles</h2>
      </SectionAnchor>
      <LiveDemo>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { s: 'xs', cls: 'text-[10px] py-1 px-3' },
            { s: 'sm', cls: 'text-xs py-2 px-4' },
            { s: 'md', cls: 'text-sm py-2.5 px-5' },
            { s: 'lg', cls: 'text-base py-3 px-7' },
          ].map(({ s, cls }) => (
            <button
              key={s}
              className={`rounded-avs bg-avs-primary text-avs-secondary shadow-avs font-bold ${cls}`}
            >
              Taille {s.toUpperCase()}
            </button>
          ))}
        </div>
      </LiveDemo>

      <SectionAnchor id="btn-etats">
        <h2>États & Comportements</h2>
      </SectionAnchor>
      <LiveDemo label="États interactifs">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
            disabled={loading}
            className="avs-btn-primary gap-1.5 px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="border-avs-secondary/30 border-t-avs-secondary inline-block h-3 w-3 animate-spin rounded-full border-2" />{' '}
                Chargement…
              </>
            ) : (
              'Cliquer pour charger'
            )}
          </button>
          <button
            className="avs-btn-primary cursor-not-allowed px-4 py-2 text-xs opacity-40"
            disabled
          >
            Désactivé
          </button>
          <button className="avs-btn-primary gap-1.5 px-4 py-2 text-xs">
            <span>⬇</span> Avec icône
          </button>
        </div>
      </LiveDemo>
      <CodeBlock
        id="btn-states-code"
        lang="tsx"
        code={`// Loading
<Button isLoading>Enregistrement…</Button>

// Désactivé
<Button disabled>Indisponible</Button>

// Avec icônes
<Button leftIcon={<Download size={14} />}>Télécharger</Button>
<Button rightIcon={<ArrowRight size={14} />}>Suivant</Button>

// Polymorphique (rendu en <a>)
<Button asChild variant="primary">
  <a href="/patterns">Voir les motifs</a>
</Button>

// Polymorphique (Next.js Link)
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>`}
      />

      <SectionAnchor id="btn-api">
        <h2>API de référence</h2>
      </SectionAnchor>
      <PropTable
        rows={[
          [
            'variant',
            'primary | secondary | ghost | outline | kente | danger',
            'primary',
            'Style visuel du bouton',
          ],
          ['size', 'xs | sm | md | lg | icon', 'md', 'Taille du bouton'],
          ['isLoading', 'boolean', 'false', 'Affiche un spinner à la place du contenu'],
          ['disabled', 'boolean', 'false', 'Désactive toutes les interactions'],
          ['asChild', 'boolean', 'false', "Délègue le rendu à l'enfant (Radix Slot)"],
          ['leftIcon', 'ReactNode', '—', 'Icône affichée à gauche du texte'],
          ['rightIcon', 'ReactNode', '—', 'Icône affichée à droite du texte'],
          ['className', 'string', '—', 'Classes CSS additionnelles'],
        ]}
      />

      <Callout type="tip">
        Pour les liens de navigation, utilisez toujours <code>asChild</code> avec <code>Link</code>{' '}
        de Next.js plutôt que l&apos;attribut <code>href</code> directement, pour bénéficier du
        prefetching.
      </Callout>
    </div>
  );
};

// ── SVG Patterns ───────────────────────────────────────────────────────────────
const SvgPatternPage: React.FC = () => (
  <div className="prose-avs">
    <SectionAnchor id="svg-pattern-comp">
      <h1>SvgPattern</h1>
    </SectionAnchor>
    <p>
      Composant unifié pour afficher, animer et télécharger vos fichiers SVG depuis{' '}
      <code>public/patterns/</code>. Inclut plusieurs modes et sous-composants.
    </p>

    <Callout type="info">
      Vos 3 SVG existants (<code>ndop-bamoum.svg</code>, <code>toghu-bamileke.svg</code>,{' '}
      <code>toghu-bamenda.svg</code>) sont déjà dans <code>public/patterns/</code>. Déclarez-les
      dans <code>svg-patterns.ts</code> pour les utiliser.
    </Callout>

    <SectionAnchor id="svg-registry-config">
      <h2>1 — Déclarer dans le registre</h2>
    </SectionAnchor>
    <CodeBlock
      id="svg-reg"
      lang="ts"
      title="src/core/utils/svg-patterns.ts"
      code={`export const SVG_REGISTRY = {
  // ── Vos motifs Camerounais ─────────────────────────────────────
  'ndop-bamoum': {
    file:        '/patterns/ndop-bamoum.svg',
    name:        'Ndop Bamoum',
    origin:      'Foumban, Cameroun',
    type:        'ndop',
    region:      'central-africa',
    colors:      ['#0D2340', '#C8A96E', '#F5EBE0'],
    description: 'Tissu sacré du Sultanat Bamoum',
    license:     'cc-by',
  },
  'toghu-bamileke': {
    file:        '/patterns/toghu-bamileke.svg',
    name:        'Toghu Bamiléké',
    origin:      'Bafoussam, Cameroun',
    type:        'ndop',
    region:      'central-africa',
    colors:      ['#1D1D1B', '#C0573E', '#D4A017'],
    description: 'Tissu de velours brodé des chefferies Bamiléké',
    license:     'cc-by',
  },
  'toghu-bamenda': {
    file:        '/patterns/toghu-bamenda.svg',
    name:        'Toghu Bamenda',
    origin:      'Bamenda, Cameroun',
    type:        'ndop',
    region:      'central-africa',
    colors:      ['#1D1D1B', '#4A6741', '#C8A96E'],
    description: 'Variante Bamenda du Toghu — région Nord-Ouest',
    license:     'cc-by',
  },
  // Ajoutez vos SVG ici suivant le même format
};`}
    />

    <SectionAnchor id="svg-usage-modes">
      <h2>2 — Usages</h2>
    </SectionAnchor>
    <CodeBlock
      id="svg-use"
      lang="tsx"
      code={`import { SvgPattern, SvgPatternHero, SvgPatternGrid, SvgDownloadCard }
  from '@/components/ui/SvgPattern';

// ── Affichage simple ──────────────────────────────────────────────
<SvgPattern name="ndop-bamoum" size={256} />

// ── Animé avec infos et téléchargement ───────────────────────────
<SvgPattern
  name="toghu-bamileke"
  size={300}
  animated        // animation Framer Motion au survol
  showDownload    // bouton télécharger SVG
  showInfo        // overlay infos culturelles au survol
  onClick={() => setSelected('toghu-bamileke')}
/>

// ── En fond de section hero ───────────────────────────────────────
<SvgPatternHero
  name="ndop-bamoum"
  title="Ndop Bamoum"
  subtitle="Tissu sacré du Sultanat Bamoum"
  overlayOpacity={0.75}
>
  <Button>Explorer</Button>
</SvgPatternHero>

// ── Grille sélectionnable ─────────────────────────────────────────
<SvgPatternGrid
  patterns={['ndop-bamoum', 'toghu-bamileke', 'toghu-bamenda']}
  columns={3}
  animated
  showDownload
  onSelect={(key) => router.push(\`/patterns/\${key}\`)}
/>

// ── Carte téléchargeable (SVG + JSON palette) ─────────────────────
<SvgDownloadCard name="ndop-bamoum" />`}
    />

    <SectionAnchor id="svg-api">
      <h2>API SvgPattern</h2>
    </SectionAnchor>
    <PropTable
      rows={[
        ['name', 'SvgPatternKey', '—', 'Clé du motif dans SVG_REGISTRY (requis)'],
        ['size', 'number', '256', 'Taille en px (largeur = hauteur)'],
        ['asBackground', 'boolean', 'false', "Affiche comme fond CSS au lieu d'une image"],
        ['animated', 'boolean', 'false', "Active l'animation Framer Motion au survol"],
        ['showDownload', 'boolean', 'false', 'Affiche le bouton de téléchargement SVG'],
        ['showInfo', 'boolean', 'false', "Overlay d'infos culturelles au survol"],
        ['opacity', 'number', '1', 'Opacité du motif (0 à 1)'],
        ['repeat', 'boolean', 'false', 'Répétition en tile vs cover'],
        ['onClick', '() => void', '—', 'Callback au clic'],
      ]}
    />
  </div>
);

// ── Ajouter SVG ────────────────────────────────────────────────────────────────
const AddSvgPage: React.FC = () => (
  <div className="prose-avs">
    <SectionAnchor id="add-svg-title">
      <h1>Ajouter vos fichiers SVG</h1>
    </SectionAnchor>
    <p>
      Intégrez vos motifs SVG en 3 étapes. Le système supporte l&apos;affichage, les infos
      culturelles et le téléchargement automatiquement.
    </p>

    <div className="my-6 flex flex-col gap-4">
      {[
        { step: '1', title: 'Placer le fichier', desc: 'Déposez votre SVG dans public/patterns/' },
        {
          step: '2',
          title: 'Déclarer dans le registre',
          desc: 'Ajoutez une entrée dans svg-patterns.ts',
        },
        { step: '3', title: 'Utiliser partout', desc: '<SvgPattern name="votre-motif" />' },
      ].map(({ step, title, desc }) => (
        <div
          key={step}
          className="rounded-avs-lg border-avs-accent/10 flex items-center gap-4 border bg-white p-4"
        >
          <div className="bg-avs-primary text-avs-secondary font-display shadow-avs flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-black">
            {step}
          </div>
          <div>
            <p className="text-avs-accent text-sm font-semibold">{title}</p>
            <p className="text-avs-accent/40 mt-0.5 font-mono text-[10px]">{desc}</p>
          </div>
        </div>
      ))}
    </div>

    <SectionAnchor id="step1-place">
      <h2>Étape 1 — Placer les fichiers</h2>
    </SectionAnchor>
    <CodeBlock
      id="step1-code"
      lang="bash"
      code={`# Structure attendue
public/
└── patterns/
    ├── ndop-bamoum.svg       ✔ déjà présent
    ├── toghu-bamileke.svg    ✔ déjà présent
    ├── toghu-bamenda.svg     ✔ déjà présent
    └── votre-nouveau.svg     ← ajoutez ici`}
    />

    <SectionAnchor id="step2-register">
      <h2>Étape 2 — Déclarer dans le registre</h2>
    </SectionAnchor>
    <CodeBlock
      id="step2-code"
      lang="ts"
      title="src/core/utils/svg-patterns.ts"
      code={`export const SVG_REGISTRY = {
  // … existants …

  'votre-nouveau': {
    file:        '/patterns/votre-nouveau.svg',
    name:        'Nom affiché',
    origin:      'Région, Pays',
    type:        'ndop',  // kente|bogolan|adinkra|ndop|wax|berber
    region:      'central-africa',
    colors:      ['#hex1', '#hex2', '#hex3'],
    description: 'Description courte du motif et de sa signification',
    license:     'cc-by', // cc0|cc-by|cc-by-sa|proprietary
  },
};`}
    />

    <SectionAnchor id="step3-use">
      <h2>Étape 3 — Utiliser</h2>
    </SectionAnchor>
    <CodeBlock
      id="step3-code"
      lang="tsx"
      code={`// Affichage immédiat
<SvgPattern name="votre-nouveau" size={200} animated showDownload />

// Dans la page icons — apparaît automatiquement si déclaré
// Dans la page patterns/[slug] — utilise la clé comme slug
// Dans SvgPatternGrid — inclure dans le tableau patterns={[…]}`}
    />

    <Callout type="tip">
      Les SVG dans <code>public/</code> sont des ressources statiques — Next.js les sert directement
      sans transformation. Idéal pour les SVG complexes de motifs culturels.
    </Callout>
    <Callout type="warning">
      Pour des raisons de sécurité, les SVG sont chargés via <code>&lt;img&gt;</code> et non
      injectés inline. Les styles CSS internes au SVG fonctionneront, mais pas le ciblage via CSS
      externe.
    </Callout>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// DOC SECTIONS REGISTRY — add sections & pages here
// ══════════════════════════════════════════════════════════════════════════════
const DOC_SECTIONS: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Démarrage',
    icon: '🚀',
    pages: [
      {
        id: 'introduction',
        title: 'Introduction',
        toc: [
          { id: 'philosophie', level: 2, label: 'Philosophie' },
          { id: 'comparaison', level: 2, label: 'Comparaison' },
        ],
        content: IntroductionPage,
      },
      {
        id: 'installation',
        title: 'Installation',
        toc: [
          { id: 'methode-cli', level: 2, label: 'CLI' },
          { id: 'methode-npm', level: 2, label: 'npm' },
          { id: 'methode-cdn', level: 2, label: 'CDN' },
          { id: 'methode-copier', level: 2, label: 'Copy & Paste' },
          { id: 'configuration', level: 2, label: 'Tailwind config' },
          { id: 'globals', level: 2, label: 'globals.css' },
        ],
        content: InstallationPage,
      },
    ],
  },
  {
    id: 'design-system',
    title: 'Design System',
    icon: '🎨',
    pages: [
      {
        id: 'design-tokens',
        title: 'Tokens & Couleurs',
        toc: [
          { id: 'palette', level: 2, label: 'Palette' },
          { id: 'usage-tailwind', level: 2, label: 'Tailwind' },
          { id: 'css-variables', level: 2, label: 'CSS Variables' },
          { id: 'typography', level: 2, label: 'Typographie' },
        ],
        content: DesignTokensPage,
      },
      {
        id: 'css-patterns',
        title: 'Motifs CSS',
        toc: [
          { id: 'patterns-list', level: 2, label: 'Catalogue' },
          { id: 'patterns-usage', level: 2, label: 'Usages typiques' },
        ],
        content: CssPatternsPage,
      },
    ],
  },
  {
    id: 'composants',
    title: 'Composants',
    icon: '⚡',
    pages: [
      {
        id: 'button',
        title: 'Button',
        toc: [
          { id: 'btn-variantes', level: 2, label: 'Variantes' },
          { id: 'btn-tailles', level: 2, label: 'Tailles' },
          { id: 'btn-etats', level: 2, label: 'États' },
          { id: 'btn-api', level: 2, label: 'API' },
        ],
        content: ButtonPage,
      },
      {
        id: 'svg-pattern',
        title: 'SvgPattern',
        toc: [
          { id: 'svg-registry-config', level: 2, label: 'Registre' },
          { id: 'svg-usage-modes', level: 2, label: 'Usages' },
          { id: 'svg-api', level: 2, label: 'API' },
        ],
        content: SvgPatternPage,
      },
    ],
  },
  {
    id: 'svg-integration',
    title: 'Motifs SVG',
    icon: '🖼️',
    pages: [
      {
        id: 'add-svg',
        title: 'Ajouter vos SVG',
        toc: [
          { id: 'step1-place', level: 2, label: 'Étape 1 — Placer' },
          { id: 'step2-register', level: 2, label: 'Étape 2 — Registre' },
          { id: 'step3-use', level: 2, label: 'Étape 3 — Utiliser' },
        ],
        content: AddSvgPage,
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// FLATTEN PAGES for navigation
// ══════════════════════════════════════════════════════════════════════════════
const ALL_PAGES = DOC_SECTIONS.flatMap((s) => s.pages);

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function DocumentationPage() {
  const [activeId, setActiveId] = useState('introduction');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSec, setExpandedSec] = useState<string[]>(['getting-started', 'composants']);
  const contentRef = useRef<HTMLDivElement>(null);

  const activePage = ALL_PAGES.find((p) => p.id === activeId)!;
  const activeIndex = ALL_PAGES.findIndex((p) => p.id === activeId);
  const prevPage = ALL_PAGES[activeIndex - 1];
  const nextPage = ALL_PAGES[activeIndex + 1];

  const navigate = (id: string) => {
    setActiveId(id);
    setSidebarOpen(false);
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    const sec = DOC_SECTIONS.find((s) => s.pages.some((p) => p.id === id));
    if (sec && !expandedSec.includes(sec.id)) setExpandedSec((e) => [...e, sec.id]);
  };

  const filteredSections = search
    ? DOC_SECTIONS.map((s) => ({
        ...s,
        pages: s.pages.filter(
          (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.toc.some((t) => t.label.toLowerCase().includes(search.toLowerCase())),
        ),
      })).filter((s) => s.pages.length > 0)
    : DOC_SECTIONS;

  const toggleSection = (id: string) =>
    setExpandedSec((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  const ContentComponent = activePage?.content;

  return (
    <div className="bg-avs-secondary flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* ── Overlay mobile ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-avs-accent/50 fixed inset-0 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          SIDEBAR — fixed width, scrollable
      ══════════════════════════════════════════════════════════════════════ */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="border-avs-accent/10 bg-avs-secondary fixed top-16 left-0 z-40 flex h-[calc(100vh-4rem)] w-64 flex-col border-r lg:static lg:translate-x-0 lg:animate-none"
      >
        {/* Recherche */}
        <div className="border-avs-accent/10 border-b p-3">
          <div className="relative">
            <Search
              size={13}
              className="text-avs-accent/35 absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher dans la doc…"
              className="avs-input py-1.5 pr-3 pl-8 text-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-avs-accent/35 hover:text-avs-accent absolute top-1/2 right-2.5 -translate-y-1/2"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="scrollbar-thin flex-1 overflow-y-auto py-3" aria-label="Documentation">
          {filteredSections.map((section) => {
            const isExpanded = expandedSec.includes(section.id) || !!search;
            return (
              <div key={section.id} className="mb-1">
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between px-4 py-2 text-left"
                >
                  <span className="text-avs-accent/40 flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] uppercase">
                    <span>{section.icon}</span>
                    {section.title}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`text-avs-accent/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Pages */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {section.pages.map((page) => (
                        <div key={page.id}>
                          <button
                            onClick={() => navigate(page.id)}
                            className={`rounded-avs mx-2 flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-all ${activeId === page.id ? 'bg-avs-primary text-avs-secondary font-semibold' : 'text-avs-accent/65 hover:bg-avs-accent/8 hover:text-avs-accent'}`}
                            aria-current={activeId === page.id ? 'page' : undefined}
                          >
                            <ChevronRight
                              size={11}
                              className={`shrink-0 ${activeId === page.id ? 'text-avs-secondary/50' : 'text-avs-accent/25'}`}
                            />
                            {page.title}
                          </button>

                          {/* TOC sub-items — only for active page */}
                          {activeId === page.id && page.toc.length > 0 && (
                            <div className="mb-1 ml-9 space-y-0.5">
                              {page.toc
                                .filter((t) => t.level === 2)
                                .map((t) => (
                                  <a
                                    key={t.id}
                                    href={`#${t.id}`}
                                    className="text-avs-secondary/65 hover:text-avs-secondary block py-0.5 text-[11px] transition-colors"
                                  >
                                    {t.label}
                                  </a>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="border-avs-accent/10 space-y-1 border-t p-3">
          {[
            { href: 'https://github.com/avs-standard', label: 'GitHub', icon: 'Github' },
            { href: '/components', label: 'Composants', icon: Layers },
            { href: '/icons', label: 'Icônes SVG', icon: Sun },
          ].map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="rounded-avs text-avs-accent/50 hover:bg-avs-accent/8 hover:text-avs-primary flex items-center gap-2 px-3 py-1.5 text-xs transition-colors"
            >
              <Icon size={12} aria-hidden />
              {label}
              {href.startsWith('http') && <ExternalLink size={9} className="ml-auto opacity-50" />}
            </a>
          ))}
        </div>
      </motion.aside>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      <div ref={contentRef} className="scrollbar-thin flex flex-1 flex-col overflow-y-auto">
        {/* ── Topbar mobile ──────────────────────────────────────────────── */}
        <div className="border-avs-accent/10 bg-avs-secondary flex h-11 shrink-0 items-center gap-3 border-b px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-avs text-avs-accent/60 hover:bg-avs-accent/8 p-1.5"
          >
            <Menu size={18} />
          </button>
          {/* Breadcrumb */}
          <div className="text-avs-accent/45 flex items-center gap-1.5 overflow-hidden text-xs">
            <BookOpen size={11} />
            <span className="shrink-0">Docs</span>
            <ChevronRight size={10} />
            <span className="text-avs-accent truncate font-medium">{activePage?.title}</span>
          </div>
        </div>

        {/* ── Breadcrumb desktop ─────────────────────────────────────────── */}
        <div className="border-avs-accent/8 bg-avs-secondary/80 text-avs-accent/40 hidden h-10 shrink-0 items-center gap-1.5 border-b px-8 text-xs lg:flex">
          <span>Docs</span>
          <ChevronRight size={10} />
          <span className="text-avs-accent">{activePage?.title}</span>
        </div>

        {/* ── Article ─────────────────────────────────────────────────────── */}
        <div className="flex flex-1 gap-0">
          {/* Contenu principal */}
          <AnimatePresence mode="wait">
            <motion.article
              key={activeId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="min-w-0 flex-1 px-6 py-10 lg:px-10"
            >
              {/* Prose styles */}
              <style>{`
                .prose-avs h1 { font-family:var(--font-display,Georgia,serif); font-size:1.875rem; font-weight:700; color:#1D1D1B; margin-bottom:0.5rem; line-height:1.2; }
                .prose-avs h2 { font-family:var(--font-display,Georgia,serif); font-size:1.25rem; font-weight:600; color:#1D1D1B; margin:2rem 0 0.6rem; padding-bottom:0.4rem; border-bottom:1px solid rgba(29,29,27,0.08); }
                .prose-avs h3 { font-family:var(--font-display,Georgia,serif); font-size:1rem; font-weight:600; color:#1D1D1B; margin:1.25rem 0 0.4rem; }
                .prose-avs p  { color:rgba(29,29,27,0.68); line-height:1.75; margin-bottom:0.875rem; font-size:0.9375rem; }
                .prose-avs ul { list-style:disc; padding-left:1.5rem; color:rgba(29,29,27,0.65); margin-bottom:0.875rem; }
                .prose-avs ol { list-style:decimal; padding-left:1.5rem; color:rgba(29,29,27,0.65); margin-bottom:0.875rem; }
                .prose-avs li { margin-bottom:0.35rem; font-size:0.9375rem; line-height:1.65; }
                .prose-avs a  { color:#C0573E; text-decoration:underline; text-underline-offset:3px; }
                .prose-avs a:hover { opacity:0.8; }
                .prose-avs code { font-family:var(--font-mono,monospace); font-size:0.82em; background:rgba(29,29,27,0.07); padding:0.15em 0.45em; border-radius:0.25rem; color:#C0573E; }
                .prose-avs strong { font-weight:700; color:#1D1D1B; }
                .prose-avs hr { border:none; border-top:1px solid rgba(29,29,27,0.1); margin:2rem 0; }
              `}</style>

              <Suspense
                fallback={
                  <div className="flex h-48 items-center justify-center">
                    <div className="avs-pattern-kente animate-avs-spin h-10 w-10 rounded-full opacity-50" />
                  </div>
                }
              >
                {ContentComponent && <ContentComponent />}
              </Suspense>

              {/* ── Navigation prev / next ──────────────────────────────── */}
              <div className="border-avs-accent/10 mt-14 flex items-center justify-between gap-4 border-t pt-8">
                {prevPage ? (
                  <button
                    onClick={() => navigate(prevPage.id)}
                    className="group rounded-avs-lg border-avs-accent/15 text-avs-accent/60 hover:border-avs-primary hover:text-avs-primary flex max-w-[45%] items-center gap-2 border px-4 py-3 text-sm font-semibold transition-all"
                  >
                    <ArrowLeft size={14} className="shrink-0" />
                    <span className="truncate">{prevPage.title}</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextPage && (
                  <button
                    onClick={() => navigate(nextPage.id)}
                    className="group rounded-avs-lg border-avs-accent/15 text-avs-accent/60 hover:border-avs-primary hover:text-avs-primary ml-auto flex max-w-[45%] items-center gap-2 border px-4 py-3 text-sm font-semibold transition-all"
                  >
                    <span className="truncate">{nextPage.title}</span>
                    <ArrowRight size={14} className="shrink-0" />
                  </button>
                )}
              </div>

              {/* Dernière modification */}
              <p className="text-avs-accent/25 mt-6 text-center text-[10px]">
                AVS Documentation · v1.0.0 · Mis à jour avril 2026
              </p>
            </motion.article>
          </AnimatePresence>

          {/* ── Table des matières droite ────────────────────────────────── */}
          {activePage?.toc && activePage.toc.length > 0 && (
            <aside className="hidden w-52 shrink-0 xl:block">
              <div className="sticky top-4 pt-10 pr-6">
                <p className="text-avs-accent/35 mb-3 text-[10px] font-bold tracking-[0.15em] uppercase">
                  Sur cette page
                </p>
                <nav aria-label="Table des matières">
                  {activePage.toc.map(({ id, label, level }) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      className={`text-avs-accent/50 hover:text-avs-primary block py-1 text-xs leading-snug transition-colors ${level === 3 ? 'pl-3' : ''}`}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
                <div className="border-avs-accent/8 mt-6 space-y-2 border-t pt-4">
                  <a
                    href="https://github.com/avs-standard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-avs-accent/35 hover:text-avs-primary flex items-center gap-1.5 text-[10px] transition-colors"
                  >
                    {/* <Github size={11}/> Voir sur GitHub */}
                  </a>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
