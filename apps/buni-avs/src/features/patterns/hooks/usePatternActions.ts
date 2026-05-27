'use client';

// =============================================================================
// Hook — usePatternActions
// Gère les actions sur les patterns avec optimistic updates et notifications
// - publish / unpublish
// - feature / unfeature
// - Gestion automatique des queries
// =============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Pattern } from '../types';
import { patternService, PatternServiceError } from '../services/pattern.service';
import { patternKeys } from './usePatterns';

/**
 * Hook pour publier/dépublier un pattern
 * Mise à jour optimiste + invalidation de cache
 */
export function usePublishPattern() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return patternService.publish(id);
    },
    onMutate: async (id) => {
      // Annuler les requêtes en cours
      await qc.cancelQueries({ queryKey: patternKeys.all });

      // Sauvegarder l'état précédent
      const previousPatterns = qc.getQueryData<Pattern[]>(patternKeys.all);

      // Mise à jour optimiste
      qc.setQueryData(patternKeys.all, (old: Pattern[] | undefined) =>
        old?.map((p) =>
          p.id === id ? { ...p, isPublished: true, updatedAt: new Date().toISOString() } : p
        )
      );

      return { previousPatterns };
    },
    onError: (_err, _id, context) => {
      // Rollback en cas d'erreur
      if (context?.previousPatterns) {
        qc.setQueryData(patternKeys.all, context.previousPatterns);
      }
    },
    onSuccess: () => {
      // Invalider les queries pour forcer un refetch
      void qc.invalidateQueries({ queryKey: patternKeys.all });
      void qc.invalidateQueries({ queryKey: patternKeys.featured() });
    },
  });
}

/**
 * Hook pour dépublier un pattern
 */
export function useUnpublishPattern() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return patternService.unpublish(id);
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: patternKeys.all });
      const previousPatterns = qc.getQueryData<Pattern[]>(patternKeys.all);

      qc.setQueryData(patternKeys.all, (old: Pattern[] | undefined) =>
        old?.map((p) =>
          p.id === id ? { ...p, isPublished: false, updatedAt: new Date().toISOString() } : p
        )
      );

      return { previousPatterns };
    },
    onError: (_err, _id, context) => {
      if (context?.previousPatterns) {
        qc.setQueryData(patternKeys.all, context.previousPatterns);
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: patternKeys.all });
      void qc.invalidateQueries({ queryKey: patternKeys.featured() });
    },
  });
}

/**
 * Hook pour mettre en avant un pattern
 */
export function useFeaturePattern() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return patternService.feature(id);
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: patternKeys.all });
      const previousPatterns = qc.getQueryData<Pattern[]>(patternKeys.all);

      qc.setQueryData(patternKeys.all, (old: Pattern[] | undefined) =>
        old?.map((p) =>
          p.id === id ? { ...p, isFeatured: true, updatedAt: new Date().toISOString() } : p
        )
      );

      return { previousPatterns };
    },
    onError: (_err, _id, context) => {
      if (context?.previousPatterns) {
        qc.setQueryData(patternKeys.all, context.previousPatterns);
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: patternKeys.all });
      void qc.invalidateQueries({ queryKey: patternKeys.featured() });
    },
  });
}

/**
 * Hook pour retirer la mise en avant d'un pattern
 */
export function useUnfeaturePattern() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return patternService.unfeature(id);
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: patternKeys.all });
      const previousPatterns = qc.getQueryData<Pattern[]>(patternKeys.all);

      qc.setQueryData(patternKeys.all, (old: Pattern[] | undefined) =>
        old?.map((p) =>
          p.id === id ? { ...p, isFeatured: false, updatedAt: new Date().toISOString() } : p
        )
      );

      return { previousPatterns };
    },
    onError: (_err, _id, context) => {
      if (context?.previousPatterns) {
        qc.setQueryData(patternKeys.all, context.previousPatterns);
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: patternKeys.all });
      void qc.invalidateQueries({ queryKey: patternKeys.featured() });
    },
  });
}

/**
 * Hook composé pour toggle publish/unpublish
 * Utilité : Au lieu de 2 hooks, un seul qui fait les 2
 */
export function useTogglePublish() {
  const publish = usePublishPattern();
  const unpublish = useUnpublishPattern();

  return {
    mutate: (id: string, shouldPublish: boolean) => {
      if (shouldPublish) {
        return publish.mutate(id);
      } else {
        return unpublish.mutate(id);
      }
    },
    isLoading: publish.isPending || unpublish.isPending,
    isError: publish.isError || unpublish.isError,
    error: publish.error || unpublish.error,
  };
}

/**
 * Hook composé pour toggle feature/unfeature
 */
export function useToggleFeature() {
  const feature = useFeaturePattern();
  const unfeature = useUnfeaturePattern();

  return {
    mutate: (id: string, shouldFeature: boolean) => {
      if (shouldFeature) {
        return feature.mutate(id);
      } else {
        return unfeature.mutate(id);
      }
    },
    isLoading: feature.isPending || unfeature.isPending,
    isError: feature.isError || unfeature.isError,
    error: feature.error || unfeature.error,
  };
}
