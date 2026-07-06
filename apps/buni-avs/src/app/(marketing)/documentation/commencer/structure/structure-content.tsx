'use client';

import { CodeBlock } from '../../doc-primitives';

export function StructureWhy() {
  return (
    <p>
      Une structure de projet bien définie facilite la collaboration, la maintenance et l'évolutivité du design system.
      AVS utilise Nx pour gérer efficacement ses dépendances et builds.
    </p>
  );
}

export function StructureExplanation() {
  return (
    <>
      <h3>Architecture Monorepo</h3>
      <p>AVS utilise une architecture monorepo avec Nx pour orchestrer les builds, tests et dépendances entre les différents packages.</p>

      <h3>Organisation des dossiers</h3>
      <CodeBlock id="folder-structure" lang="bash" code={`buni/
├── apps/
│   └── buni-avs/          # Application Next.js principale
│       ├── src/
│       │   ├── app/       # Routes Next.js App Router
│       │   └── components/
│       └── public/
├── packages/
│   ├── ui/                # Composants UI réutilisables
│   ├── tokens/            # Design tokens (couleurs, espacements)
│   ├── patterns/          # Motifs CSS et SVG
│   ├── auth/              # Authentification
│   ├── api/               # API client
│   ├── analytics/         # Analytics
│   ├── utils/             # Utilitaires partagés
│   ├── config/            # Configuration partagée
│   └── theme/             # Thème et styles
└── tools/                 # Scripts et outils de build`} />

      <h3>Principaux packages</h3>
      <div className="my-5 grid gap-3 sm:grid-cols-2">
        {[
          { name: '@buni/ui', desc: 'Bibliothèque de composants React (Button, Card, Dialog, etc.)' },
          { name: '@buni/tokens', desc: 'Design tokens CSS (couleurs, typographie, espacements)' },
          { name: '@buni/patterns', desc: 'Motifs CSS et SVG africains' },
          { name: '@buni/auth', desc: 'Système d\'authentification' },
          { name: '@buni/api', desc: 'Client API avec Axios' },
          { name: '@buni/analytics', desc: 'Analytics et tracking' },
        ].map(({ name, desc }) => (
          <div key={name} className="rounded-xl p-4 transition-colors" style={{ border: '1px solid var(--doc-border, rgba(29,29,27,0.09))', background: 'var(--doc-surface, #ffffff)' }}>
            <p className="font-mono text-xs font-bold" style={{ color: 'var(--doc-primary, #C0573E)' }}>{name}</p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--doc-hint, rgba(29,29,27,0.32))', marginBottom: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export const StructureContent = {
  Why: StructureWhy,
  Explanation: StructureExplanation,
};
