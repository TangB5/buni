import React from 'react';
import { useTogglePublish, useToggleFeature } from '../hooks/usePatternActions';
import type { Pattern } from '../types';

interface PatternActionsProps {
  pattern: Pattern;
  onSuccess?: (pattern: Pattern) => void;
  onError?: (error: Error) => void;
}

/**
 * Composant exemple pour démontrer l'usage des hooks
 * avec un toggle pour publish/feature avec loading states et gestion d'erreur
 */
export function PatternActionsExample({ pattern, onSuccess, onError }: PatternActionsProps) {
  const publishToggle = useTogglePublish();
  const featureToggle = useToggleFeature();

  const handleTogglePublish = () => {
    publishToggle.mutate(pattern.id, !pattern.published);
  };

  const handleToggleFeature = () => {
    featureToggle.mutate(pattern.id, !pattern.featured);
  };

  return (
    <div className="space-y-4">
      {/* Bouton Publier/Dépublier */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Status Publication</label>
        <button
          onClick={handleTogglePublish}
          disabled={publishToggle.isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            pattern.published
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {publishToggle.isLoading ? 'Mise à jour...' : pattern.published ? 'Publié' : 'Dépublié'}
        </button>
      </div>

      {/* Bouton Mettre en avant/Retirer */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Mise en avant</label>
        <button
          onClick={handleToggleFeature}
          disabled={featureToggle.isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            pattern.featured
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {featureToggle.isLoading ? 'Mise à jour...' : pattern.featured ? '⭐ En avant' : 'Pas en avant'}
        </button>
      </div>

      {/* Affichage des erreurs */}
      {(publishToggle.isError || featureToggle.isError) && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-medium">Erreur</p>
          <p className="text-sm">
            {publishToggle.error?.message || featureToggle.error?.message || 'Une erreur est survenue'}
          </p>
        </div>
      )}
    </div>
  );
}
