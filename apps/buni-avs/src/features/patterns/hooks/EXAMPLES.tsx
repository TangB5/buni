/**
 * EXEMPLE COMPLET : Utiliser les hooks pour une meilleure UX
 * 
 * Ce fichier montre différentes façons d'utiliser les hooks usePatternActions
 * dans des composants réels.
 */

// ===================================
// ✅ EXEMPLE 1 : Toggle simple
// ===================================

import { useTogglePublish } from '@/features/patterns/hooks/usePatternActions';

export function SimplePublishButton({ patternId, isPublished }) {
  const toggle = useTogglePublish();

  return (
    <button
      onClick={() => toggle.mutate(patternId, !isPublished)}
      disabled={toggle.isLoading}
      className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50"
    >
      {toggle.isLoading ? 'Mise à jour...' : isPublished ? 'Dépublier' : 'Publier'}
    </button>
  );
}

// ===================================
// ✅ EXEMPLE 2 : Avec icon + status
// ===================================

import { Check, Clock } from 'lucide-react';
import { useTogglePublish, useToggleFeature } from '@/features/patterns/hooks/usePatternActions';

export function PatternStatusBadge({ pattern }) {
  const publish = useTogglePublish();
  const feature = useToggleFeature();

  return (
    <div className="flex gap-2 items-center">
      {/* Publish Status */}
      <button
        onClick={() => publish.mutate(pattern.id, !pattern.published)}
        disabled={publish.isLoading}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          pattern.published
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {publish.isLoading ? (
          <Clock className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}
        {pattern.published ? 'Publié' : 'Brouillon'}
      </button>

      {/* Feature Status */}
      <button
        onClick={() => feature.mutate(pattern.id, !pattern.featured)}
        disabled={feature.isLoading}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          pattern.featured
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {feature.isLoading ? (
          <Clock className="w-4 h-4 animate-spin" />
        ) : (
          <span>⭐</span>
        )}
        {pattern.featured ? 'En avant' : 'Normal'}
      </button>
    </div>
  );
}

// ===================================
// ✅ EXEMPLE 3 : Dans un data table (Shadcn)
// ===================================

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export function PatternRowActions({ pattern }) {
  const publish = useTogglePublish();
  const feature = useToggleFeature();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => publish.mutate(pattern.id, !pattern.published)}
          disabled={publish.isLoading}
        >
          {pattern.published ? 'Dépublier' : 'Publier'}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => feature.mutate(pattern.id, !pattern.featured)}
          disabled={feature.isLoading}
        >
          {pattern.featured ? 'Retirer de la mise en avant' : 'Mettre en avant'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ===================================
// ✅ EXEMPLE 4 : Avec toast notifications
// ===================================

import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function PatternActionsWithToast({ pattern }) {
  const { toast } = useToast();
  const publish = useTogglePublish();

  const handlePublish = () => {
    publish.mutate(pattern.id, true, {
      onSuccess: () => {
        toast({
          title: '✓ Succès',
          description: 'Le pattern a été publié',
          variant: 'default',
          duration: 3000,
        });
      },
      onError: (error: any) => {
        toast({
          title: '✗ Erreur',
          description: error?.message || 'Impossible de publier',
          variant: 'destructive',
          duration: 5000,
        });
      },
    });
  };

  return (
    <Button
      onClick={handlePublish}
      disabled={publish.isLoading}
      variant="outline"
    >
      {publish.isLoading ? (
        <>
          <Clock className="w-4 h-4 mr-2 animate-spin" />
          Mise à jour...
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Publier
        </>
      )}
    </Button>
  );
}

// ===================================
// ✅ EXEMPLE 5 : Batch actions
// ===================================

import { useState } from 'react';

export function PatternBatchActions({ selectedPatterns }) {
  const [loading, setLoading] = useState(false);
  const publish = useTogglePublish();

  const publishAll = async () => {
    setLoading(true);
    try {
      await Promise.all(
        selectedPatterns.map((id) =>
          publish.mutateAsync(id, true)
        )
      );
      alert('✓ Tous les patterns ont été publiés');
    } catch (error) {
      alert('✗ Erreur lors de la publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={publishAll} disabled={loading || selectedPatterns.length === 0}>
      {loading ? 'Publication...' : `Publier (${selectedPatterns.length})`}
    </Button>
  );
}

// ===================================
// ✅ EXEMPLE 6 : Composant réutilisable
// ===================================

import { useTogglePublish, useToggleFeature } from '@/features/patterns/hooks/usePatternActions';
import type { Pattern } from '@/features/patterns/types';

interface PatternQuickActionsProps {
  pattern: Pattern;
  onPublishChange?: (isPublished: boolean) => void;
  onFeatureChange?: (isFeatured: boolean) => void;
}

export function PatternQuickActions({
  pattern,
  onPublishChange,
  onFeatureChange,
}: PatternQuickActionsProps) {
  const publish = useTogglePublish();
  const feature = useToggleFeature();

  const handlePublish = () => {
    const newState = !pattern.published;
    publish.mutate(pattern.id, newState);
    onPublishChange?.(newState);
  };

  const handleFeature = () => {
    const newState = !pattern.featured;
    feature.mutate(pattern.id, newState);
    onFeatureChange?.(newState);
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={pattern.published ? 'default' : 'outline'}
        onClick={handlePublish}
        disabled={publish.isLoading}
      >
        {publish.isLoading ? '...' : pattern.published ? '✓ Publié' : '○ Brouillon'}
      </Button>

      <Button
        size="sm"
        variant={pattern.featured ? 'default' : 'outline'}
        onClick={handleFeature}
        disabled={feature.isLoading}
      >
        {feature.isLoading ? '...' : pattern.featured ? '⭐ En avant' : '☆ Normal'}
      </Button>
    </div>
  );
}

// ===================================
// ✅ EXEMPLE 7 : Utilisé dans une page
// ===================================

'use client';

import { usePattern } from '@/features/patterns/hooks/usePatterns';
import { PatternAdminActions } from '@/features/patterns/components/PatternAdminActions';

export default function PatternDetailsPage({ params }: { params: { slug: string } }) {
  const { data: pattern, isLoading } = usePattern(params.slug);

  if (isLoading) return <div>Chargement...</div>;
  if (!pattern) return <div>Pattern non trouvé</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">{pattern.name}</h1>
        <p className="text-gray-600 mt-2">{pattern.summary}</p>
      </div>

      {/* Admin Actions Panel */}
      <PatternAdminActions pattern={pattern} />

      {/* Pattern Content */}
      <div className="prose max-w-none">
        <h2>Histoire</h2>
        <p>{pattern.history}</p>

        <h2>Technique</h2>
        <p>{pattern.technique}</p>
      </div>
    </div>
  );
}

// ===================================
// 💡 TIPS & BEST PRACTICES
// ===================================

/*
✅ DO:
- Utilise useTogglePublish/useToggleFeature pour toggle
- Ajoute des loading states visuels
- Affiche des messages d'erreur clairs
- Utilise les callbacks onSuccess/onError

❌ DON'T:
- N'utilise pas les 4 hooks individuels (trop verbose)
- Ne fais pas de refetch manuel, laisse le hook l'handle
- N'affiche pas les erreurs en console, montre-les à l'utilisateur
- N'oublie pas de disable le bouton pendant le chargement

🎯 CHECKLIST AVANT DE DEPLOYER:
□ Test avec une connexion lente (DevTools > throttle)
□ Test les erreurs réseau (Dev Tools > offline)
□ Vérifier que les states optimistes s'affichent bien
□ Tester le rollback en cas d'erreur
□ Vérifier que les queries sont bien invalidées
*/
