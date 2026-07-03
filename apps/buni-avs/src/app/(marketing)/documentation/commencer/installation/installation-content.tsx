'use client';

import { useState } from 'react';

function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-avs-accent/9 bg-avs-accent/5 p-4 font-mono text-xs">
      <code>{code}</code>
    </pre>
  );
}

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
      <CodeBlock code={`# Initialiser AVS dans un projet Next.js existant
npx @avs/cli init

# Répondre aux questions :
# ✔ Chemin src/ ? › src
# ✔ Alias import ? › @/*
# ✔ Ajouter les motifs CSS ? › Oui
# ✔ Ajouter le design system complet ? › Oui`} />

      <CodeBlock code={`# Ajouter des composants individuellement
npx @avs/cli add button
npx @avs/cli add badge
npx @avs/cli add pattern-card

# Lister tous les composants disponibles
npx @avs/cli list`} />

      <h3>Méthode 2 — Package npm</h3>
      <p>Installez les packages manuellement si vous préférez un contrôle total.</p>

      <div className="mb-4 flex w-fit items-center gap-0.5 rounded-xl border border-avs-accent/9 bg-avs-secondary p-1">
        {(['npm', 'pnpm', 'yarn'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setPkgMgr(m)}
            className={`rounded-lg px-3.5 py-1.5 font-mono text-xs font-bold transition-all duration-200 ${
              pkgMgr === m ? 'bg-avs-primary text-white' : 'text-avs-accent/40'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <CodeBlock code={`${cmds[pkgMgr]} @avs/ui @avs/icons
${cmds[pkgMgr]} @radix-ui/react-slot @radix-ui/react-dialog
${cmds[pkgMgr]} framer-motion clsx tailwind-merge class-variance-authority`} />

      <h3>Méthode 3 — CDN (HTML pur)</h3>
      <p>Pour les projets sans build step, utilisez le CDN.</p>
      <CodeBlock code={`<!DOCTYPE html>
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
    </>
  );
}

export const InstallationContent = {
  Why: InstallationWhy,
  Explanation: InstallationExplanation,
};
