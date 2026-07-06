# @buni/icons

Bibliothèque d'icônes AVS avec imports simples. Deux modes d'utilisation : composants React ou classes CSS.

## Installation

```bash
npm install @buni/icons
# ou
pnpm add @buni/icons
```

## Utilisation avec classes CSS (recommandé)

Importez le CSS et utilisez des classes simples :

```tsx
import '@buni/icons/icons.css';

function MyComponent() {
  return (
    <div>
      <i className="avs avs-person avs-lg"></i>
      <i className="avs avs-settings avs-md text-avs-primary"></i>
      <i className="avs avs-home"></i>
      <i className="avs avs-search"></i>
    </div>
  );
}
```

### Classes disponibles

- `avs` - Classe de base (obligatoire)
- `avs-person` - Icône personne
- `avs-settings` - Icône paramètres
- `avs-home` - Icône maison
- `avs-search` - Icône recherche

### Tailles

- `avs-sm` - 0.875rem
- `avs-md` - 1rem (défaut)
- `avs-lg` - 1.25rem
- `avs-xl` - 1.5rem
- `avs-2xl` - 2rem

## Utilisation avec composants React

Importez les composants React directement :

```tsx
import { Avs, AvsPerson, AvsSettings, AvsHome, AvsSearch } from '@buni/icons';

function MyComponent() {
  return (
    <div>
      <Avs className="w-6 h-6" />
      <AvsPerson className="w-8 h-8 text-avs-primary" />
      <AvsSettings />
      <AvsHome />
      <AvsSearch />
    </div>
  );
}
```

## Icônes disponibles

- `Avs` / `avs` - Icône principale AVS
- `AvsPerson` / `avs-person` - Icône personne
- `AvsSettings` / `avs-settings` - Icône paramètres
- `AvsHome` / `avs-home` - Icône maison
- `AvsSearch` / `avs-search` - Icône recherche

## Comparaison des approches

| Approche | Avantages | Cas d'usage |
|----------|-----------|-------------|
| **Classes CSS** | Plus léger, pas de JS, compatible HTML pur | Sites statiques, emails, performance |
| **Composants React** | Props TypeScript, contrôle fin, animable | Apps React complexes, interactives |
