# Comment créer et intégrer un nouveau package

Ce guide explique comment créer un nouveau package dans le monorepo Buni et l'intégrer dans vos applications.

## Structure du monorepo

```
buni/
├── apps/           # Applications (buni-avs, etc.)
├── packages/       # Packages partagés
├── services/       # Services backend
└── docs/           # Documentation
```

## Étape 1 : Créer la structure du package

### 1.1 Créer le dossier du package

```bash
mkdir -p packages/mon-package/src
```

### 1.2 Créer les fichiers de configuration

**package.json**
```json
{
  "name": "@buni/mon-package",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    // Dépendances spécifiques à votre package
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "next": "^14.0.0 || ^15.0.0"
  }
}
```

**tsconfig.json**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Étape 2 : Créer le contenu du package

### 2.1 Structure recommandée des fichiers source

```
packages/mon-package/src/
├── components/      # Composants React
├── hooks/          # Hooks personnalisés
├── providers/      # Context providers
├── utils/          # Fonctions utilitaires
├── types/          # Types TypeScript
└── index.ts        # Point d'export principal
```

### 2.2 Exemple de fichiers

**src/hooks/use-mon-hook.ts**
```typescript
'use client';

export function useMonHook() {
  // Votre logique ici
  return { /* ... */ };
}
```

**src/components/MonComposant.tsx**
```typescript
'use client';

export function MonComposant() {
  return <div>Mon composant</div>;
}
```

**src/index.ts** (Point d'export principal)
```typescript
export { useMonHook } from './hooks/use-mon-hook';
export { MonComposant } from './components/MonComposant';
```

## Étape 3 : Installer les dépendances

### 3.1 Installer les dépendances du package

```bash
pnpm add <dependance> -F @buni/mon-package
```

### 3.2 Installer les dépendances de développement (si nécessaire)

```bash
pnpm add -D <dependance> -F @buni/mon-package
```

## Étape 4 : Compiler le package

```bash
cd packages/mon-package
npx tsc
```

Cela génère le dossier `dist/` avec les fichiers JavaScript et les définitions TypeScript.

## Étape 5 : Intégrer le package dans une application

### 5.1 Ajouter la dépendance dans le package.json de l'app

**apps/mon-app/package.json**
```json
{
  "dependencies": {
    "@buni/mon-package": "workspace:*"
  }
}
```

### 5.2 Installer les dépendances

```bash
pnpm install
```

### 5.3 Utiliser le package dans votre code

```typescript
import { useMonHook, MonComposant } from '@buni/mon-package';

export function MonComposantApp() {
  const { data } = useMonHook();
  
  return <MonComposant />;
}
```

## Étape 6 : Bonnes pratiques

### 6.1 Utilisation de 'use client'

Pour les packages qui utilisent des hooks React ou des fonctionnalités côté client, ajoutez `'use client';` en haut de chaque fichier concerné.

### 6.2 Gestion des types

- Définissez clairement vos interfaces TypeScript
- Exportez les types réutilisables dans `index.ts`
- Utilisez les types génériques quand c'est approprié

### 6.3 Documentation

- Ajoutez des commentaires JSDoc pour les fonctions complexes
- Documentez les props des composants
- Créez des exemples d'utilisation

### 6.4 Tests

- Ajoutez des tests unitaires pour les fonctions utilitaires
- Testez les composants React avec un framework de test
- Testez les hooks personnalisés

## Exemple complet : Package @buni/theme

Voici un exemple complet basé sur le package @buni/theme créé dans ce projet :

### Structure
```
packages/theme/
├── package.json
├── tsconfig.json
└── src/
    ├── providers/
    │   └── theme-provider.tsx
    ├── hooks/
    │   └── use-theme.ts
    ├── components/
    │   └── theme-toggle.tsx
    └── index.ts
```

### Utilisation dans une app

```typescript
// Dans app/layout.tsx ou components/layout/Providers.tsx
import { ThemeProvider } from '@buni/theme';

<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
  {/* Votre application */}
</ThemeProvider>

// Dans un composant
import { useTheme, ThemeToggle } from '@buni/theme';

function MonComposant() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <ThemeToggle />
      <p>Thème actuel : {theme}</p>
    </div>
  );
}
```

## Dépannage

### Erreur : Cannot find module '@buni/mon-package'

**Solution :**
1. Vérifiez que le package est bien dans `packages/`
2. Vérifiez que le `package.json` de l'app contient la dépendance
3. Lancez `pnpm install` à la racine du projet

### Erreur : TypeScript errors après modification

**Solution :**
1. Recompilez le package : `cd packages/mon-package && npx tsc`
2. Vérifiez que les exports dans `index.ts` sont corrects

### Erreur : Peer dependency conflicts

**Solution :**
1. Vérifiez les `peerDependencies` dans le `package.json` du package
2. Assurez-vous que les versions sont compatibles avec vos apps

## Ressources

- [Documentation pnpm workspaces](https://pnpm.io/workspaces)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)
- [Documentation Next.js](https://nextjs.org/docs)
