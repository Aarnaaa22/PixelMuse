import React from 'react';
import {
  Search,
  Star,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { useLibraryStore } from '../stores';
import { RecipeCard, RecipeModal } from '../components/library';
import { SiteFooter } from '../components/common';
import { Badge } from '../components/ui';
import { RecipeCategory, MotionFilter } from '../types/recipe';

export const ArtLibraryPage: React.FC = () => {
  const {
    recipes,
    searchQuery,
    selectedCategory,
    motionFilter,
    showFavoritesOnly,
    favorites,
    setSearchQuery,
    setSelectedCategory,
    setMotionFilter,
    setShowFavoritesOnly,
    resetFilters,
  } = useLibraryStore();

  const categories: { id: RecipeCategory; label: string }[] = [
    { id: 'all', label: 'All Recipes' },
    { id: 'ascii', label: 'ASCII' },
    { id: 'matrix-terminal', label: 'Matrix & Terminal' },
    { id: 'geometric', label: 'Geometric' },
    { id: 'dithering', label: 'Dithering' },
    { id: 'mosaic-pixel', label: 'Mosaic & Pixels' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'animated-bg', label: 'Animated Backgrounds' },
  ];

  const motionOptions: { id: MotionFilter; label: string }[] = [
    { id: 'all', label: 'All Motion' },
    { id: 'animated', label: 'Animated' },
    { id: 'static', label: 'Static' },
  ];

  // Filtering Logic
  const filteredRecipes = recipes.filter((recipe) => {
    // 1. Category
    if (selectedCategory !== 'all' && recipe.category !== selectedCategory) {
      return false;
    }

    // 2. Motion
    if (motionFilter === 'animated' && !recipe.isAnimated) return false;
    if (motionFilter === 'static' && recipe.isAnimated) return false;

    // 3. Favorites
    if (showFavoritesOnly && !favorites.includes(recipe.id)) return false;

    // 4. Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = recipe.name.toLowerCase().includes(q);
      const matchCreator = recipe.creator.toLowerCase().includes(q);
      const matchDesc = recipe.description.toLowerCase().includes(q);
      const matchTags = recipe.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchCreator && !matchDesc && !matchTags) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-obsidian text-obsidian-heading select-none min-h-screen">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative px-6 pt-12 pb-8 border-b border-obsidian-border bg-gradient-to-b from-obsidian-950 via-obsidian-950 to-obsidian">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <Badge variant="lime" dot>
                  COMMUNITY REGISTRY
                </Badge>
                <span className="font-mono text-xs text-obsidian-muted">
                  SOURCE: 21ST.DEV/COMMUNITY/ASCII
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight">
                THE ART LIBRARY
              </h1>

              <p className="text-sm sm:text-base text-obsidian-muted font-sans leading-relaxed">
                An archival exhibition of community-crafted generative ASCII recipes, reactive particle wakes,
                and volumetric mathematical shaders. Discover curated typographic aesthetics, preview live shaders,
                and port configurations directly into the PixelMuse Studio rasterizer.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 bg-obsidian-surface border border-obsidian-border px-5 py-3 rounded-xs shrink-0 shadow-lg">
              <div className="space-y-0.5 text-center">
                <span className="font-display text-2xl font-black text-acid-lime">
                  {recipes.length}
                </span>
                <p className="font-mono text-2xs text-obsidian-muted uppercase">Cataloged</p>
              </div>
              <div className="h-7 w-px bg-obsidian-border" />
              <div className="space-y-0.5 text-center">
                <span className="font-display text-2xl font-black text-white">
                  {filteredRecipes.length}
                </span>
                <p className="font-mono text-2xs text-obsidian-muted uppercase">Displayed</p>
              </div>
              <div className="h-7 w-px bg-obsidian-border" />
              <div className="space-y-0.5 text-center">
                <span className="font-display text-2xl font-black text-signal-coral">
                  {favorites.length}
                </span>
                <p className="font-mono text-2xs text-obsidian-muted uppercase">Favorites</p>
              </div>
            </div>
          </div>

          {/* 2. SEARCH & DYNAMIC FILTER BAR */}
          <div className="pt-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, creator, tags or shader style..."
                className="w-full bg-obsidian-surface border border-obsidian-border focus:border-acid-lime pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-obsidian-muted focus:outline-none rounded-xs transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-muted hover:text-white font-mono text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Motion & Favorite Toggles */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Motion Segmented Control */}
              <div className="flex items-center bg-obsidian-surface border border-obsidian-border p-0.5 rounded-xs">
                {motionOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMotionFilter(opt.id)}
                    className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${
                      motionFilter === opt.id
                        ? 'bg-acid-lime text-black font-bold shadow-active-lime'
                        : 'text-obsidian-muted hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Favorites Only Toggle */}
              <button
                type="button"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs border text-xs font-mono uppercase tracking-wider transition-all ${
                  showFavoritesOnly
                    ? 'bg-signal-coral/20 border-signal-coral text-signal-coral font-bold'
                    : 'bg-obsidian-surface border-obsidian-border text-obsidian-muted hover:text-white'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-signal-coral' : ''}`} />
                <span>Favorites ({favorites.length})</span>
              </button>

              {/* Reset Filters button if active */}
              {(selectedCategory !== 'all' || motionFilter !== 'all' || showFavoritesOnly || searchQuery) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="p-1.5 rounded-xs bg-obsidian-subtle border border-obsidian-border hover:border-obsidian-border-hover text-obsidian-muted hover:text-white transition-colors"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 3. CATEGORY PILL STRIP */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const count =
                cat.id === 'all'
                  ? recipes.length
                  : recipes.filter((r) => r.category === cat.id).length;

              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xs border text-xs font-mono uppercase tracking-wider shrink-0 transition-all ${
                    isSelected
                      ? 'bg-acid-lime text-black border-acid-lime font-bold shadow-active-lime'
                      : 'bg-obsidian-surface border-obsidian-border text-obsidian-muted hover:text-white hover:border-obsidian-border-hover'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-2xs px-1 rounded-xs ${
                      isSelected ? 'bg-black/20 text-black' : 'bg-obsidian-subtle text-obsidian-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. GALLERY GRID AREA */}
      <section className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="my-16 p-12 max-w-lg mx-auto text-center bg-obsidian-surface border border-obsidian-border rounded-xs space-y-5 shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-acid-lime">
              <Compass className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display text-lg font-bold text-white uppercase">
                No matching recipes found
              </h3>
              <p className="text-xs text-obsidian-muted">
                No community entries matched your current filter or query criteria.
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-acid-lime text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-acid-lime-hover transition-colors shadow-active-lime"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* 5. DETAILED INSPECTION MODAL */}
      <RecipeModal />

      {/* 6. SITE FOOTER */}
      <SiteFooter />
    </div>
  );
};
