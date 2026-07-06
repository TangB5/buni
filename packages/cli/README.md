# @buni/cli

CLI pour le Design System Buni — Approche Copy & Paste (style shadcn/ui)

## 🎯 Philosophie

Cette CLI permet aux développeurs et designers de copier les composants Buni directement dans leur projet. Pas de dépendance npm opaque, pas de versionnage complexe — vous possédez votre code et pouvez le modifier selon vos besoins.

## 📁 Structure du projet

```
packages/cli/
├── src/
│   ├── index.ts                 # Point d'entrée principal
│   ├── commands/
│   │   ├── init.ts              # Commande d'initialisation
│   │   ├── add.ts               # Commande d'ajout de composants
│   │   └── list.ts              # Commande de listing des composants
│   └── templates/
│       ├── utils/
│       │   └── cn.ts            # Utilitaire de gestion des classes
│       ├── components/          # Templates des composants
│       │   ├── button/
│       │   │   └── Button.tsx
│       │   ├── badge/
│       │   ├── card/
│       │   └── ...
│       ├── patterns/
│       │   └── patterns.css     # Motifs CSS africains
│       └── tokens/
│           └── avs-tokens.css   # Design tokens
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Utilisation

### Initialiser Buni dans un projet

```bash
npx @buni/cli init
```

Cette commande :
1. Pose des questions sur la structure du projet (dossier src, alias import)
2. Crée les dossiers nécessaires (`src/components/ui`, `src/lib`, `src/theme`)
3. Copie les utilitaires (`cn.ts`)
4. Copie les patterns CSS (si demandé)
5. Copie les tokens CSS (si demandé)
6. Met à jour `tailwind.config.ts`
7. Met à jour `globals.css`

### Ajouter des composants

```bash
# Ajouter un composant spécifique
npx @buni/cli add button

# Ajouter plusieurs composants
npx @buni/cli add button badge card

# Sélectionner via interface interactive
npx @buni/cli add
```

### Lister les composants disponibles

```bash
npx @buni/cli list
```

## 🔧 Comment ajouter un nouveau composant

### Étape 1 : Créer le template

Créez un nouveau dossier dans `src/templates/components/` :

```bash
mkdir -p src/templates/components/mon-composant
```

### Étape 2 : Copier le composant depuis `packages/ui`

1. Allez dans `packages/ui/src/components/`
2. Copiez le fichier du composant (ex: `MonComposant.tsx`)
3. Collez-le dans `packages/cli/src/templates/components/mon-composant/`
4. Renommez-le en `MonComposant.tsx`

### Étape 3 : Adapter les imports

Modifiez les imports pour utiliser le chemin relatif vers `cn.ts` :

```tsx
// ❌ Avant (dans packages/ui)
import { cn } from '../utils';

// ✅ Après (dans packages/cli)
import { cn } from '../../utils/cn';
```

### Étape 4 : Ajouter à la liste des composants

Ouvrez `src/commands/add.ts` et ajoutez le composant à `AVAILABLE_COMPONENTS` :

```typescript
const AVAILABLE_COMPONENTS = [
  'button',
  'badge',
  'card',
  'mon-composant',  // ← Ajoutez ici
  // ...
] as const;
```

### Étape 5 : Tester

```bash
# Build la CLI
cd packages/cli
npm run build

# Testez l'ajout
node dist/index.js add mon-composant
```

## 🔧 Comment ajouter une nouvelle commande

### Étape 1 : Créer le fichier de commande

Créez un nouveau fichier dans `src/commands/` :

```typescript
// src/commands/ma-commande.ts
import { Command } from 'commander';
import chalk from 'chalk';

export const maCommande = new Command('ma-commande')
  .description('Description de ma commande')
  .action(async () => {
    console.log(chalk.cyan('Exécution de ma commande'));
    // Votre logique ici
  });
```

### Étape 2 : Enregistrer la commande

Ouvrez `src/index.ts` et ajoutez la commande :

```typescript
import { maCommande } from './commands/ma-commande';

// ...

program.addCommand(maCommande);
```

### Étape 3 : Build et test

```bash
npm run build
node dist/index.js ma-commande
```

## 🎨 Comment modifier les templates CSS

### Patterns CSS

Les patterns sont dans `src/templates/patterns/patterns.css`. Pour ajouter un nouveau pattern :

1. Ajoutez la classe CSS correspondante
2. Suivez le format existant avec les commentaires

### Tokens CSS

Les tokens sont dans `src/templates/tokens/avs-tokens.css`. Pour modifier :

1. Modifiez les variables CSS dans `@theme`
2. Ajoutez de nouvelles classes utilitaires dans `@layer utilities`

## 📦 Dépendances

- `commander` : Framework CLI
- `inquirer` : Prompts interactifs
- `ora` : Spinners de chargement
- `chalk` : Coloration terminal
- `fs-extra` : Manipulation de fichiers avancée

## 🛠️ Développement

```bash
# Installer les dépendances
cd packages/cli
pnpm install

# Build
npm run build

# Watch mode
npm run dev

# Typecheck
npm run typecheck
```

## 📝 Notes importantes

- Les templates utilisent des chemins relatifs (`../../utils/cn`) car ils seront copiés dans le projet utilisateur
- L'import alias `@/lib/cn` sera remplacé par l'alias configuré par l'utilisateur lors de `buni init`
- Toujours tester après avoir ajouté un nouveau composant
- Gardez les templates synchronisés avec `packages/ui` si vous apportez des modifications

## 🔄 Workflow de mise à jour

1. Modifiez le composant dans `packages/ui`
2. Copiez les modifications dans `packages/cli/src/templates/components/`
3. Adaptez les imports si nécessaire
4. Build la CLI
5. Testez l'ajout du composant

## 🚨 Problèmes courants

### Erreur "Module not found"
Vérifiez que les imports relatifs dans les templates sont corrects.

### Le composant ne s'ajoute pas
Vérifiez que le composant est dans `AVAILABLE_COMPONENTS` dans `add.ts`.

### Les styles ne s'appliquent pas
Vérifiez que `globals.css` importe bien les fichiers CSS nécessaires.
