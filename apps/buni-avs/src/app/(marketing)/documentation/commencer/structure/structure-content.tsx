export const StructureContent = {
  Why: () => (
    <p>
      Une structure de projet bien définie facilite la collaboration, la maintenance et l'évolutivité du design system.
      AVS utilise Nx pour gérer efficacement ses dépendances et builds.
    </p>
  ),
  Explanation: () => (
    <>
      <h3>Architecture Monorepo</h3>
      <p>AVS utilise une architecture monorepo avec Nx pour orchestrer les builds, tests et dépendances entre les différents packages.</p>

      <h3>Organisation des dossiers</h3>
      <pre className="bg-avs-accent/5 p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`buni/
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
└── tools/                 # Scripts et outils de build`}
      </pre>

      <h3>Principaux packages</h3>
      <ul>
        <li><strong>@buni/ui</strong> — Bibliothèque de composants React (Button, Card, Dialog, etc.)</li>
        <li><strong>@buni/tokens</strong> — Design tokens CSS (couleurs, typographie, espacements)</li>
        <li><strong>@buni/patterns</strong> — Motifs CSS et SVG africains</li>
        <li><strong>@buni/auth</strong> — Système d'authentification</li>
        <li><strong>@buni/api</strong> — Client API avec Axios</li>
      </ul>
    </>
  ),
};
