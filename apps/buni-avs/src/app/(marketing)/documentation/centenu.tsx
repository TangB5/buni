'use client';

import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════
interface TocEntry { id: string; label: string; level: 1 | 2 | 3 }
interface DocPage { id: string; title: string; content: React.FC; toc: TocEntry[] }
interface DocSection { id: string; title: string; icon: React.ReactNode; pages: DocPage[] }

// ══════════════════════════════════════════════════════════════════════════════
// HOOKS
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

function useActiveHeading(toc: TocEntry[]) {
  const [activeId, setActiveId] = useState<string>('');
  useEffect(() => {
    if (!toc.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-10% 0% -80% 0%' },
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [toc]);
  return activeId;
}

// ══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS (replicated as CSS vars so dark mode works)
// ══════════════════════════════════════════════════════════════════════════════
const GLOBAL_STYLES = `
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

  :root {
    --doc-bg:          #f8f6f2;
    --doc-surface:     #ffffff;
    --doc-sidebar:     #faf8f5;
    --doc-border:      rgba(29,29,27,0.09);
    --doc-border-md:   rgba(29,29,27,0.14);
    --doc-text:        #1D1D1B;
    --doc-muted:       rgba(29,29,27,0.52);
    --doc-hint:        rgba(29,29,27,0.32);
    --doc-primary:     #C0573E;
    --doc-primary-10:  rgba(192,87,62,0.10);
    --doc-primary-20:  rgba(192,87,62,0.20);
    --doc-code-bg:     #141412;
    --doc-code-header: #1a1a18;
    --doc-code-text:   #d4d0c8;
    --doc-indigo:      #2A4A6B;
    --doc-ndop:        #4A6741;
    --doc-kente:       #D4A017;
    --skeleton-from:   rgb(235 232 228);
    --skeleton-mid:    rgb(244 242 238);
  }
  .dark {
    --doc-bg:          #111110;
    --doc-surface:     #1a1917;
    --doc-sidebar:     #141412;
    --doc-border:      rgba(255,255,255,0.07);
    --doc-border-md:   rgba(255,255,255,0.12);
    --doc-text:        #ece8e1;
    --doc-muted:       rgba(236,232,225,0.50);
    --doc-hint:        rgba(236,232,225,0.30);
    --doc-primary:     #d4694e;
    --doc-primary-10:  rgba(212,105,78,0.12);
    --doc-primary-20:  rgba(212,105,78,0.22);
    --doc-code-bg:     #0d0c0b;
    --doc-code-header: #161513;
    --doc-code-text:   #c9c5bc;
    --doc-indigo:      #5b82a8;
    --doc-ndop:        #7aa66e;
    --doc-kente:       #ddb030;
    --skeleton-from:   rgb(30 28 26);
    --skeleton-mid:    rgb(42 40 37);
  }

  /* Prose */
  .avs-prose h1 { font-family:var(--font-display,Georgia,serif); font-size:1.875rem; font-weight:800; color:var(--doc-text); margin-bottom:0.5rem; line-height:1.15; letter-spacing:-0.02em; }
  .avs-prose h2 { font-family:var(--font-display,Georgia,serif); font-size:1.2rem; font-weight:700; color:var(--doc-text); margin:2.25rem 0 0.65rem; padding-bottom:0.45rem; border-bottom:1px solid var(--doc-border); letter-spacing:-0.01em; }
  .avs-prose h3 { font-family:var(--font-display,Georgia,serif); font-size:1rem; font-weight:700; color:var(--doc-text); margin:1.5rem 0 0.4rem; }
  .avs-prose p  { color:var(--doc-muted); line-height:1.8; margin-bottom:0.9rem; font-size:0.9375rem; }
  .avs-prose ul { list-style:disc; padding-left:1.5rem; color:var(--doc-muted); margin-bottom:0.875rem; }
  .avs-prose ol { list-style:decimal; padding-left:1.5rem; color:var(--doc-muted); margin-bottom:0.875rem; }
  .avs-prose li { margin-bottom:0.35rem; font-size:0.9375rem; line-height:1.7; }
  .avs-prose a  { color:var(--doc-primary); text-decoration:underline; text-underline-offset:3px; }
  .avs-prose a:hover { opacity:0.75; }
  .avs-prose code { font-family:var(--font-mono,monospace); font-size:0.8em; background:var(--doc-primary-10); padding:0.15em 0.45em; border-radius:0.3rem; color:var(--doc-primary); border:1px solid var(--doc-primary-20); }
  .avs-prose strong { font-weight:700; color:var(--doc-text); }
  .avs-prose hr { border:none; border-top:1px solid var(--doc-border); margin:2.25rem 0; }

  /* Scrollbar */
  .doc-scroll::-webkit-scrollbar { width:4px; height:4px; }
  .doc-scroll::-webkit-scrollbar-track { background:transparent; }
  .doc-scroll::-webkit-scrollbar-thumb { background:var(--doc-border-md); border-radius:2px; }
`;

// ══════════════════════════════════════════════════════════════════════════════
// SHARED MICRO-COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function CodeBlock({ code, lang = 'tsx', id, title }: { code: string; lang?: string; id: string; title?: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="group my-5 overflow-hidden rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: 'var(--doc-code-header)' }}>
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="font-mono text-[10px] text-white/30 tracking-widest">
            {title ?? lang.toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => void copy(code, id)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[10px] font-semibold text-white/35 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white/10 hover:text-white/70"
        >
          {copied === id
            ? <><i className="pi pi-check" style={{ fontSize: '10px', color: '#34d399' }} /> Copié</>
            : <><i className="pi pi-copy" style={{ fontSize: '10px' }} /> Copier</>}
        </button>
      </div>

      {/* Code body */}
      <pre
        className="doc-scroll overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.8]"
        style={{ background: 'var(--doc-code-bg)', color: 'var(--doc-code-text)' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Callout({ type = 'info', title, children }: { type?: 'info' | 'tip' | 'warning' | 'danger'; title?: string; children: React.ReactNode }) {
  const conf = {
    info:    { bg: 'rgba(42,74,107,0.08)', border: 'var(--doc-indigo)', icon: 'pi-info-circle',         tc: 'var(--doc-indigo)',  label: title ?? 'Info' },
    tip:     { bg: 'rgba(74,103,65,0.08)', border: 'var(--doc-ndop)',   icon: 'pi-lightbulb',    tc: 'var(--doc-ndop)',   label: title ?? 'Astuce' },
    warning: { bg: 'rgba(212,160,23,0.08)', border: 'var(--doc-kente)', icon: 'pi-exclamation-triangle',  tc: 'var(--doc-kente)',  label: title ?? 'Attention' },
    danger:  { bg: 'rgba(192,87,62,0.09)', border: 'var(--doc-primary)', icon: 'pi-exclamation-triangle', tc: 'var(--doc-primary)', label: title ?? 'Important' },
  }[type];
  return (
    <div
      className="my-5 flex gap-3.5 rounded-r-xl px-4 py-4"
      style={{ background: conf.bg, borderLeft: `3px solid ${conf.border}`, border: `1px solid ${conf.border}33`, borderLeftWidth: 3 }}
    >
      <i className={`pi ${conf.icon} mt-0.5 shrink-0`} style={{ fontSize: '15px', color: conf.tc }} aria-hidden />
      <div>
        <p className="mb-1.5 text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: conf.tc }}>{conf.label}</p>
        <div className="text-sm leading-relaxed" style={{ color: 'var(--doc-muted)' }}>{children}</div>
      </div>
    </div>
  );
}

function PropTable({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <div className="my-5 overflow-x-auto rounded-xl" style={{ border: '1px solid var(--doc-border)' }}>
      <table className="w-full min-w-[560px] text-xs">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--doc-border)', background: 'var(--doc-primary-10)' }}>
            {['Prop', 'Type', 'Défaut', 'Description'].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left font-bold tracking-wider uppercase" style={{ color: 'var(--doc-hint)', fontSize: '9px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([prop, type, def, desc], i) => (
            <tr key={prop} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--doc-border)' : 'none' }}
              className="transition-colors hover:bg-[var(--doc-primary-10)]">
              <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--doc-primary)' }}>{prop}</td>
              <td className="px-4 py-3 font-mono text-[11px]" style={{ color: 'var(--doc-indigo)' }}>{type}</td>
              <td className="px-4 py-3 font-mono text-[11px]" style={{ color: 'var(--doc-hint)' }}>{def}</td>
              <td className="px-4 py-3 text-[12px] leading-snug" style={{ color: 'var(--doc-muted)' }}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LiveDemo({ children, label = 'Démonstration live' }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="my-5 overflow-hidden rounded-xl" style={{ border: '1px solid var(--doc-border)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'var(--doc-primary-10)', borderBottom: '1px solid var(--doc-border)' }}>
        <span className="h-2 w-2 rounded-full bg-avs-primary" style={{ background: 'var(--doc-primary)' }} aria-hidden />
        <span className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: 'var(--doc-hint)' }}>{label}</span>
      </div>
      <div
        className="p-8"
        style={{
          background: 'var(--doc-surface)',
          backgroundImage: 'radial-gradient(circle, var(--doc-border) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SectionAnchor({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={id} className="group flex scroll-mt-28 items-center gap-2">
      {children}
      <a
        href={`#${id}`}
        className="opacity-0 transition-opacity group-hover:opacity-100"
        style={{ color: 'var(--doc-hint)' }}
        aria-label={`Lien vers ${id}`}
      >
        <i className="pi pi-hashtag" style={{ fontSize: '13px' }} />
      </a>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE CONTENTS
// ══════════════════════════════════════════════════════════════════════════════

const IntroductionPage: React.FC = () => (
  <div className="avs-prose">
    {/* Hero banner */}
    <div className="avs-pattern-ndop-royal relative mb-8 overflow-hidden rounded-2xl">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.96) 0%, rgba(29,20,8,0.88) 100%)' }} />
      <div className="relative px-8 py-10">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] uppercase font-bold" style={{ background: 'rgba(192,87,62,0.2)', color: '#C0573E', border: '1px solid rgba(192,87,62,0.3)' }}>
            <i className="pi pi-sparkles" style={{ fontSize: '8px' }} /> v1.0 · Open Standard
          </span>
        </div>
        <h1 className="font-display text-3xl font-black leading-tight" style={{ color: '#f5ebe0', letterSpacing: '-0.02em' }}>
          AVS — African Visual Standard
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed" style={{ color: 'rgba(245,235,224,0.60)' }}>
          Bibliothèque de composants UI open-source construite avec React, Radix UI et Tailwind CSS.
          Inspirée du patrimoine visuel africain. Aucun compte requis.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {['React 18+', 'Next.js 14+', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Framer Motion'].map((t) => (
            <span key={t} className="rounded-lg px-2.5 py-1 font-mono text-[10px] font-semibold" style={{ background: 'rgba(245,235,224,0.08)', color: 'rgba(245,235,224,0.55)', border: '1px solid rgba(245,235,224,0.10)' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>

    <SectionAnchor id="philosophie"><h2>Philosophie</h2></SectionAnchor>
    <p>AVS adopte l&apos;approche <strong>Copy &amp; Paste</strong> popularisée par Shadcn/UI : vous copiez les composants dans votre projet, ils vous appartiennent entièrement. Pas de dépendance opaque, pas de lock-in.</p>

    <div className="my-6 grid gap-3 sm:grid-cols-2">
      {[
        { icon: 'pi-globe', title: 'Culturellement ancré', desc: 'Chaque token de couleur, motif et composant est documenté avec sa source primaire africaine.' },
        { icon: 'pi-unlock', title: 'Public par défaut', desc: 'Composants, motifs, templates — tout est accessible sans authentification.' },
        { icon: 'pi-bolt', title: 'Copy & Paste', desc: 'Vous possédez votre code. Aucune dépendance lourde. Adaptez, étendez, supprimez.' },
        { icon: 'pi-palette', title: 'Design System cohérent', desc: 'Palette extraite de pigments naturels africains, tokens CSS, motifs CSS pur.' },
      ].map(({ icon, title, desc }) => (
        <div key={title} className="rounded-xl p-5 transition-colors" style={{ border: '1px solid var(--doc-border)', background: 'var(--doc-surface)' }}>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: 'var(--doc-primary-10)', color: 'var(--doc-primary)' }}>
            <i className={`pi ${icon}`} style={{ fontSize: '18px' }} />
          </div>
          <h3 className="mb-1 text-sm font-bold" style={{ color: 'var(--doc-text)', fontFamily: 'var(--font-display, Georgia, serif)' }}>{title}</h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--doc-hint)', marginBottom: 0 }}>{desc}</p>
        </div>
      ))}
    </div>

    <SectionAnchor id="comparaison"><h2>Comparaison avec PrimeReact</h2></SectionAnchor>
    <div className="my-4 overflow-x-auto rounded-xl" style={{ border: '1px solid var(--doc-border)' }}>
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--doc-border)', background: 'var(--doc-primary-10)' }}>
            {['Fonctionnalité', 'AVS', 'PrimeReact', 'Shadcn'].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left font-bold tracking-wider uppercase" style={{ color: 'var(--doc-hint)', fontSize: '9px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ['Accès sans compte', 'check', 'check', 'check'],
            ['Copy & Paste', 'check', 'times', 'check'],
            ['Design africain', 'check', 'times', 'times'],
            ['SVG natifs', 'check', 'exclamation-triangle', 'times'],
            ['Motifs CSS', 'check', 'times', 'times'],
            ['Radix UI', 'check', 'times', 'check'],
            ['TypeScript strict', 'check', 'check', 'check'],
          ].map(([feat, ...vals], i, arr) => (
            <tr key={feat} className="transition-colors hover:bg-[var(--doc-primary-10)]" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--doc-border)' : 'none' }}>
              <td className="px-4 py-2.5 font-semibold" style={{ color: 'var(--doc-text)' }}>{feat}</td>
              {vals.map((v, vi) => (
                <td key={vi} className="px-4 py-2.5 text-center">
                  {v === 'check' && <i className="pi pi-check text-emerald-500" style={{ fontSize: '12px' }} />}
                  {v === 'times' && <i className="pi pi-times text-red-500" style={{ fontSize: '12px' }} />}
                  {v === 'exclamation-triangle' && <i className="pi pi-exclamation-triangle text-amber-500" style={{ fontSize: '12px' }} />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Callout type="tip" title="Bonne pratique">
      Commencez par lire la section Installation, puis explorez les{' '}
      <a href="/components">Composants</a> qui proposent des previews live interactives.
    </Callout>
  </div>
);

const InstallationPage: React.FC = () => {
  const [pkgMgr, setPkgMgr] = useState<'npm' | 'pnpm' | 'yarn'>('npm');
  const cmds = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add' };

  return (
    <div className="avs-prose">
      <SectionAnchor id="installation"><h1>Installation</h1></SectionAnchor>
      <p>Plusieurs méthodes pour intégrer AVS dans votre projet. La méthode CLI est recommandée pour démarrer rapidement.</p>

      <SectionAnchor id="methode-cli"><h2>Méthode 1 — CLI (recommandé)</h2></SectionAnchor>
      <CodeBlock id="cli-init" lang="bash" title="Terminal" code={`# Initialiser AVS dans un projet Next.js existant
npx @avs/cli init

# Répondre aux questions :
# ✔ Chemin src/ ? › src
# ✔ Alias import ? › @/*
# ✔ Ajouter les motifs CSS ? › Oui
# ✔ Ajouter le design system complet ? › Oui`} />
      <CodeBlock id="cli-add" lang="bash" title="Terminal" code={`# Ajouter des composants individuellement
npx @avs/cli add button
npx @avs/cli add badge
npx @avs/cli add pattern-card

# Lister tous les composants disponibles
npx @avs/cli list`} />

      <SectionAnchor id="methode-npm"><h2>Méthode 2 — Package npm</h2></SectionAnchor>
      {/* Package manager selector */}
      <div className="mb-2 flex w-fit items-center gap-0.5 rounded-xl p-1" style={{ border: '1px solid var(--doc-border)', background: 'var(--doc-surface)' }}>
        {(['npm', 'pnpm', 'yarn'] as const).map((m) => (
          <button key={m} onClick={() => setPkgMgr(m)}
            className="rounded-lg px-3.5 py-1.5 font-mono text-xs font-bold transition-all duration-200"
            style={pkgMgr === m
              ? { background: 'var(--doc-primary)', color: '#fff' }
              : { color: 'var(--doc-hint)' }
            }
          >{m}</button>
        ))}
      </div>
      <CodeBlock id="npm-install" lang="bash" title="Terminal" code={`${cmds[pkgMgr]} @avs/ui @avs/icons
${cmds[pkgMgr]} @radix-ui/react-slot @radix-ui/react-dialog
${cmds[pkgMgr]} framer-motion clsx tailwind-merge class-variance-authority`} />

      <SectionAnchor id="methode-cdn"><h2>Méthode 3 — CDN (HTML pur)</h2></SectionAnchor>
      <CodeBlock id="cdn" lang="html" title="index.html" code={`<!DOCTYPE html>
<html lang="fr">
<head>
  <link rel="stylesheet" href="https://cdn.avs-standard.com/ui/latest/avs-ui.min.css" />
</head>
<body>
  <avs-button variant="primary">Cliquez ici</avs-button>
  <img src="https://cdn.avs-standard.com/icons/v1/ndop-bamoum.svg"
       alt="Ndop Bamoum" width="64" height="64" />
  <script src="https://cdn.avs-standard.com/ui/latest/avs-ui.min.js"></script>
</body>
</html>`} />

      <SectionAnchor id="configuration"><h2>Configuration Tailwind</h2></SectionAnchor>
      <CodeBlock id="tailwind-config" lang="ts" title="tailwind.config.ts" code={`import type { Config } from 'tailwindcss';

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
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
    },
  },
};
export default config;`} />

      <SectionAnchor id="globals"><h2>globals.css</h2></SectionAnchor>
      <CodeBlock id="globals" lang="css" title="src/app/globals.css" code={`@tailwind base;
@tailwind components;
@tailwind utilities;

@import '../theme/tokens/avs-tokens.css';
@import '../theme/patterns/patterns.css';

@layer components {
  .avs-btn-primary {
    @apply inline-flex items-center justify-center gap-2 rounded-xl
           bg-avs-primary px-5 py-2.5 text-sm font-bold text-white
           shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all;
  }
}`} />
    </div>
  );
};

const DesignTokensPage: React.FC = () => {
  const { copied, copy } = useCopy();
  const palette = [
    { name: 'avs-primary', hex: '#C0573E', label: 'Terre brûlée', origin: 'Poterie Yoruba', dark: false },
    { name: 'avs-secondary', hex: '#F5EBE0', label: 'Lin naturel', origin: 'Tissu Fulani', dark: false },
    { name: 'avs-accent', hex: '#1D1D1B', label: 'Obsidienne', origin: 'Basalte Kenya', dark: true },
    { name: 'avs-kente', hex: '#D4A017', label: 'Or kente', origin: 'Fil soie Asante', dark: false },
    { name: 'avs-ndop', hex: '#4A6741', label: 'Vert Bamiléké', origin: 'Plantes indigo', dark: true },
    { name: 'avs-indigo', hex: '#2A4A6B', label: 'Bleu bogolan', origin: 'Teinture Bambara', dark: true },
    { name: 'avs-earth', hex: '#8B4513', label: 'Ocre savane', origin: 'Argile du Sahel', dark: true },
    { name: 'avs-raffia', hex: '#C8A96E', label: 'Raphia naturel', origin: 'Fibre de palmier', dark: false },
  ];

  return (
    <div className="avs-prose">
      <SectionAnchor id="tokens"><h1>Design Tokens</h1></SectionAnchor>
      <p>La palette AVS est extraite de pigments naturels africains. Chaque couleur est documentée avec sa source ethnographique primaire. Cliquez sur un swatch pour copier le HEX.</p>

      <SectionAnchor id="palette"><h2>Palette principale</h2></SectionAnchor>
      <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {palette.map(({ name, hex, label, origin, dark }) => (
          <button key={name} onClick={() => void copy(hex, name)}
            className="group overflow-hidden rounded-xl text-left transition-all duration-300 hover:-translate-y-1"
            style={{ border: '1px solid var(--doc-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <div className="relative h-16" style={{ background: hex }}>
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-[10px] font-bold text-white drop-shadow">
                  {copied === name ? '✓ Copié !' : 'Copier HEX'}
                </span>
              </div>
            </div>
            <div className="p-2.5" style={{ background: 'var(--doc-surface)' }}>
              <p className="font-mono text-[9px]" style={{ color: 'var(--doc-hint)' }}>{hex}</p>
              <p className="mt-0.5 text-[11px] font-bold" style={{ color: 'var(--doc-text)' }}>{label}</p>
              <p className="mt-0.5 font-mono text-[8px]" style={{ color: 'var(--doc-hint)' }}>{name}</p>
              <p className="mt-0.5 text-[8px] italic" style={{ color: 'var(--doc-hint)', opacity: 0.7 }}>{origin}</p>
            </div>
          </button>
        ))}
      </div>

      <SectionAnchor id="css-variables"><h2>CSS Custom Properties</h2></SectionAnchor>
      <CodeBlock id="css-vars" lang="css" title="avs-tokens.css" code={`:root {
  --avs-primary:   #C0573E;
  --avs-secondary: #F5EBE0;
  --avs-accent:    #1D1D1B;
  --avs-kente:     #D4A017;
  --avs-ndop:      #4A6741;
  --avs-indigo:    #2A4A6B;
  --avs-earth:     #8B4513;
  --avs-raffia:    #C8A96E;

  --shadow-avs:    3px 3px 0px 0px var(--avs-accent);
  --shadow-avs-md: 5px 5px 0px 0px var(--avs-primary);
  --radius-avs:    0.375rem;
  --radius-avs-lg: 1.25rem;
  --transition:    250ms cubic-bezier(0.4, 0, 0.2, 1);
}`} />

      <SectionAnchor id="typography"><h2>Typographie</h2></SectionAnchor>
      <LiveDemo label="Échelle typographique">
        <div className="space-y-4">
          <p className="font-display text-4xl font-black leading-none" style={{ color: 'var(--doc-text)', letterSpacing: '-0.02em', fontFamily: 'var(--font-display, Georgia, serif)' }}>Display — Playfair Display</p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--doc-muted)' }}>Body — DM Sans · Texte courant et interfaces</p>
          <p className="font-mono text-sm" style={{ color: 'var(--doc-hint)' }}>Mono — JetBrains Mono · Code et tokens</p>
        </div>
      </LiveDemo>
    </div>
  );
};

const CssPatternsPage: React.FC = () => (
  <div className="avs-prose">
    <SectionAnchor id="patterns"><h1>Motifs CSS</h1></SectionAnchor>
    <p>Des motifs africains générés entièrement en CSS — sans image, sans SVG. Utilisation instantanée via <code>className</code>.</p>

    <SectionAnchor id="patterns-list"><h2>Catalogue</h2></SectionAnchor>
    <div className="my-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[
        { cls: 'avs-pattern-kente-royale', label: 'Kente', origin: 'Akan, Ghana', desc: 'Bandelettes entrelacées' },
        { cls: 'avs-pattern-ndop-sultan', label: 'Ndop', origin: 'Bamoum, Cameroun', desc: 'Grille et cercles rituels' },
        { cls: 'avs-pattern-bogolan-fanga', label: 'Bogolan', origin: 'Bambara, Mali', desc: 'Teintures à la boue' },
        { cls: 'avs-pattern-wax-dakar', label: 'Wax', origin: 'Pan-africain', desc: 'Losanges et points' },
        { cls: 'avs-pattern-adinkra-sankofa', label: 'Adinkra', origin: 'Asante, Ghana', desc: 'Symboles philosophiques' },
        { cls: 'avs-pattern-kuba-kasai', label: 'Kuba', origin: 'Kasaï, Congo', desc: 'Géométrie entrelacée' },
      ].map(({ cls, label, origin, desc }) => (
        <div key={cls} className="overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ border: '1px solid var(--doc-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className={`${cls} h-20`} />
          <div className="p-3" style={{ background: 'var(--doc-surface)' }}>
            <p className="text-sm font-bold" style={{ color: 'var(--doc-text)', fontFamily: 'var(--font-display, Georgia, serif)' }}>{label}</p>
            <p className="mt-0.5 text-[10px] font-semibold" style={{ color: 'var(--doc-primary)' }}>{origin}</p>
            <p className="mt-0.5 text-[10px]" style={{ color: 'var(--doc-hint)' }}>{desc}</p>
            <p className="mt-1 font-mono text-[9px]" style={{ color: 'var(--doc-hint)', opacity: 0.6 }}>.{cls}</p>
          </div>
        </div>
      ))}
    </div>

    <SectionAnchor id="patterns-usage"><h2>Usages typiques</h2></SectionAnchor>
    <LiveDemo label="Applications des motifs">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="avs-pattern-ndop-sultan relative overflow-hidden rounded-xl">
          <div className="absolute inset-0" style={{ background: 'rgba(10,8,6,0.78)' }} />
          <div className="relative p-4 text-center">
            <p className="text-xs font-bold" style={{ color: 'rgba(245,235,224,0.85)' }}>Section Hero</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="avs-pattern-kente-royale relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ring-2 ring-white dark:ring-zinc-800">
            <span className="font-display text-lg font-black text-white drop-shadow-md relative z-10">A</span>
            <div className="absolute inset-0 bg-black/25" />
          </div>
          <span className="text-xs" style={{ color: 'var(--doc-muted)' }}>Avatar</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="avs-pattern-kente-royale h-10 w-10 animate-spin rounded-full opacity-75" style={{ animationDuration: '2s' }} />
          <span className="text-xs" style={{ color: 'var(--doc-muted)' }}>Spinner</span>
        </div>
      </div>
    </LiveDemo>

    <CodeBlock id="patterns-code" lang="tsx" code={`// Fond de section hero
<section className="avs-pattern-ndop-sultan relative min-h-screen">
  <div className="absolute inset-0 bg-avs-accent/80" />
  <div className="relative">{/* contenu */}</div>
</section>

// Avatar circulaire avec initiale
<div className="avs-pattern-kente-royale h-10 w-10 rounded-full ring-2 ring-white">
  <span className="font-display font-black text-white drop-shadow">A</span>
</div>

// Spinner animé
<div className="avs-pattern-kente-royale h-10 w-10 animate-spin rounded-full" />

// Bande décorative en tête de card
<div className="rounded-2xl overflow-hidden">
  <div className="avs-pattern-ndop-sultan h-1 w-full" />
  <div className="p-5">{/* contenu */}</div>
</div>`} />

    <Callout type="info">
      Les motifs CSS utilisent des <code>linear-gradient</code> et <code>radial-gradient</code> imbriqués,
      définis dans <code>src/theme/patterns/patterns.css</code>.
    </Callout>
  </div>
);

const ButtonPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="avs-prose">
      <SectionAnchor id="button"><h1>Button</h1></SectionAnchor>
      <p>Composant bouton multi-variantes basé sur <strong>CVA</strong> et <strong>Radix Slot</strong>. Supporte le polymorphisme via <code>asChild</code>.</p>

      <SectionAnchor id="btn-import"><h2>Import</h2></SectionAnchor>
      <CodeBlock id="btn-import-code" lang="tsx" code={`import { Button } from '@/components/ui';
// ou
import { Button } from '@avs/ui';`} />

      <SectionAnchor id="btn-variantes"><h2>Variantes</h2></SectionAnchor>
      <LiveDemo>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { v: 'Primaire',   cls: 'bg-avs-primary text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md' },
            { v: 'Secondaire', cls: 'border-2 border-avs-accent/20 text-avs-accent hover:border-avs-primary hover:text-avs-primary' },
            { v: 'Ghost',      cls: 'text-avs-primary hover:bg-avs-primary/10' },
            { v: 'Kente',      cls: 'bg-avs-kente text-avs-accent font-black shadow-sm hover:-translate-y-0.5' },
            { v: 'Danger',     cls: 'bg-red-600 text-white shadow-sm hover:-translate-y-0.5' },
          ].map(({ v, cls }) => (
            <button key={v} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${cls}`}>{v}</button>
          ))}
        </div>
      </LiveDemo>
      <CodeBlock id="btn-variants-code" lang="tsx" code={`<Button variant="primary">Primaire</Button>
<Button variant="secondary">Secondaire</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="kente">Kente</Button>
<Button variant="danger">Danger</Button>`} />

      <SectionAnchor id="btn-etats"><h2>États interactifs</h2></SectionAnchor>
      <LiveDemo label="États">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-avs-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <><span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Chargement…</>
            ) : 'Cliquer pour charger'}
          </button>
          <button disabled className="cursor-not-allowed rounded-xl border border-avs-accent/20 px-4 py-2 text-xs font-bold text-avs-accent/40">Désactivé</button>
        </div>
      </LiveDemo>

      <SectionAnchor id="btn-api"><h2>API de référence</h2></SectionAnchor>
      <PropTable rows={[
        ['variant', 'primary | secondary | ghost | kente | danger', 'primary', 'Style visuel du bouton'],
        ['size', 'xs | sm | md | lg | icon', 'md', 'Taille du bouton'],
        ['isLoading', 'boolean', 'false', 'Affiche un spinner à la place du contenu'],
        ['disabled', 'boolean', 'false', 'Désactive toutes les interactions'],
        ['asChild', 'boolean', 'false', "Délègue le rendu à l'enfant (Radix Slot)"],
        ['leftIcon', 'ReactNode', '—', 'Icône affichée à gauche du texte'],
        ['rightIcon', 'ReactNode', '—', 'Icône affichée à droite du texte'],
        ['className', 'string', '—', 'Classes CSS additionnelles'],
      ]} />

      <Callout type="tip">
        Pour les liens de navigation, utilisez toujours <code>asChild</code> avec <code>Link</code> de Next.js
        plutôt que <code>href</code> directement, pour bénéficier du prefetching.
      </Callout>
    </div>
  );
};

const SvgPatternPage: React.FC = () => (
  <div className="avs-prose">
    <SectionAnchor id="svg-pattern-comp"><h1>SvgPattern</h1></SectionAnchor>
    <p>Composant unifié pour afficher, animer et télécharger vos fichiers SVG depuis <code>public/patterns/</code>.</p>

    <Callout type="info">
      Vos 3 SVG existants (<code>ndop-bamoum.svg</code>, <code>toghu-bamileke.svg</code>, <code>toghu-bamenda.svg</code>) sont déjà dans <code>public/patterns/</code>. Déclarez-les dans <code>svg-patterns.ts</code> pour les utiliser.
    </Callout>

    <SectionAnchor id="svg-registry-config"><h2>1 — Déclarer dans le registre</h2></SectionAnchor>
    <CodeBlock id="svg-reg" lang="ts" title="src/core/utils/svg-patterns.ts" code={`export const SVG_REGISTRY = {
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
  // … autres motifs
};`} />

    <SectionAnchor id="svg-usage-modes"><h2>2 — Usages</h2></SectionAnchor>
    <CodeBlock id="svg-use" lang="tsx" code={`import { SvgPattern, SvgPatternHero, SvgPatternGrid }
  from '@/components/ui/SvgPattern';

// Affichage simple
<SvgPattern name="ndop-bamoum" size={256} />

// Animé avec infos et téléchargement
<SvgPattern
  name="toghu-bamileke"
  size={300}
  animated showDownload showInfo
  onClick={() => setSelected('toghu-bamileke')}
/>

// Grille sélectionnable
<SvgPatternGrid
  patterns={['ndop-bamoum', 'toghu-bamileke', 'toghu-bamenda']}
  columns={3} animated showDownload
  onSelect={(key) => router.push(\`/patterns/\${key}\`)}
/>`} />

    <SectionAnchor id="svg-api"><h2>API SvgPattern</h2></SectionAnchor>
    <PropTable rows={[
      ['name', 'SvgPatternKey', '—', 'Clé du motif dans SVG_REGISTRY (requis)'],
      ['size', 'number', '256', 'Taille en px (largeur = hauteur)'],
      ['animated', 'boolean', 'false', "Active l'animation Framer Motion au survol"],
      ['showDownload', 'boolean', 'false', 'Affiche le bouton de téléchargement SVG'],
      ['showInfo', 'boolean', 'false', "Overlay d'infos culturelles au survol"],
      ['opacity', 'number', '1', 'Opacité du motif (0 à 1)'],
      ['onClick', '() => void', '—', 'Callback au clic'],
    ]} />
  </div>
);

const AddSvgPage: React.FC = () => (
  <div className="avs-prose">
    <SectionAnchor id="add-svg-title"><h1>Ajouter vos fichiers SVG</h1></SectionAnchor>
    <p>Intégrez vos motifs SVG en 3 étapes. Le système supporte l&apos;affichage, les infos culturelles et le téléchargement automatiquement.</p>

    <div className="my-6 flex flex-col gap-3">
      {[
        { step: '1', title: 'Placer le fichier', desc: 'Déposez votre SVG dans public/patterns/' },
        { step: '2', title: 'Déclarer dans le registre', desc: 'Ajoutez une entrée dans svg-patterns.ts' },
        { step: '3', title: 'Utiliser partout', desc: '<SvgPattern name="votre-motif" />' },
      ].map(({ step, title, desc }) => (
        <div key={step} className="flex items-center gap-4 rounded-xl p-4 transition-colors" style={{ border: '1px solid var(--doc-border)', background: 'var(--doc-surface)' }}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-black text-white shadow-sm" style={{ background: 'var(--doc-primary)' }}>{step}</div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--doc-text)' }}>{title}</p>
            <p className="mt-0.5 font-mono text-[10px]" style={{ color: 'var(--doc-hint)' }}>{desc}</p>
          </div>
        </div>
      ))}
    </div>

    <SectionAnchor id="step1-place"><h2>Étape 1 — Placer les fichiers</h2></SectionAnchor>
    <CodeBlock id="step1-code" lang="bash" code={`public/
└── patterns/
    ├── ndop-bamoum.svg       ✔ déjà présent
    ├── toghu-bamileke.svg    ✔ déjà présent
    ├── toghu-bamenda.svg     ✔ déjà présent
    └── votre-nouveau.svg     ← ajoutez ici`} />

    <SectionAnchor id="step2-register"><h2>Étape 2 — Déclarer dans le registre</h2></SectionAnchor>
    <CodeBlock id="step2-code" lang="ts" title="svg-patterns.ts" code={`'votre-nouveau': {
  file:        '/patterns/votre-nouveau.svg',
  name:        'Nom affiché',
  origin:      'Région, Pays',
  type:        'ndop',   // kente|bogolan|adinkra|ndop|wax
  region:      'central-africa',
  colors:      ['#hex1', '#hex2', '#hex3'],
  description: 'Description courte du motif',
  license:     'cc-by', // cc0|cc-by|cc-by-sa|proprietary
},`} />

    <Callout type="tip">
      Les SVG dans <code>public/</code> sont des ressources statiques — Next.js les sert directement sans transformation. Idéal pour les SVG complexes de motifs culturels.
    </Callout>
    <Callout type="warning">
      Pour des raisons de sécurité, les SVG sont chargés via <code>&lt;img&gt;</code> et non injectés inline. Les styles CSS internes au SVG fonctionneront, mais pas le ciblage via CSS externe.
    </Callout>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// DOC SECTIONS REGISTRY
// ══════════════════════════════════════════════════════════════════════════════
const DOC_SECTIONS: DocSection[] = [
  {
    id: 'getting-started', title: 'Démarrage',
    icon: <i className="pi pi-sparkles" style={{ fontSize: '13px' }} />,
    pages: [
      { id: 'introduction', title: 'Introduction', content: IntroductionPage, toc: [{ id: 'philosophie', level: 2, label: 'Philosophie' }, { id: 'comparaison', level: 2, label: 'Comparaison' }] },
      { id: 'installation', title: 'Installation', content: InstallationPage, toc: [{ id: 'methode-cli', level: 2, label: 'CLI' }, { id: 'methode-npm', level: 2, label: 'npm' }, { id: 'methode-cdn', level: 2, label: 'CDN' }, { id: 'configuration', level: 2, label: 'Tailwind config' }, { id: 'globals', level: 2, label: 'globals.css' }] },
    ],
  },
  {
    id: 'design-system', title: 'Design System',
    icon: <i className="pi pi-layer-group" style={{ fontSize: '13px' }} />,
    pages: [
      { id: 'design-tokens', title: 'Tokens & Couleurs', content: DesignTokensPage, toc: [{ id: 'palette', level: 2, label: 'Palette' }, { id: 'css-variables', level: 2, label: 'CSS Variables' }, { id: 'typography', level: 2, label: 'Typographie' }] },
      { id: 'css-patterns', title: 'Motifs CSS', content: CssPatternsPage, toc: [{ id: 'patterns-list', level: 2, label: 'Catalogue' }, { id: 'patterns-usage', level: 2, label: 'Usages typiques' }] },
    ],
  },
  {
    id: 'composants', title: 'Composants',
    icon: <i className="pi pi-file-code" style={{ fontSize: '13px' }} />,
    pages: [
      { id: 'button', title: 'Button', content: ButtonPage, toc: [{ id: 'btn-variantes', level: 2, label: 'Variantes' }, { id: 'btn-etats', level: 2, label: 'États' }, { id: 'btn-api', level: 2, label: 'API' }] },
      { id: 'svg-pattern', title: 'SvgPattern', content: SvgPatternPage, toc: [{ id: 'svg-registry-config', level: 2, label: 'Registre' }, { id: 'svg-usage-modes', level: 2, label: 'Usages' }, { id: 'svg-api', level: 2, label: 'API' }] },
    ],
  },
  {
    id: 'svg-integration', title: 'Motifs SVG',
    icon: <i className="pi pi-sun" style={{ fontSize: '13px' }} />,
    pages: [
      { id: 'add-svg', title: 'Ajouter vos SVG', content: AddSvgPage, toc: [{ id: 'step1-place', level: 2, label: 'Étape 1 — Placer' }, { id: 'step2-register', level: 2, label: 'Étape 2 — Registre' }, { id: 'step3-use', level: 2, label: 'Étape 3 — Utiliser' }] },
    ],
  },
];

const ALL_PAGES = DOC_SECTIONS.flatMap((s) => s.pages);

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function DocumentationPage() {
  const [activeId, setActiveId] = useState('introduction');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSec, setExpandedSec] = useState<string[]>(['getting-started', 'composants']);
  const [isDesktop, setIsDesktop] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Detect screen size
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    const timer = setTimeout(checkDesktop, 100);
    window.addEventListener('resize', checkDesktop);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

  const activePage = ALL_PAGES.find((p) => p.id === activeId)!;
  const activeIndex = ALL_PAGES.findIndex((p) => p.id === activeId);
  const prevPage = ALL_PAGES[activeIndex - 1];
  const nextPage = ALL_PAGES[activeIndex + 1];
  const activeHeading = useActiveHeading(activePage?.toc ?? []);

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
          (p) => p.title.toLowerCase().includes(search.toLowerCase()) ||
                 p.toc.some((t) => t.label.toLowerCase().includes(search.toLowerCase())),
        ),
      })).filter((s) => s.pages.length > 0)
    : DOC_SECTIONS;

  const toggleSection = (id: string) =>
    setExpandedSec((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  const ContentComponent = activePage?.content;

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div
        className="flex h-[calc(100vh-4rem)] overflow-hidden"
        style={{ background: 'var(--doc-bg)' }}
      >
        {/* ── Mobile overlay ──────────────────────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 lg:hidden"
              style={{ background: 'rgba(10,8,6,0.55)', backdropFilter: 'blur(4px)' }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════════════
            SIDEBAR
        ══════════════════════════════════════════════════════════════ */}
        <motion.aside
          initial={false}
          animate={{ x: isDesktop ? 0 : (sidebarOpen ? 0 : '-100%') }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="fixed top-16 left-0 z-40 flex h-[calc(100vh-4rem)] w-64 flex-col lg:static lg:translate-x-0"
          style={{ background: 'var(--doc-sidebar)', borderRight: '1px solid var(--doc-border)' }}
        >
          {/* Search */}
          <div className="p-3" style={{ borderBottom: '1px solid var(--doc-border)' }}>
            <div className="relative">
              <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: '12px', color: 'var(--doc-hint)' }} />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="w-full rounded-xl py-2 pl-8 pr-8 text-xs outline-none transition-all"
                style={{
                  background: 'var(--doc-surface)',
                  border: '1px solid var(--doc-border)',
                  color: 'var(--doc-text)',
                  fontFamily: 'inherit',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--doc-hint)' }}>
                  <i className="pi pi-times" style={{ fontSize: '11px' }} />
                </button>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="doc-scroll flex-1 overflow-y-auto py-3" aria-label="Documentation">
            {filteredSections.map((section) => {
              const isExpanded = expandedSec.includes(section.id) || !!search;
              const hasActive = section.pages.some((p) => p.id === activeId);
              return (
                <div key={section.id} className="mb-0.5">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between px-4 py-2 text-left transition-colors"
                    style={{ color: hasActive ? 'var(--doc-primary)' : 'var(--doc-hint)' }}
                  >
                    <span className="flex items-center gap-2 text-[9px] font-black tracking-[0.18em] uppercase">
                      {section.icon}
                      {section.title}
                    </span>
                    <i className={`pi pi-chevron-down transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} style={{ fontSize: '11px' }} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        {section.pages.map((page) => {
                          const isActive = activeId === page.id;
                          return (
                            <div key={page.id}>
                              <button
                                onClick={() => navigate(page.id)}
                                className="mx-2 flex w-[calc(100%-1rem)] items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all duration-150"
                                style={isActive
                                  ? { background: 'var(--doc-primary)', color: '#fff', fontWeight: 600 }
                                  : { color: 'var(--doc-muted)' }
                                }
                                aria-current={isActive ? 'page' : undefined}
                              >
                                <i className="pi pi-chevron-right shrink-0" style={{ fontSize: '10px', opacity: isActive ? 0.5 : 0.3 }} />
                                {page.title}
                              </button>

                              {/* TOC inline */}
                              {isActive && page.toc.length > 0 && (
                                <div className="mb-1 ml-9 mt-0.5 space-y-px">
                                  {page.toc.filter((t) => t.level === 2).map((t) => (
                                    <a
                                      key={t.id}
                                      href={`#${t.id}`}
                                      className="block rounded-lg px-2 py-1 text-[11px] transition-all duration-150"
                                      style={{
                                        color: activeHeading === t.id ? 'var(--doc-primary)' : 'rgba(255,255,255,0.5)',
                                        background: activeHeading === t.id ? 'var(--doc-primary-10)' : 'transparent',
                                        fontWeight: activeHeading === t.id ? 600 : 400,
                                      }}
                                    >{t.label}</a>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="space-y-0.5 p-3" style={{ borderTop: '1px solid var(--doc-border)' }}>
            {[
              { href: 'https://github.com/avs-standard', label: 'GitHub', icon: ExternalLink },
              { href: '/components', label: 'Composants', icon: Layers },
              { href: '/icons', label: 'Icônes SVG', icon: Sun },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors"
                style={{ color: 'var(--doc-hint)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--doc-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--doc-hint)')}
              >
                <i className={`pi ${conf.icon}`} style={{ fontSize: '12px' }} />
                {label}
                {href.startsWith('http') && <i className="pi pi-external-link ml-auto opacity-40" style={{ fontSize: '9px' }} />}
              </a>
            ))}
          </div>
        </motion.aside>

        {/* ══════════════════════════════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════════════════════════════ */}
        <div ref={contentRef} className="doc-scroll flex flex-1 flex-col overflow-y-auto">

          {/* Mobile topbar */}
          <div
            className="flex h-11 shrink-0 items-center gap-3 px-4 lg:hidden"
            style={{ borderBottom: '1px solid var(--doc-border)', background: 'var(--doc-sidebar)' }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-1.5 transition-colors"
              style={{ color: 'var(--doc-muted)' }}
            >
              <i className="pi pi-bars" style={{ fontSize: '17px' }} />
            </button>
            <div className="flex items-center gap-1.5 overflow-hidden text-xs" style={{ color: 'var(--doc-hint)' }}>
              <i className="pi pi-book" style={{ fontSize: '11px' }} />
              <span className="shrink-0">Docs</span>
              <i className="pi pi-chevron-right" style={{ fontSize: '9px' }} />
              <span className="truncate font-semibold" style={{ color: 'var(--doc-text)' }}>{activePage?.title}</span>
            </div>
          </div>

          {/* Desktop breadcrumb */}
          <div
            className="hidden h-10 shrink-0 items-center gap-1.5 px-8 text-[11px] lg:flex"
            style={{ borderBottom: '1px solid var(--doc-border)', color: 'var(--doc-hint)', background: 'var(--doc-sidebar)' }}
          >
            <i className="pi pi-terminal" style={{ fontSize: '11px' }} />
            <span>Docs</span>
            <i className="pi pi-chevron-right" style={{ fontSize: '9px' }} />
            <span className="font-semibold" style={{ color: 'var(--doc-text)' }}>{activePage?.title}</span>
          </div>

          {/* Article + right TOC */}
          <div className="flex flex-1 gap-0 min-h-0">
            {/* Article */}
            <AnimatePresence mode="wait">
              <motion.article
                key={activeId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0 flex-1 px-6 py-10 lg:px-12"
              >
                <Suspense fallback={
                  <div className="flex h-48 items-center justify-center">
                    <div className="avs-pattern-kente-royale h-10 w-10 animate-spin rounded-full opacity-60" style={{ animationDuration: '2s' }} />
                  </div>
                }>
                  {ContentComponent && <ContentComponent />}
                </Suspense>

                {/* Prev / Next navigation */}
                <div className="mt-14 flex items-center justify-between gap-4" style={{ borderTop: '1px solid var(--doc-border)', paddingTop: '2rem' }}>
                  {prevPage ? (
                    <button
                      onClick={() => navigate(prevPage.id)}
                      className="group flex max-w-[45%] items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200"
                      style={{ border: '1px solid var(--doc-border)', color: 'var(--doc-muted)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--doc-primary)'; e.currentTarget.style.color = 'var(--doc-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--doc-border)'; e.currentTarget.style.color = 'var(--doc-muted)'; }}
                    >
                      <i className="pi pi-arrow-left shrink-0" style={{ fontSize: '13px' }} />
                      <span className="truncate">{prevPage.title}</span>
                    </button>
                  ) : <div />}

                  {nextPage && (
                    <button
                      onClick={() => navigate(nextPage.id)}
                      className="ml-auto flex max-w-[45%] items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200"
                      style={{ border: '1px solid var(--doc-border)', color: 'var(--doc-muted)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--doc-primary)'; e.currentTarget.style.color = 'var(--doc-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--doc-border)'; e.currentTarget.style.color = 'var(--doc-muted)'; }}
                    >
                      <span className="truncate">{nextPage.title}</span>
                      <i className="pi pi-arrow-right shrink-0" style={{ fontSize: '13px' }} />
                    </button>
                  )}
                </div>

                <p className="mt-8 text-center font-mono text-[10px]" style={{ color: 'var(--doc-hint)', opacity: 0.6 }}>
                  AVS Documentation · v1.0.0 · Mis à jour avril 2026
                </p>
              </motion.article>
            </AnimatePresence>

            {/* Right TOC */}
            {activePage?.toc && activePage.toc.length > 0 && (
              <aside className="hidden w-52 shrink-0 xl:block">
                <div className="sticky top-4 pt-10 pr-6">
                  <p className="mb-3 font-mono text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--doc-hint)' }}>
                    Sur cette page
                  </p>
                  <nav aria-label="Table des matières" className="space-y-0.5">
                    {activePage.toc.map(({ id, label, level }) => (
                      <a
                        key={id}
                        href={`#${id}`}
                        className="block rounded-lg px-2 py-1.5 text-[12px] leading-snug transition-all duration-150"
                        style={{
                          paddingLeft: level === 3 ? '1rem' : '0.5rem',
                          color: activeHeading === id ? 'var(--doc-primary)' : 'var(--doc-hint)',
                          fontWeight: activeHeading === id ? 600 : 400,
                          background: activeHeading === id ? 'var(--doc-primary-10)' : 'transparent',
                          borderLeft: activeHeading === id ? '2px solid var(--doc-primary)' : '2px solid transparent',
                        }}
                      >{label}</a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  );
}