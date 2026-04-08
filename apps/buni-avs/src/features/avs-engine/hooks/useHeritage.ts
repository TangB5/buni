'use client';
import { useEffect, useCallback } from 'react';
import { useAvsEngineStore } from '../store/useAvsEngineStore';
import { get } from '@/core/api/client';
import type { HeritagePiece } from '../types';

export function useHeritage() {
  const { pieces, selected, isLoading, error, setPieces, setLoading, setError,
          selectPiece, clearSelection, filteredPieces } = useAvsEngineStore();

  const fetchPieces = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await get<HeritagePiece[]>('/heritage');
      setPieces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setPieces]);

  useEffect(() => { void fetchPieces(); }, [fetchPieces]);

  return { pieces, selected, isLoading, error, selectPiece, clearSelection,
           filteredPieces: filteredPieces(), refetch: fetchPieces };
}
