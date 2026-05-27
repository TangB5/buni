# Pattern Actions - Guide d'utilisation

Ce guide explique comment utiliser les hooks recommandés pour gérer les actions sur les patterns (publish, unpublish, feature, unfeature) avec une meilleure expérience utilisateur.

## 🎯 Principes

- **Optimistic Updates** : L'UI se met à jour immédiatement sans attendre la réponse du serveur
- **Rollback automatique** : Si l'action échoue, l'UI revient à l'état précédent
- **Cache invalidation** : Les données sont rafraîchies après succès
- **Loading states** : Feedback visuel pendant l'action

## 📦 Hooks disponibles

### 1. Hooks individuels

```typescript
import {
  usePublishPattern,
  useUnpublishPattern,
  useFeaturePattern,
  useUnfeaturePattern,
} from '@/features/patterns/hooks/usePatternActions';

// Utilisation
const publish = usePublishPattern();

await publish.mutate(patternId);
// publish.isPending : booléen si en cours
// publish.isError : booléen si erreur
// publish.error : l'erreur
```

### 2. Hooks de toggle (RECOMMANDÉ)

Pour publish/unpublish ou feature/unfeature, utilisez les hooks de toggle :

```typescript
import { useTogglePublish, useToggleFeature } from '@/features/patterns/hooks/usePatternActions';

// Toggle publish
const publishToggle = useTogglePublish();
publishToggle.mutate(patternId, true);   // Publier
publishToggle.mutate(patternId, false);  // Dépublier

// Toggle feature
const featureToggle = useToggleFeature();
featureToggle.mutate(patternId, true);   // Mettre en avant
featureToggle.mutate(patternId, false);  // Retirer
```

## 💡 Exemples d'utilisation

### Exemple 1 : Bouton toggle simple

```typescript
'use client';

import { useTogglePublish } from '@/features/patterns/hooks/usePatternActions';

export function PublishButton({ patternId, isPublished }: Props) {
  const toggle = useTogglePublish();

  return (
    <button
      onClick={() => toggle.mutate(patternId, !isPublished)}
      disabled={toggle.isLoading}
    >
      {toggle.isLoading ? '...' : isPublished ? 'Publié' : 'Dépublié'}
    </button>
  );
}
```

### Exemple 2 : Avec toast notifications

```typescript
'use client';

import { useTogglePublish } from '@/features/patterns/hooks/usePatternActions';
import { useToast } from '@/components/ui/use-toast'; // ou ta lib (sonner, react-hot-toast, etc)

export function PublishWithNotification({ patternId, isPublished }: Props) {
  const toggle = useTogglePublish();
  const { toast } = useToast();

  const handleToggle = () => {
    toggle.mutate(patternId, !isPublished, {
      onSuccess: () => {
        toast({
          title: isPublished ? 'Dépublié' : 'Publié',
          description: 'Le pattern a été mis à jour',
          variant: 'success',
        });
      },
      onError: (error) => {
        toast({
          title: 'Erreur',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <button onClick={handleToggle} disabled={toggle.isLoading}>
      {toggle.isLoading ? '...' : isPublished ? 'Publié' : 'Dépublié'}
    </button>
  );
}
```

### Exemple 3 : Composant avec plusieurs actions

```typescript
'use client';

import { useTogglePublish, useToggleFeature } from '@/features/patterns/hooks/usePatternActions';
import type { Pattern } from '../types';

export function PatternManagement({ pattern }: { pattern: Pattern }) {
  const publish = useTogglePublish();
  const feature = useToggleFeature();

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => publish.mutate(pattern.id, !pattern.published)}
          disabled={publish.isLoading}
          className={publish.isLoading ? 'opacity-50' : ''}
        >
          {publish.isLoading ? 'Mise à jour...' : pattern.published ? '✓ Publié' : 'Publier'}
        </button>

        <button
          onClick={() => feature.mutate(pattern.id, !pattern.featured)}
          disabled={feature.isLoading}
          className={feature.isLoading ? 'opacity-50' : ''}
        >
          {feature.isLoading ? 'Mise à jour...' : pattern.featured ? '⭐ En avant' : 'Mettre en avant'}
        </button>
      </div>

      {/* Erreurs */}
      {(publish.isError || feature.isError) && (
        <div className="text-red-600 text-sm">
          {publish.error?.message || feature.error?.message}
        </div>
      )}
    </div>
  );
}
```

## 🔄 Flux complet

1. **L'utilisateur clique** sur le bouton
2. **Optimistic update** : L'UI change immédiatement
3. **Requête API** : La mutation est envoyée au serveur
4. **Succès ou Erreur** :
   - ✅ **Succès** : Les queries sont invalidées, les données se rafraîchissent
   - ❌ **Erreur** : L'UI revient à l'état précédent, un message d'erreur est affiché

## ⚙️ Configuration du backend

Assure-toi que ton backend expose ces endpoints :

```
POST /api/v1/patterns/:id/publish      → publie le pattern
POST /api/v1/patterns/:id/unpublish    → dépublie le pattern
POST /api/v1/patterns/:id/feature      → met en avant le pattern
POST /api/v1/patterns/:id/unfeature    → retire la mise en avant
```

Chaque endpoint doit retourner le pattern mis à jour avec les flags `isPublished` et `isFeatured`.

## 🎨 Avec UI (shadcn, tailwind, etc)

```typescript
'use client';

import { useTogglePublish } from '@/features/patterns/hooks/usePatternActions';
import { Button } from '@/components/ui/button'; // ou ton composant
import { Badge } from '@/components/ui/badge';

export function PatternCard({ pattern }) {
  const publish = useTogglePublish();

  return (
    <div className="p-4 border rounded-lg">
      <h3>{pattern.name}</h3>

      {/* Status badges */}
      <div className="flex gap-2 my-3">
        {pattern.published && <Badge>Publié</Badge>}
        {pattern.featured && <Badge variant="secondary">⭐ En avant</Badge>}
      </div>

      {/* Boutons */}
      <Button
        onClick={() => publish.mutate(pattern.id, !pattern.published)}
        disabled={publish.isLoading}
        variant={pattern.published ? 'default' : 'outline'}
        size="sm"
      >
        {publish.isLoading ? 'Mise à jour...' : pattern.published ? 'Dépublier' : 'Publier'}
      </Button>
    </div>
  );
}
```

## 📊 Avantages de cette approche

| Aspect | Bénéfice |
|--------|----------|
| **Optimistic Updates** | L'UI réagit instantanément → meilleure UX |
| **Rollback** | Erreur réseau ? L'UI revient à l'état correct |
| **Cache cohérent** | Les listes et détails sont synchronisés |
| **Réutilisabilité** | Les hooks sont utilisables partout |
| **Type-safe** | TypeScript garanti le type des données |
| **Performance** | Pas d'appels API inutiles |

## 🐛 Débogage

Pour voir ce qui se passe :

```typescript
const toggle = useTogglePublish();

console.log('Est en cours :', toggle.isLoading);
console.log('Erreur :', toggle.error);

// Ajouter des logs dans les mutations
toggle.mutate(id, true, {
  onMutate: () => console.log('Mutation en cours...'),
  onSuccess: () => console.log('✓ Succès'),
  onError: (err) => console.error('✗ Erreur:', err),
});
```

---

💎 **Cette approche est la meilleure pratique pour React avec React Query et offre une expérience utilisateur fluide et résiliente.**
