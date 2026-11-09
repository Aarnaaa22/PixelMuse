import { create } from 'zustand';
import { ArtPreset } from '../types';
import { CURATED_PRESETS } from '../presets/curatedPresets';

export { CURATED_PRESETS };

interface ExploreState {
  presets: ArtPreset[];
  selectedCategory: string;
  searchQuery: string;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
}

export const useExploreStore = create<ExploreState>((set) => ({
  presets: CURATED_PRESETS,
  selectedCategory: 'all',
  searchQuery: '',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));

