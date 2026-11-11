import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Sparkles, Sliders, Play, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CommunityRecipe } from '../../types/recipe';
import { RecipeCanvasPreview } from './RecipeCanvasPreview';
import { useLibraryStore, useStudioStore } from '../../stores';
import { Badge } from '../ui';

interface RecipeCardProps {
  recipe: CommunityRecipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, openModal } = useLibraryStore();
  const { loadRecipe } = useStudioStore();

  const favorite = isFavorite(recipe.id);

  const handleApplyToStudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await loadRecipe(recipe);
    navigate(`/studio?recipe=${recipe.id}`);
  };

  const categoryDisplayNames: Record<string, string> = {
    'ascii': 'ASCII',
    'matrix-terminal': 'Matrix & Terminal',
    'geometric': 'Geometric',
    'dithering': 'Dithering',
    'mosaic-pixel': 'Mosaic & Pixels',
    'abstract': 'Abstract',
    'animated-bg': 'Animated Background',
  };

  return (
    <article
      onClick={() => openModal(recipe)}
      className="group relative flex flex-col bg-obsidian-surface border border-obsidian-border hover:border-acid-lime/60 rounded-xs transition-all duration-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1"
    >
      {/* 1. Header Toolbar inside Card */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="pointer-events-auto">
            <Badge variant="outline" size="xs">
              {categoryDisplayNames[recipe.category] || recipe.category.toUpperCase()}
            </Badge>
          </span>

          {recipe.isAnimated && (
            <span className="pointer-events-auto">
              <Badge variant="lime" size="xs">
                <Play className="w-2.5 h-2.5 fill-current" />
                MOTION
              </Badge>
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md border transition-all ${
            favorite
              ? 'bg-acid-lime text-black border-acid-lime shadow-active-lime'
              : 'bg-obsidian-950/80 text-obsidian-muted hover:text-white border-obsidian-border hover:border-obsidian-border-hover'
          }`}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={`w-3.5 h-3.5 ${favorite ? 'fill-black' : ''}`} />
        </button>
      </div>

      {/* 2. Visual Canvas Preview */}
      <div className="relative aspect-[16/11] w-full overflow-hidden border-b border-obsidian-border bg-obsidian-950">
        <RecipeCanvasPreview recipe={recipe} width={340} height={230} />

        {/* Support status pill bottom overlay */}
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
          {recipe.supported ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-obsidian-950/90 border border-green-500/40 text-green-400 font-mono text-2xs uppercase tracking-wider backdrop-blur-sm">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Studio Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-obsidian-950/90 border border-amber-500/40 text-amber-300 font-mono text-2xs uppercase tracking-wider backdrop-blur-sm">
              <AlertTriangle className="w-2.5 h-2.5" />
              Experimental
            </span>
          )}
        </div>
      </div>

      {/* 3. Card Meta Content */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-base font-bold text-white group-hover:text-acid-lime transition-colors tracking-tight line-clamp-1">
              {recipe.name}
            </h3>
            <span className="font-mono text-2xs text-obsidian-muted shrink-0">
              {recipe.creator}
            </span>
          </div>

          <p className="text-xs text-obsidian-muted line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded-xs bg-obsidian-subtle border border-obsidian-border text-obsidian-muted font-mono text-2xs uppercase"
            >
              #{tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-xs bg-obsidian-subtle border border-obsidian-border text-obsidian-muted font-mono text-2xs">
              +{recipe.tags.length - 3}
            </span>
          )}
        </div>

        {/* Actions Footer */}
        <div className="pt-2 border-t border-obsidian-border/60 flex items-center gap-2">
          <button
            type="button"
            onClick={handleApplyToStudio}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xs bg-acid-lime text-black hover:bg-acid-lime-hover font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-active-lime"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            Try This Style
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openModal(recipe);
            }}
            className="p-1.5 rounded-xs bg-obsidian-subtle border border-obsidian-border hover:border-obsidian-border-hover text-obsidian-muted hover:text-white transition-colors"
            title="Inspect Recipe Parameters"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
