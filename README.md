# Buni

Buni est un monorepo NX pour l’écosystème African Visual System (AVS). Il contient une application Next.js, des packages réutilisables et des services backend modulaires.

## À propos

- Monorepo géré par **Nx**
- Application principale : **Next.js 16**
- Langage : **TypeScript**
- Style : **Tailwind CSS v4**
- UI : **Radix UI**, **CVA**, **Lucide React**
- Package manager : **pnpm**

## Structure du dépôt

- `apps/buni-avs/` : application Next.js principale et site de documentation AVS
- `packages/` : bibliothèques partagées
  - `@buni/analytics`
  - `@buni/api`
  - `@buni/auth`
  - `@buni/component`
  - `@buni/config`
  - `@buni/i18n`
  - `@buni/icons`
  - `@buni/patterns`
  - `@buni/theme`
  - `@buni/tokens`
  - `@buni/ui`
  - `@buni/utils`
- `services/` : services backend
  - `api-gateway`
  - `media-service`
  - `search-service`
- `tools/` : scripts utilitaires, par exemple la migration depuis `avs-frontend`

## Prérequis

- Node.js 20+ recommandé
- pnpm 10+
- Git

## Installation

```bash
pnpm install
```

## Commandes principales

### Développement

```bash
nx dev buni-avs
```

### Build

```bash
nx build buni-avs
```

### Lint

```bash
nx lint buni-avs
```

### Typecheck global

```bash
nx run-many --target=typecheck
```

### Build affecté

```bash
nx affected:build
```

### Graphe de dépendances

```bash
nx graph
```

## Bonnes pratiques

- Travaillez sur la branche `main` ou une branche de fonctionnalité dédiée
- Utilisez `pnpm nx affected:*` pour exécuter uniquement les tâches concernées par les changements
- Pour une nouvelle app ou un nouveau package, créez le projet avec Nx puis copiez la configuration d’une app existante

## Exemple d’utilisation de `@buni/ui`

```tsx
import { Button, Badge, Input, Card, AvsAvatar, Spinner } from '@buni/ui';
import { cn } from '@buni/utils';
import { useAuth } from '@buni/auth';

<Button variant="primary" size="lg">Explorer</Button>
<Badge variant="kente" dot>NDOP</Badge>
<Input label="Email" leftIcon={<Mail size={14} />} error="Format invalide" />
<AvsAvatar name="Njoya H." role="admin" size="lg" />
```

## Ajouter une nouvelle application

```bash
nx generate @nx/next:application --name="buni-ma-app" --directory="apps/buni-ma-app" --appDir=true --src=true --style=none --no-interactive
```

Ensuite, copiez les fichiers de configuration d’une app existante :
- `tailwind.config.ts`
- `tsconfig.json`
- `postcss.config.mjs`

## Licence

Ce dépôt est distribué sous la licence **Apache License 2.0**.
Voir le fichier [LICENSE](./LICENSE) pour le texte complet.
