import { create } from 'zustand';
import { CommunityRecipe, RecipeCategory, MotionFilter } from '../types/recipe';
import { COMMUNITY_RECIPES } from '../recipes/communityRecipes';

const STORAGE_KEY = 'pixelmuse_art_library_favorites';

const getInitialFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

interface LibraryStoreState {
  recipes: CommunityRecipe[];
  searchQuery: string;
  selectedCategory: RecipeCategory;
  motionFilter: MotionFilter;
  showFavoritesOnly: boolean;
  favorites: string[];
  activeModalRecipe: CommunityRecipe | null;

  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: RecipeCategory) => void;
  setMotionFilter: (filter: MotionFilter) => void;
  setShowFavoritesOnly: (show: boolean) => void;
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  openModal: (recipe: CommunityRecipe) => void;
  closeModal: () => void;
  resetFilters: () => void;
}

export const useLibraryStore = create<LibraryStoreState>((set, get) => ({
  recipes: COMMUNITY_RECIPES,
  searchQuery: '',
  selectedCategory: 'all',
  motionFilter: 'all',
  showFavoritesOnly: false,
  favorites: getInitialFavorites(),
  activeModalRecipe: null,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setMotionFilter: (motionFilter) => set({ motionFilter }),
  setShowFavoritesOnly: (showFavoritesOnly) => set({ showFavoritesOnly }),

  toggleFavorite: (recipeId: string) => {
    const current = get().favorites;
    const exists = current.includes(recipeId);
    const updated = exists
      ? current.filter((id) => id !== recipeId)
      : [...current, recipeId];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable
    }

    set({ favorites: updated });
  },

  isFavorite: (recipeId: string) => {
    return get().favorites.includes(recipeId);
  },

  openModal: (recipe: CommunityRecipe) => {
    set({ activeModalRecipe: recipe });
  },

  closeModal: () => {
    set({ activeModalRecipe: null });
  },

  resetFilters: () => {
    set({
      searchQuery: '',
      selectedCategory: 'all',
      motionFilter: 'all',
      showFavoritesOnly: false,
    });
  },
}));

