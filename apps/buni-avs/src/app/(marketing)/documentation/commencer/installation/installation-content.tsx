'use client';

import { useState } from 'react';
import { CodeBlock } from '../../doc-primitives';

export function InstallationWhy() {
  return (
    <p>
      Une installation correcte est essentielle pour bénéficier de toutes les fonctionnalités d'AVS :
      composants, motifs, tokens et documentation.
    </p>
  );
}

export function InstallationExplanation() {
  const [pkgMgr, setPkgMgr] = useState<'npm' | 'pnpm' | 'yarn'>('npm');
  const cmds = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add' };

  return (
    <>
      <h3>Méthode 1 — CLI (recommandé)</h3>
      <p>La méthode CLI est la plus simple pour initialiser AVS dans votre projet.</p>
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

      <h3>Méthode 2 — Package npm</h3>
      <p>Installez les packages manuellement si vous préférez un contrôle total.</p>

      <div className="mb-2 flex w-fit items-center gap-0.5 rounded-xl p-1" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-surface, #ffffff)' }}>
        {(['npm', 'pnpm', 'yarn'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setPkgMgr(m)}
            className="rounded-lg px-3.5 py-1.5 font-mono text-xs font-bold transition-all duration-200"
            style={pkgMgr === m
              ? { background: 'var(--doc-primary, #C0573E)', color: '#fff' }
              : { color: 'var(--doc-hint, rgba(29,29,27,0.32))' }
            }
          >
            {m}
          </button>
        ))}
      </div>

      <CodeBlock id="npm-install" lang="bash" title="Terminal" code={`${cmds[pkgMgr]} @avs/ui @avs/icons
${cmds[pkgMgr]} @radix-ui/react-slot @radix-ui/react-dialog
${cmds[pkgMgr]} framer-motion clsx tailwind-merge class-variance-authority`} />

      <h3>Méthode 3 — CDN (HTML pur)</h3>
      <p>Pour les projets sans build step, utilisez le CDN.</p>
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

      <h3>Configuration Tailwind</h3>
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

      <h3>globals.css</h3>
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
    </>
  );
}

export const InstallationContent = {
  Why: InstallationWhy,
  Explanation: InstallationExplanation,
};
