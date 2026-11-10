import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Star,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { useLibraryStore, useStudioStore } from '../../stores';
import { RecipeCanvasPreview } from './RecipeCanvasPreview';
import { createSamplePhotoImage } from '../../utilities/samplePhotos';
import { Badge } from '../ui';

export const RecipeModal: React.FC = () => {
  const navigate = useNavigate();
  const { activeModalRecipe, closeModal, toggleFavorite, isFavorite } = useLibraryStore();
  const { updateConfig, setMode, setProjectName, sourceImage, setSourceImage } = useStudioStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  if (!activeModalRecipe) return null;

  const recipe = activeModalRecipe;
  const favorite = isFavorite(recipe.id);

  const handleOpenInStudio = async () => {
    if (recipe.config.mode) {
      setMode(recipe.config.mode);
    }
    updateConfig(recipe.config);
    setProjectName(recipe.name.toUpperCase().replace(/\s+/g, '_'));

    if (!sourceImage) {
      try {
        const sample = await createSamplePhotoImage('marble-sculpture');
        setSourceImage(sample, {
          name: 'marble-sculpture.png',
          width: 640,
          height: 640,
          aspectRatio: 1,
          sizeBytes: 120000,
        });
      } catch (err) {
        console.error('Failed to load sample image for studio', err);
      }
    }

    closeModal();
    navigate('/studio');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={closeModal}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl bg-obsidian-surface border border-obsidian-border rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-obsidian-border bg-obsidian-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="lime" dot>
              RECIPE INSPECTOR
            </Badge>
            <span className="font-mono text-xs text-obsidian-muted">
              ID: {recipe.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(recipe.id)}
              className={`p-1.5 rounded-full border transition-all ${
                favorite
                  ? 'bg-acid-lime text-black border-acid-lime shadow-active-lime'
                  : 'bg-obsidian-subtle text-obsidian-muted hover:text-white border-obsidian-border'
              }`}
              title={favorite ? 'Remove Favorite' : 'Save to Favorites'}
            >
              <Star className={`w-4 h-4 ${favorite ? 'fill-black' : ''}`} />
            </button>

            <button
              type="button"
              onClick={closeModal}
              className="p-1.5 text-obsidian-muted hover:text-white rounded-xs hover:bg-obsidian-subtle transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Live Interactive Canvas Preview */}
          <div className="flex flex-col space-y-3">
            <div className="relative aspect-square w-full rounded-xs overflow-hidden border border-obsidian-border bg-obsidian-950 shadow-inner">
              <RecipeCanvasPreview
                recipe={recipe}
                interactive={true}
                width={480}
                height={480}
              />
            </div>

            <div className="flex items-center justify-between text-2xs font-mono text-obsidian-muted px-1">
              <span>CANVAS_OUTPUT: 480 × 480 PX</span>
              <span className="text-acid-lime flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-acid-lime animate-pulse" />
                LIVE INTERACTIVE SHADER
              </span>
            </div>
          </div>

          {/* Right Column: Recipe Attributes & Architecture */}
          <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-black text-white tracking-tight uppercase">
                  {recipe.name}
                </h2>
                <p className="font-mono text-xs text-acid-lime mt-0.5">
                  Curated by {recipe.creator}
                </p>
              </div>

              <p className="text-sm text-obsidian-muted leading-relaxed">
                {recipe.description}
              </p>

              {/* Supported vs Unsupported Architectural Breakdown */}
              <div
                className={`p-4 rounded-xs border text-xs font-mono leading-relaxed ${
                  recipe.supported
                    ? 'bg-green-950/20 border-green-500/40 text-green-300'
                    : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold uppercase mb-1.5">
                  {recipe.supported ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      <span>Studio Ready & Fully Supported</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Experimental Engine Architecture</span>
                    </>
                  )}
                </div>
                <p>
                  {recipe.supported
                    ? `This recipe maps 100% to PixelMuse's native modular renderer [${recipe.config.mode}]. Applying it will execute instantly in Studio with full parameter controls.`
                    : recipe.missingFeatureNote ||
                      'Requires specialized WebGL or mathematical projection shaders identified in the PixelMuse engine roadmap.'}
                </p>
              </div>

              {/* Key Parameters */}
              <div className="space-y-2">
                <span className="font-mono text-2xs uppercase tracking-wider text-obsidian-muted flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-electric-violet" />
                  Key Parameter Knobs
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.keyParameters.map((param) => (
                    <span
                      key={param}
                      className="px-2 py-1 rounded-xs bg-obsidian-subtle border border-obsidian-border text-white font-mono text-xs"
                    >
                      {param}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <span className="font-mono text-2xs uppercase tracking-wider text-obsidian-muted flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-signal-coral" />
                  Catalog Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-xs bg-obsidian-subtle border border-obsidian-border text-obsidian-muted font-mono text-2xs uppercase"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-obsidian-border flex items-center gap-3">
              <button
                type="button"
                onClick={handleOpenInStudio}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xs bg-acid-lime hover:bg-acid-lime-hover text-black font-mono text-xs font-black uppercase tracking-wider transition-colors shadow-active-lime"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                Open In Studio
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-3 rounded-xs bg-obsidian-subtle border border-obsidian-border text-obsidian-muted hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
