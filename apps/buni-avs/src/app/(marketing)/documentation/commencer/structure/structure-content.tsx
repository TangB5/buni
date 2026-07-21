'use client';

import { useState } from 'react';
import { CodeBlock } from '../../doc-primitives';

export function StructureWhy() {
  return (
    <p>
      AVS s'intègre facilement dans n'importe quel framework JavaScript moderne. Découvrez comment structurer
      votre projet avec AVS selon votre framework préféré : Next.js, Vue, Angular, ou autres.
    </p>
  );
}

export function StructureExplanation() {
  const [framework, setFramework] = useState<'nextjs' | 'vue' | 'angular'>('nextjs');

  return (
    <>
      <h3>Choisissez votre framework</h3>
      <p>Sélectionnez votre framework pour voir la structure de projet recommandée avec AVS.</p>

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
          <h3>Next.js avec Tailwind CSS v4</h3>
          <p>Structure recommandée pour un projet Next.js 14+ avec App Router et AVS.</p>

          <CodeBlock id="nextjs-structure" lang="bash" title="Structure Next.js" code={`my-app/
├── src/
│   ├── app/                    # App Router
│   │   ├── globals.css        # Tailwind + AVS
│   │   ├── layout.tsx         # Layout racine
│   │   └── page.tsx           # Page d'accueil
│   ├── components/
│   │   ├── ui/                # Composants AVS
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── dialog.tsx
│   │   └── features/          # Composants métier
│   │       └── auth/
│   ├── lib/
│   │   ├── utils.ts           # Utilitaires
│   │   └── api.ts             # Client API
│   ├── styles/
│   │   ├── patterns.css       # Motifs AVS
│   │   └── tokens.css         # Tokens personnalisés
│   └── types/
│       └── index.ts           # Types TypeScript
├── public/
│   └── patterns/              # SVGs AVS
└── tailwind.config.ts         # Config Tailwind v4`} />

          <h3>Configuration</h3>
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
}

@import '../styles/patterns.css';`} />

          <CodeBlock id="nextjs-page" lang="tsx" title="src/app/page.tsx" code={`export default function HomePage() {
  return (
    <div className="min-h-screen bg-avs-secondary">
      {/* Hero avec motif AVS */}
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
          <h3>Vue 3 avec Tailwind CSS v4</h3>
          <p>Structure recommandée pour un projet Vue 3 avec Vite et AVS.</p>

          <CodeBlock id="vue-structure" lang="bash" title="Structure Vue" code={`my-app/
├── src/
│   ├── assets/
│   │   ├── patterns.css      # Motifs AVS
│   │   └── tokens.css        # Tokens personnalisés
│   ├── components/
│   │   ├── ui/               # Composants AVS
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   └── Dialog.vue
│   │   └── features/         # Composants métier
│   │       └── auth/
│   ├── composables/          # Composables
│   ├── router/
│   │   └── index.ts
│   ├── App.vue              # Composant racine
│   └── main.ts              # Point d'entrée
├── public/
│   └── patterns/            # SVGs AVS
└── tailwind.config.ts       # Config Tailwind v4`} />

          <h3>Configuration</h3>
          <CodeBlock id="vue-main" lang="ts" title="src/main.ts" code={`import { createApp } from 'vue';
import App from './App.vue';
import './assets/patterns.css';

createApp(App).mount('#app');`} />

          <CodeBlock id="vue-tailwind" lang="css" title="src/assets/main.css" code={`@import "tailwindcss";

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

          <CodeBlock id="vue-component" lang="vue" title="src/components/HomePage.vue" code={`<template>
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
          <h3>Angular 17+ avec Tailwind CSS v4</h3>
          <p>Structure recommandée pour un projet Angular avec Standalone Components et AVS.</p>

          <CodeBlock id="angular-structure" lang="bash" title="Structure Angular" code={`my-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/          # Composants AVS
│   │   │   │   ├── button/
│   │   │   │   ├── card/
│   │   │   │   └── dialog/
│   │   │   └── features/    # Composants métier
│   │   │       └── auth/
│   │   ├── services/
│   │   ├── pipes/
│   │   ├── app.config.ts    # Configuration
│   │   ├── app.component.ts # Composant racine
│   │   └── app.routes.ts    # Routes
│   ├── assets/
│   │   ├── patterns.css     # Motifs AVS
│   │   └── tokens.css       # Tokens personnalisés
│   ├── styles.css           # Styles globaux
│   └── main.ts              # Point d'entrée
├── public/
│   └── patterns/            # SVGs AVS
└── tailwind.config.ts       # Config Tailwind v4`} />

          <h3>Configuration</h3>
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
}

@import 'assets/patterns.css';`} />

          <CodeBlock id="angular-component" lang="ts" title="src/app/app.component.ts" code={`import { Component } from '@angular/core';
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

      <h3>Bonnes pratiques (tous frameworks)</h3>
      
      <div className="my-4 space-y-3">
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-surface, #ffffff)' }}>
          <h4 className="mb-2 text-sm font-bold" style={{ color: 'var(--doc-text, #1D1D1B)' }}>1. Séparez les composants AVS</h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))', marginBottom: 0 }}>
            Gardez les composants AVS dans un dossier dédié (<code className="font-mono text-xs">components/ui/</code>). Cela facilite les mises à jour et la maintenance.
          </p>
        </div>

        <div className="rounded-xl p-4" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-surface, #ffffff)' }}>
          <h4 className="mb-2 text-sm font-bold" style={{ color: 'var(--doc-text, #1D1D1B)' }}>2. Utilisez les tokens AVS</h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))', marginBottom: 0 }}>
            Les couleurs AVS sont conçues pour fonctionner ensemble. Privilégiez <code className="font-mono text-xs">bg-avs-primary</code>, <code className="font-mono text-xs">text-avs-secondary</code>, etc.
          </p>
        </div>

        <div className="rounded-xl p-4" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-surface, #ffffff)' }}>
          <h4 className="mb-2 text-sm font-bold" style={{ color: 'var(--doc-text, #1D1D1B)' }}>3. Motifs avec parcimonie</h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))', marginBottom: 0 }}>
            Les motifs AVS sont puissants. Utilisez-les pour les sections hero, headers ou accents, pas sur tout le site.
          </p>
        </div>
      </div>
    </>
  );
}

export const StructureContent = {
  Why: StructureWhy,
  Explanation: StructureExplanation,
};
