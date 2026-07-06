# @buni/component

Package d'alias pour @buni/ui avec imports simplifiés.

## Installation

```bash
npm install @buni/component
# ou
pnpm add @buni/component
```

## Utilisation

Importez les composants directement avec des noms simples :

```tsx
import { Button, Card, Input, Avatar, Badge } from '@buni/component';

function MyComponent() {
  return (
    <Card>
      <Button variant="primary">Cliquez-moi</Button>
      <Input placeholder="Entrez votre texte" />
      <Avatar />
      <Badge>Badge</Badge>
    </Card>
  );
}
```

## Composants disponibles

Tous les composants de @buni/ui sont disponibles :

- `Button` - Bouton avec variants
- `Card` - Carte conteneur
- `Input` - Champ de saisie
- `Avatar` - Avatar utilisateur
- `Badge` - Badge/étiquette
- `Checkbox` - Case à cocher
- `Dialog` - Modal/Dialogue
- `Select` - Menu déroulant
- `Tabs` - Onglets
- `Accordion` - Accordéon
- `Tooltip` - Infobulle
- `Toast` - Notifications
- `Spinner` - Loader
- `Skeleton` - Skeleton loader
- Et bien plus...

Consultez la documentation de @buni/ui pour plus de détails sur chaque composant.
