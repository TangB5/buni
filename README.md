# Buni — African Visual Ecosystem

**Monorepo NX** · 7 apps Next.js 14 · 9 packages partagés · Radix UI + CVA + Tailwind

## License

This project is licensed under the **Apache License 2.0 with Commons Clause (Non-Commercial)**.

- **Personal & Educational Use**: Free to use, modify, and distribute for personal and educational purposes
- **Non-Commercial**: Commercial use requires explicit written permission from AVS Standard
- **Attribution**: You must include the original license and copyright notice in any redistribution

For the full license text, see the [LICENSE](./LICENSE) file.

## Applications

| App | Rôle | Domaine |
|-----|------|---------|
| `buni-avs` | Standard visuel africain, documentation | avs.buni.africa |
| `buni-icons` | Galerie SVG + CDN | icons.buni.africa |
| `buni-components` | Bibliothèque UI (PrimeReact-style) | ui.buni.africa |
| `buni-templates` | Sections & pages prêtes | templates.buni.africa |
| `buni-drop` | E-commerce artisans | drop.buni.africa |
| `buni-behance` | Portfolio créatifs | behance.buni.africa |
| `buni-mode` | Mode, stylistes, mannequin 3D | mode.buni.africa |

## Packages partagés

| Package | Contenu |
|---------|---------|
| `@buni/ui` | Composants (Button, Badge, Input, Card, Avatar, Spinner, Toggle, Separator) |
| `@buni/tokens` | Design tokens CSS + constantes TypeScript |
| `@buni/patterns` | 13 motifs CSS africains + SVG registry |
| `@buni/icons` | Icônes SVG africaines |
| `@buni/auth` | Zustand store + hooks (useAuth, useLogout) + types Zod |
| `@buni/api` | apiClient Axios + hooks React Query (useGet, usePost, usePatch, useDelete) |
| `@buni/config` | Tailwind preset `buniPreset` partagé |
| `@buni/analytics` | Tracking événements |
| `@buni/utils` | cn(), formatDate(), timeAgo(), slugify(), truncate()… |

## Commandes NX

```bash
# Lancer une app
nx dev buni-avs
nx dev buni-components

# Build
nx build buni-avs
nx affected:build          # Seulement les apps affectées par un changement
nx run-many --target=build # Toutes les apps en parallèle

# Graphe de dépendances
nx graph

# Typecheck global
nx run-many --target=typecheck

# Migration depuis avs-frontend
./tools/migrate-from-avs.sh ../avs-frontend
```

## Utilisation de @buni/ui

```tsx
import { Button, Badge, Input, Card, AvsAvatar, Spinner } from '@buni/ui';
import { cn } from '@buni/utils';
import { useAuth } from '@buni/auth';

// Button — 7 variantes, 5 tailles, Radix Slot
<Button variant="primary" size="lg">Explorer</Button>
<Button variant="kente" isLoading>Chargement…</Button>
<Button asChild><a href="/patterns">Lien</a></Button>

// Badge avec dot
<Badge variant="kente" dot>NDOP</Badge>

// Input avec icône et erreur
<Input label="Email" leftIcon={<Mail size={14} />} error="Format invalide" />

// Avatar avec motif selon le rôle
<AvsAvatar name="Njoya H." role="admin" size="lg" />
```

## Ajouter une nouvelle app

```bash
nx generate @nx/next:application --name="buni-ma-app" --directory="apps/buni-ma-app" --appDir=true --src=true --style=none --no-interactive
```

Puis copier `tailwind.config.ts`, `tsconfig.json`, `postcss.config.mjs` d'une app existante.
