'use client';

// =============================================================================
// Composant — PatternAdminActions
// Actions admin pour gérer un pattern avec toast notifications
// Démontre les meilleures pratiques : optimistic updates + notifications
// =============================================================================

import React from 'react';
import { useTogglePublish, useToggleFeature } from '../hooks/usePatternActions';
import type { Pattern } from '../types';

interface PatternAdminActionsProps {
  pattern: Pattern;
  onActionStart?: () => void;
  onActionComplete?: () => void;
}

/**
 * Composant réutilisable pour les actions admin
 * Utilise les hooks avec states optimistes et feedback utilisateur
 */
export function PatternAdminActions({
  pattern,
  onActionStart,
  onActionComplete,
}: PatternAdminActionsProps) {
  const publishToggle = useTogglePublish();
  const featureToggle = useToggleFeature();

  const handleTogglePublish = async () => {
    onActionStart?.();
    try {
      publishToggle.mutate(pattern.id, !pattern.status);
      // Le callback onSuccess du hook gère l'invalidation des queries
    } finally {
      onActionComplete?.();
    }
  };

  const handleToggleFeature = async () => {
    onActionStart?.();
    try {
      featureToggle.mutate(pattern.id, !pattern.featured);
    } finally {
      onActionComplete?.();
    }
  };

  const isLoading = publishToggle.isLoading || featureToggle.isLoading;
  const hasError = publishToggle.isError || featureToggle.isError;

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Gestion du pattern</h3>
        {isLoading && <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-r-transparent" />}
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Publish Toggle */}
        <button
          onClick={handleTogglePublish}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 font-medium transition-all ${
            pattern.status === 'published'
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={pattern.status === 'published' ? 'Cliquer pour dépublier' : 'Cliquer pour publier'}
        >
          <span>{pattern.status === 'published' ? '✓' : '○'}</span>
          <span className="text-sm">{pattern.status === 'published' ? 'Publié' : 'Brouillon'}</span>
        </button>

        {/* Feature Toggle */}
        <button
          onClick={handleToggleFeature}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 font-medium transition-all ${
            pattern.featured
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={pattern.featured ? 'Cliquer pour retirer la mise en avant' : 'Cliquer pour mettre en avant'}
        >
          <span>{pattern.featured ? '⭐' : '☆'}</span>
          <span className="text-sm">{pattern.featured ? 'En avant' : 'Pas en avant'}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="border-t border-gray-200 pt-3 text-xs text-gray-500">
        <p>Vues : <span className="font-medium text-gray-900">{pattern.views || 0}</span></p>
        <p>Téléchargements : <span className="font-medium text-gray-900">{pattern.downloads || 0}</span></p>
      </div>

      {/* Error Message */}
      {hasError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-medium">Une erreur est survenue</p>
          <p className="mt-1 text-red-600">
            {publishToggle.error?.message || featureToggle.error?.message || 'Veuillez réessayer'}
          </p>
        </div>
      )}

      {/* Last updated */}
      <div className="text-xs text-gray-400">
        Mis à jour le {new Date(pattern.updatedAt || new Date()).toLocaleDateString('fr-FR')}
      </div>
    </div>
  );
}

/**
 * Composant complet avec intégration dashboard
 */
export function PatternDetailsWithActions({ pattern }: { pattern: Pattern }) {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Pattern Info */}
      <div>
        <h1 className="text-2xl font-bold">{pattern.name}</h1>
        <p className="text-gray-600">{pattern.summary}</p>
      </div>

      {/* Admin Panel */}
      <PatternAdminActions
        pattern={pattern}
        onActionStart={() => setIsLoading(true)}
        onActionComplete={() => setIsLoading(false)}
      />

      {/* Pattern Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Type</p>
          <p className="text-gray-900">{pattern.type}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Origine</p>
          <p className="text-gray-900">{pattern.origin?.country || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Ère</p>
          <p className="text-gray-900">{pattern.era || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Licence</p>
          <p className="text-gray-900">{pattern.license || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
