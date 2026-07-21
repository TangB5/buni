'use client';

import { useState } from 'react';
import { CodeBlock } from '../../doc-primitives';

export function InstallationWhy() {
  return (
    <p>
      AVS s'installe facilement dans n'importe quel framework JavaScript moderne avec Tailwind CSS v4.
      Choisissez votre framework pour voir les instructions d'installation spécifiques.
    </p>
  );
}

export function InstallationExplanation() {
  const [framework, setFramework] = useState<'nextjs' | 'vue' | 'angular'>('nextjs');
  const [pkgMgr, setPkgMgr] = useState<'npm' | 'pnpm' | 'yarn'>('npm');
  const cmds = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add' };

  return (
    <>
      <h3>Méthode CLI (recommandé)</h3>
      <p>La méthode la plus simple pour installer AVS dans votre projet.</p>

      <CodeBlock id="cli-init" lang="bash" title="Terminal" code={`npx @buni/cli init`} />

      <p>
        Cette commande détecte automatiquement votre framework (Next.js, Vue, Angular) et configure :
      </p>

      <ul className="my-4 space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <i className="pi pi-check text-emerald-500 mt-0.5" style={{ fontSize: '12px' }} />
          <span>Tailwind CSS v4 avec les couleurs AVS</span>
        </li>
        <li className="flex items-start gap-2">
          <i className="pi pi-check text-emerald-500 mt-0.5" style={{ fontSize: '12px' }} />
          <span>Motifs CSS (kente, ndop, adinkra, etc.)</span>
        </li>
        <li className="flex items-start gap-2">
          <i className="pi pi-check text-emerald-500 mt-0.5" style={{ fontSize: '12px' }} />
          <span>Structure de dossier optimisée</span>
        </li>
      </ul>

      <h4>Ajouter des composants</h4>
      <p>Ajoutez uniquement les composants dont vous avez besoin :</p>

      <CodeBlock id="cli-add" lang="bash" title="Terminal" code={`npx @buni/cli add button
npx @buni/cli add card
npx @buni/cli add dialog

# Lister tous les composants disponibles
npx @buni/cli list`} />

      <h3>Package Manager</h3>
      <p>Sélectionnez votre package manager pour les commandes d'installation :</p>

      <div className="mb-4 flex w-fit items-center gap-0.5 rounded-xl p-1" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-surface, #ffffff)' }}>
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

      <h3>Méthode manuelle par framework</h3>
      <p>Sélectionnez votre framework pour voir les instructions d'installation manuelle spécifiques.</p>

      <div className="mb-6 flex w-fit items-center gap-0.5 rounded-xl p-1" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-surface, #ffffff)' }}>
        {(['nextjs', 'vue', 'angular'] as const).map((fw) => (
          <button
            key={fw}
            onClick={() => setFramework(fw)}
            className="rounded-lg px-4 py-2 font-mono text-xs font-bold transition-all duration-200"
            style={framework === fw
              ? { background: 'var(--doc-primary, #C0573E)', color: '#fff' }
              : { color: 'var(--doc-hint, rgba(29,29,27,0.32))' }
            }
          >
            {fw === 'nextjs' ? 'Next.js' : fw === 'vue' ? 'Vue' : 'Angular'}
          </button>
        ))}
      </div>

      {framework === 'nextjs' && (
        <>
          <h3>Installation Next.js avec Tailwind CSS v4</h3>
          <p>Installez AVS dans votre projet Next.js 14+ avec App Router.</p>

          <h4>Étape 1 : Installer les dépendances</h4>
          <CodeBlock id="nextjs-deps" lang="bash" title="Terminal" code={`${cmds[pkgMgr]} tailwindcss @radix-ui/react-slot
${cmds[pkgMgr]} framer-motion clsx tailwind-merge
${cmds[pkgMgr]} class-variance-authority lucide-react`} />

          <h4>Étape 2 : Configurer Tailwind CSS v4</h4>
          <CodeBlock id="nextjs-globals" lang="css" title="src/app/globals.css" code={`@import "tailwindcss";

@theme {
  --color-avs-primary: #C0573E;
  --color-avs-secondary: #F5EBE0;
  --color-avs-accent: #1D1D1B;
  --color-avs-kente: #D4A017;
  --color-avs-ndop: #4A6741;
  --color-avs-indigo: #2A4A6B;

  --font-display: Georgia, serif;
  --font-mono: monospace;
}`} />

          <h4>Étape 3 : Ajouter les motifs AVS</h4>
          <p>Téléchargez les motifs CSS depuis la galerie et placez-les dans votre projet :</p>

          <CodeBlock id="nextjs-patterns" lang="bash" title="Terminal" code={`# Créer le dossier des motifs
mkdir -p src/styles/patterns

# Télécharger les motifs depuis la galerie AVS
# ou utiliser le CDN directement dans votre CSS`} />

          <CodeBlock id="nextjs-patterns-css" lang="css" title="src/styles/patterns.css" code={`/* Importez les motifs AVS ou ajoutez-les ici */
.avs-pattern-kente-royal {
  background-image: url('data:image/svg+xml;base64,...');
  /* ou utilisez le CDN */
  background-image: url('https://cdn.buni-standard.com/patterns/kente-royal.svg');
}

/* Importez ce fichier dans globals.css */
/* @import '../styles/patterns.css'; */`} />

          <h4>Étape 4 : Utiliser AVS dans votre projet</h4>
          <CodeBlock id="nextjs-usage" lang="tsx" title="src/app/page.tsx" code={`export default function HomePage() {
  return (
    <div className="min-h-screen bg-avs-secondary">
      <section className="avs-pattern-kente-royal relative py-20">
        <div className="absolute inset-0 bg-avs-primary/80" />
        <div className="relative container mx-auto px-4">
          <h1 className="font-display text-4xl text-avs-secondary">
            Bienvenue
          </h1>
        </div>
      </section>
    </div>
  );
}`} />
        </>
      )}

      {framework === 'vue' && (
        <>
          <h3>Installation Vue 3 avec Tailwind CSS v4</h3>
          <p>Installez AVS dans votre projet Vue 3 avec Vite.</p>

          <h4>Étape 1 : Installer les dépendances</h4>
          <CodeBlock id="vue-deps" lang="bash" title="Terminal" code={`${cmds[pkgMgr]} tailwindcss @radix-vue
${cmds[pkgMgr]} framer-motion clsx tailwind-merge
${cmds[pkgMgr]} class-variance-authority lucide-vue-next`} />

          <h4>Étape 2 : Configurer Tailwind CSS v4</h4>
          <CodeBlock id="vue-main-css" lang="css" title="src/assets/main.css" code={`@import "tailwindcss";

@theme {
  --color-avs-primary: #C0573E;
  --color-avs-secondary: #F5EBE0;
  --color-avs-accent: #1D1D1B;
  --color-avs-kente: #D4A017;
  --color-avs-ndop: #4A6741;
  --color-avs-indigo: #2A4A6B;

  --font-display: Georgia, serif;
  --font-mono: monospace;
}`} />

          <h4>Étape 3 : Importer les styles</h4>
          <CodeBlock id="vue-main" lang="ts" title="src/main.ts" code={`import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';

createApp(App).mount('#app');`} />

          <h4>Étape 4 : Utiliser AVS dans votre projet</h4>
          <CodeBlock id="vue-usage" lang="vue" title="src/components/HomePage.vue" code={`<template>
  <div class="min-h-screen bg-avs-secondary">
    <section class="avs-pattern-kente-royal relative py-20">
      <div class="absolute inset-0 bg-avs-primary/80" />
      <div class="relative container mx-auto px-4">
        <h1 class="font-display text-4xl text-avs-secondary">
          Bienvenue
        </h1>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Votre logique ici
</script>`} />
        </>
      )}

      {framework === 'angular' && (
        <>
          <h3>Installation Angular 17+ avec Tailwind CSS v4</h3>
          <p>Installez AVS dans votre projet Angular avec Standalone Components.</p>

          <h4>Étape 1 : Installer les dépendances</h4>
          <CodeBlock id="angular-deps" lang="bash" title="Terminal" code={`${cmds[pkgMgr]} tailwindcss
${cmds[pkgMgr]} @angular/cdk
${cmds[pkgMgr]} clsx tailwind-merge`} />

          <h4>Étape 2 : Configurer Tailwind CSS v4</h4>
          <CodeBlock id="angular-styles" lang="css" title="src/styles.css" code={`@import "tailwindcss";

@theme {
  --color-avs-primary: #C0573E;
  --color-avs-secondary: #F5EBE0;
  --color-avs-accent: #1D1D1B;
  --color-avs-kente: #D4A017;
  --color-avs-ndop: #4A6741;
  --color-avs-indigo: #2A4A6B;

  --font-display: Georgia, serif;
  --font-mono: monospace;
}`} />

          <h4>Étape 3 : Utiliser AVS dans votre projet</h4>
          <CodeBlock id="angular-usage" lang="ts" title="src/app/app.component.ts" code={`import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="min-h-screen bg-avs-secondary">
      <section class="avs-pattern-kente-royal relative py-20">
        <div class="absolute inset-0 bg-avs-primary/80" />
        <div class="relative container mx-auto px-4">
          <h1 class="font-display text-4xl text-avs-secondary">
            Bienvenue
          </h1>
        </div>
      </section>
    </div>
  \`,
})
export class AppComponent {}`} />
        </>
      )}

      <h3>Prochaines étapes</h3>
      <ul className="my-4 space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <i className="pi pi-arrow-right text-avs-primary mt-0.5" style={{ fontSize: '12px' }} />
          <span>Explorez la <a href="/documentation/motifs" className="font-bold text-avs-primary hover:underline">galerie de motifs</a> pour télécharger des SVGs</span>
        </li>
        <li className="flex items-start gap-2">
          <i className="pi pi-arrow-right text-avs-primary mt-0.5" style={{ fontSize: '12px' }} />
          <span>Découvrez les <a href="/documentation/composants" className="font-bold text-avs-primary hover:underline">composants UI</a> disponibles</span>
        </li>
        <li className="flex items-start gap-2">
          <i className="pi pi-arrow-right text-avs-primary mt-0.5" style={{ fontSize: '12px' }} />
          <span>Lisez le guide sur la <a href="/documentation/commencer/structure" className="font-bold text-avs-primary hover:underline">structure de projet</a></span>
        </li>
      </ul>
    </>
  );
}

export const InstallationContent = {
  Why: InstallationWhy,
  Explanation: InstallationExplanation,
};
