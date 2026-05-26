import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AvsEngineState, HeritagePiece } from '../types';
import type { AvsPatternType } from '../../../core/constants/avs';

interface AvsEngineActions {
  setPieces:       (pieces: HeritagePiece[]) => void;
  selectPiece:     (id: string) => void;
  clearSelection:  () => void;
  setLoading:      (loading: boolean) => void;
  setError:        (error: string | null) => void;
  setSearchQuery:  (query: string) => void;
  setFilter:       (filter: AvsPatternType | 'all') => void;
  filteredPieces:  () => HeritagePiece[];
  reset:           () => void;
}

const initialState: AvsEngineState = {
  pieces: [], selected: null, isLoading: false,
  error: null, searchQuery: '', activeFilter: 'all',
};

export const useAvsEngineStore = create<AvsEngineState & AvsEngineActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setPieces:      (pieces) => set({ pieces }, false, 'avs/setPieces'),
        selectPiece:    (id)     => set({ selected: get().pieces.find(p => p.id === id) ?? null }, false, 'avs/selectPiece'),
        clearSelection: ()       => set({ selected: null }, false, 'avs/clearSelection'),
        setLoading:     (isLoading) => set({ isLoading }, false, 'avs/setLoading'),
        setError:       (error)     => set({ error }, false, 'avs/setError'),
        setSearchQuery: (searchQuery) => set({ searchQuery }, false, 'avs/setSearch'),
        setFilter:      (activeFilter) => set({ activeFilter }, false, 'avs/setFilter'),
        reset:          ()       => set(initialState, false, 'avs/reset'),

        filteredPieces: () => {
          const { pieces, searchQuery, activeFilter } = get();
          return pieces.filter(p => {
            const matchesFilter = activeFilter === 'all' || p.patternType === activeFilter;
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q
              || p.title.fr.toLowerCase().includes(q)
              || p.title.en.toLowerCase().includes(q)
              || p.description.fr.toLowerCase().includes(q);
            return matchesFilter && matchesSearch;
          });
        },
      }),
      { name: 'avs-engine-store', partialize: (s) => ({ activeFilter: s.activeFilter }) }
    ),
    { name: 'AVS Engine' }
  )
);
