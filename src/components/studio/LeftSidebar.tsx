import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  Sparkles,
  Grid3X3,
  Layers,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  Star,
  Check,
  Image as ImageIcon,
  Plus,
  Search,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { Button, Badge } from '../ui';
import { useStudioStore, useAuthStore } from '../../stores';
import { CURATED_PRESETS } from '../../presets/curatedPresets';
import { COMMUNITY_RECIPES } from '../../recipes/communityRecipes';
import { useImageDrop } from '../../hooks';
import { SAMPLE_PHOTOS, createSamplePhotoImage } from '../../utilities/samplePhotos';
import { SidebarTab } from '../../types/studio';
import { RenderMode } from '../../types';
import { cn } from '../../utilities';

interface LeftSidebarProps {
  className?: string;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { onFileInputChange } = useImageDrop();

  const {
    activeSidebarTab,
    setActiveSidebarTab,
    images,
    activeImageId,
    selectImage,
    removeImage,
    sourceImage,
    imageMetadata,
    setSourceImage,
    clearImage,
    resetViewport,
    setIsImageLoading,
    setUploadError,
    config,
    setMode,
    updateConfig,
    layers,
    toggleLayerVisibility,
    setLayerOpacity,
    pushHistory,
    activeRecipeId,
    loadRecipe,
    resetToRecipeDefaults,
  } = useStudioStore();

  const { isPresetFavorited, toggleFavoritePreset } = useAuthStore();
  const [presetToast, setPresetToast] = useState<string | null>(null);
  const [presetFilter, setPresetFilter] = useState<'all' | 'favorites'>('all');
  const [presetSource, setPresetSource] = useState<'recipes' | 'curated'>('recipes');
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeCategory, setRecipeCategory] = useState('all');

  const tabs: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
    { id: 'upload', label: 'Upload', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'presets', label: 'Presets', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'modes', label: 'Modes', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'layers', label: 'Layers', icon: <Layers className="w-4 h-4" /> },
  ];

  const handleSelectSample = async (sampleId: string) => {
    try {
      setIsImageLoading(true);
      const sample = SAMPLE_PHOTOS.find((s) => s.id === sampleId) || SAMPLE_PHOTOS[0];
      const img = await createSamplePhotoImage(sampleId);
      setSourceImage(img, {
        name: `${sample.name.toLowerCase().replace(/\s+/g, '-')}.png`,
        width: sample.width,
        height: sample.height,
        sizeBytes: 256 * 1024,
        aspectRatio: sample.width / sample.height,
      });
    } catch (err: any) {
      console.error('[PixelMuse Sample Load Error]:', err);
      setUploadError(`Failed to load sample photograph: ${err?.message || 'Decoding error'}`);
    } finally {
      setIsImageLoading(false);
    }
  };

  const [modesCategoryFilter, setModesCategoryFilter] = React.useState<string>('all');

  const renderModesList: {
    id: RenderMode;
    name: string;
    category: 'character' | 'geometric' | 'pixel' | 'pattern' | 'special' | 'retro';
    tag: string;
    desc: string;
  }[] = [
    // Source / Default
    {
      id: 'original',
      name: 'Original Photograph',
      category: 'special',
      tag: 'PRISTINE RAW VIEW',
      desc: 'Default unmodified photograph view. Displays your picture exactly as originally uploaded before applying generative styles.',
    },
    // Character Based
    {
      id: 'ascii',
      name: 'ASCII Glyph',
      category: 'character',
      tag: 'LINGUISTIC RASTER',
      desc: 'Renders characters according to image brightness using customizable glyph ramps.',
    },
    // Geometric
    {
      id: 'mosaic',
      name: 'Mosaic',
      category: 'geometric',
      tag: 'COLORED RECTANGLES',
      desc: 'Renders each sampled cell as a colored rectangle with coverage control.',
    },
    {
      id: 'dots',
      name: 'Dots',
      category: 'geometric',
      tag: 'CIRCULAR HALFTONE',
      desc: 'Renders circular dots whose diameter and scale vary with local luminance.',
    },
    {
      id: 'crosses',
      name: 'Crosses',
      category: 'geometric',
      tag: 'GEOMETRIC CROSSES',
      desc: 'Renders sharp geometric crosshairs scaled by cell brightness and coverage.',
    },
    {
      id: 'diamonds',
      name: 'Diamonds',
      category: 'geometric',
      tag: 'ROTATED RHOMBUS',
      desc: 'Diamond polygons scaled proportionally to local luminance.',
    },
    {
      id: 'hexagons',
      name: 'Hexagons',
      category: 'geometric',
      tag: '6-SIDED POLYGONS',
      desc: 'Hexagonal tessellation cells with luminance-scaled aperture.',
    },
    {
      id: 'triangles',
      name: 'Triangles',
      category: 'geometric',
      tag: 'ALTERNATING TILES',
      desc: 'Alternating upward and downward triangular mesh cells.',
    },
    {
      id: 'rings',
      name: 'Rings',
      category: 'geometric',
      tag: 'CONCENTRIC CIRCLES',
      desc: 'Concentric linocut rings with stroke thickness modulated by brightness.',
    },
    {
      id: 'hearts',
      name: 'Hearts',
      category: 'geometric',
      tag: 'PARAMETRIC GLYPHS',
      desc: 'Smooth bezier curve heart glyphs responsive to cell brightness.',
    },
    {
      id: 'stars',
      name: 'Stars',
      category: 'geometric',
      tag: '5-POINTED STARS',
      desc: 'Geometric 5-pointed star polygons scaled by luminance.',
    },
    {
      id: 'bubbles',
      name: 'Bubbles',
      category: 'geometric',
      tag: 'SPECULAR SPHERES',
      desc: 'Glassy translucent spherical bubbles with 3D specular highlight reflections.',
    },
    {
      id: 'hatch',
      name: 'Hatch',
      category: 'geometric',
      tag: 'CROSS-HATCH ENGRAVING',
      desc: 'Directional cross-hatch strokes simulating fine printmaker engravings.',
    },
    {
      id: 'contour',
      name: 'Contour',
      category: 'geometric',
      tag: 'TOPOGRAPHIC ISO-LINES',
      desc: 'Concentric topographic elevation contours reflecting local brightness.',
    },
    // Pixel Based
    {
      id: 'pixel',
      name: 'Pixel',
      category: 'pixel',
      tag: 'PIXELATED IMAGE',
      desc: 'Renders crisp continuous pixel blocks using average sampled colors.',
    },
    {
      id: 'halfblocks',
      name: 'Halfblocks',
      category: 'pixel',
      tag: 'TERMINAL ▀ / ▄',
      desc: 'Sub-samples top and bottom halves for 2x vertical pixel resolution.',
    },
    {
      id: 'braille',
      name: 'Braille',
      category: 'pixel',
      tag: 'UNICODE 2×4 MATRIX',
      desc: 'Samples 8 sub-pixel threshold dots mapped to Unicode Braille glyphs.',
    },
    // Pattern Based
    {
      id: 'diagonal-lines',
      name: 'Diagonal Lines',
      category: 'pattern',
      tag: '45° LINE GRATING',
      desc: 'Diagonal line grating with thickness modulated by local luminance.',
    },
    {
      id: 'lines',
      name: 'Lines',
      category: 'pattern',
      tag: 'INTERLOCKING GRATE',
      desc: 'Horizontal and vertical scanlines creating a structural CRT raster.',
    },
    {
      id: 'mixed-patterns',
      name: 'Mixed Patterns',
      category: 'pattern',
      tag: 'TIERED MICRO-TEXTURES',
      desc: 'Generative mix of stipple dots, diagonal slashes, diamonds, and grids.',
    },
    {
      id: 'voxels',
      name: 'Voxels',
      category: 'pattern',
      tag: 'ISOMETRIC 3D RELIEF',
      desc: 'Pseudo-3D isometric cubes with shaded top, left, and right faces.',
    },
    {
      id: 'lego',
      name: 'Lego Bricks',
      category: 'pattern',
      tag: 'PLASTIC BRICK STUDS',
      desc: 'Plastic construction blocks with raised circular studs and drop shadows.',
    },
    // Special
    {
      id: 'original',
      name: 'Original (Raw Sensor)',
      category: 'special',
      tag: 'PRISTINE SOURCE',
      desc: 'Displays the original un-rasterized photograph with accurate Rec.709 color fidelity.',
    },
    {
      id: 'matrix-rain',
      name: 'Matrix Rain',
      category: 'special',
      tag: 'KATAKANA CODE STREAM',
      desc: 'Animated vertical falling Katakana code rain modulated by luminance.',
    },
    {
      id: 'hexdump',
      name: 'Hexdump',
      category: 'special',
      tag: '00-FF BYTE DUMP',
      desc: 'Terminal hexadecimal byte pairs derived from cell RGB brightness.',
    },
    {
      id: 'disco',
      name: 'Disco Ball',
      category: 'special',
      tag: 'FACETED SHIMMER',
      desc: 'Faceted mirror tiles with dynamic chromatic reflection waves.',
    },
    // Retro
    {
      id: 'dither',
      name: 'Ordered Dither',
      category: 'retro',
      tag: '1-BIT BAYER / ATKINSON',
      desc: 'Iconic computing heritage: 8x8 Bayer matrices and Atkinson error diffusion.',
    },
  ];

  return (
    <aside
      className={cn(
        'w-80 h-full bg-obsidian-surface border-r border-obsidian-border flex flex-col z-20 overflow-hidden select-none',
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Top Tab Bar */}
      <div className="grid grid-cols-4 p-1.5 bg-obsidian-950 border-b border-obsidian-border gap-1">
        {tabs.map((tab) => {
          const isActive = activeSidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSidebarTab(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-1 rounded-xs transition-colors border text-center cursor-pointer',
                isActive
                  ? 'bg-obsidian-surface border-acid-lime/50 text-white shadow-crisp-border'
                  : 'border-transparent text-obsidian-muted hover:text-white hover:bg-obsidian-subtle/40'
              )}
            >
              <span className={cn('mb-1 transition-colors', isActive ? 'text-acid-lime' : '')}>
                {tab.icon}
              </span>
              <span className="font-mono text-2xs uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* TAB 1: UPLOAD */}
        {activeSidebarTab === 'upload' && (
          <div className="space-y-6">
            {/* Upload Action Card */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-obsidian-border hover:border-acid-lime/60 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group bg-obsidian-950"
            >
              <div className="w-10 h-10 rounded-xs bg-obsidian-subtle border border-obsidian-border flex items-center justify-center text-obsidian-muted group-hover:text-acid-lime mb-3 transition-colors">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs uppercase text-white font-medium tracking-wide">
                Drop Photograph Here
              </span>
              <span className="font-mono text-2xs text-obsidian-muted mt-1">
                PNG, JPEG, WebP up to 40MB
              </span>

              <div className="mt-4">
                <Button variant="secondary" size="xs">
                  Browse Files
                </Button>
              </div>
            </div>

            {/* Uploaded Photographs Library */}
            {images.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                      PHOTOGRAPHS
                    </span>
                    <Badge variant="lime" size="xs">
                      {images.length}
                    </Badge>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="font-mono text-[10px] uppercase text-acid-lime hover:underline flex items-center gap-1"
                    title="Upload an additional photograph"
                  >
                    <Plus className="w-3 h-3" />
                    Add Photo
                  </button>
                </div>

                <div className="space-y-2">
                  {images.map((img) => {
                    const isActive = img.id === activeImageId;
                    return (
                      <div
                        key={img.id}
                        onClick={() => {
                          if (!isActive) {
                            selectImage(img.id);
                          } else {
                            resetViewport();
                          }
                        }}
                        className={cn(
                          "p-2.5 flex items-center gap-3 cursor-pointer transition-all duration-150 rounded-xs group relative",
                          isActive
                            ? "border-2 border-acid-lime bg-acid-lime/10 shadow-[0_0_15px_rgba(204,255,0,0.12)] ring-1 ring-acid-lime/50"
                            : "border border-obsidian-border hover:border-obsidian-text/80 bg-obsidian-subtle/60 hover:bg-obsidian-subtle"
                        )}
                        title={isActive ? "Active image (Click to center)" : "Click to set as active image"}
                      >
                        {/* Thumbnail Preview */}
                        <div className="w-14 h-14 rounded-xs overflow-hidden border border-obsidian-border bg-obsidian flex-shrink-0 relative">
                          {img.thumbnailUrl ? (
                            <img
                              src={img.thumbnailUrl}
                              alt={img.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-obsidian-muted">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                          {isActive && (
                            <div className="absolute top-1 left-1 bg-acid-lime text-black rounded-full p-0.5 shadow">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* Metadata Details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={cn(
                                "font-mono text-xs font-semibold truncate block",
                                isActive ? "text-white group-hover:text-acid-lime" : "text-obsidian-text group-hover:text-white"
                              )}
                              title={img.name}
                            >
                              {img.name}
                            </span>
                            {isActive && (
                              <Badge variant="lime" dot size="xs" className="flex-shrink-0">
                                ACTIVE
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[10px] text-obsidian-muted">
                            <span>
                              {img.width} × {img.height} PX
                            </span>
                            <span>•</span>
                            <span>RATIO: {img.aspectRatio.toFixed(2)}</span>
                          </div>

                          {!isActive && (
                            <span className="font-mono text-[9px] uppercase tracking-wider text-obsidian-muted/80 group-hover:text-acid-lime transition-colors block">
                              Click to activate →
                            </span>
                          )}
                        </div>

                        {/* Actions: Remove */}
                        <div className="flex flex-col items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(img.id);
                            }}
                            className="p-1 text-obsidian-muted hover:text-signal-coral rounded-xs hover:bg-obsidian-950 transition-colors"
                            title="Remove photograph"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Single Active Fallback (if image loaded without library registration) */}
            {sourceImage && imageMetadata && images.length === 0 && (
              <div
                onClick={() => resetViewport()}
                className="border-2 border-acid-lime bg-acid-lime/10 p-3 space-y-2 cursor-pointer transition-all duration-150 rounded-xs group ring-1 ring-acid-lime/50"
                title="Active photograph (Click to center)"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="lime" dot size="xs">
                    ACTIVE PHOTOGRAPH
                  </Badge>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="text-obsidian-muted hover:text-signal-coral p-1 -mr-1"
                    title="Remove photograph"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-14 h-14 rounded-xs overflow-hidden border border-obsidian-border bg-obsidian flex-shrink-0">
                    <img
                      src={'src' in sourceImage ? sourceImage.src : (sourceImage as HTMLCanvasElement).toDataURL()}
                      alt={imageMetadata.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="font-mono text-xs text-white truncate font-medium">
                      {imageMetadata.name}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-2xs text-obsidian-muted">
                      <span>{imageMetadata.width} × {imageMetadata.height} PX</span>
                      <span>•</span>
                      <span>RATIO: {imageMetadata.aspectRatio.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sample Photography Library (Instant 1-Click Testing) */}
            <div className="space-y-3 pt-2 border-t border-obsidian-border">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                  Sample Photography
                </span>
                <Badge variant="outline" size="xs">
                  {SAMPLE_PHOTOS.length} ITEMS
                </Badge>
              </div>

              <div className="space-y-2">
                {SAMPLE_PHOTOS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample.id)}
                    className="w-full border border-obsidian-border hover:border-acid-lime p-2.5 text-left bg-obsidian-950 hover:bg-obsidian-subtle flex items-center justify-between group transition-all duration-150 rounded-xs"
                    title={`Click to load ${sample.name} onto canvas`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xs bg-obsidian border border-obsidian-border flex items-center justify-center text-acid-lime group-hover:border-acid-lime transition-colors flex-shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <span className="font-mono text-xs uppercase text-white font-medium block truncate group-hover:text-acid-lime transition-colors">
                          {sample.name}
                        </span>
                        <span className="font-mono text-[10px] text-obsidian-muted block truncate">
                          {sample.category} • {sample.width}×{sample.height}px
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-obsidian-muted group-hover:text-acid-lime group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRESETS & ART LIBRARY */}
        {activeSidebarTab === 'presets' && (
          <div className="space-y-4">
            {/* Top Selector: Art Library vs Curated */}
            <div className="flex items-center gap-1 p-0.5 bg-obsidian-950 border border-obsidian-border rounded-xs">
              <button
                onClick={() => setPresetSource('recipes')}
                className={cn(
                  'flex-1 py-1 px-2 font-mono text-2xs uppercase tracking-wider rounded-2xs transition-colors flex items-center justify-center gap-1.5',
                  presetSource === 'recipes'
                    ? 'bg-electric-violet/20 text-electric-violet border border-electric-violet/40 font-semibold'
                    : 'text-obsidian-muted hover:text-white'
                )}
              >
                <Sparkles className="w-3 h-3 text-electric-violet" />
                Art Library ({COMMUNITY_RECIPES.length})
              </button>
              <button
                onClick={() => setPresetSource('curated')}
                className={cn(
                  'flex-1 py-1 px-2 font-mono text-2xs uppercase tracking-wider rounded-2xs transition-colors flex items-center justify-center gap-1.5',
                  presetSource === 'curated'
                    ? 'bg-acid-lime/20 text-acid-lime border border-acid-lime/40 font-semibold'
                    : 'text-obsidian-muted hover:text-white'
                )}
              >
                <Star className="w-3 h-3 text-acid-lime" />
                Curated ({CURATED_PRESETS.length})
              </button>
            </div>

            {/* Recipe / Preset Applied Toast */}
            {presetToast && (
              <div className="p-2.5 bg-acid-lime/10 border border-acid-lime/40 text-acid-lime font-mono text-2xs flex items-center gap-2 rounded-xs animate-fade-in">
                <Check className="w-3 h-3 shrink-0" />
                <div className="truncate">
                  <span className="font-bold">Applied {presetToast}:</span> Engine updated live
                </div>
              </div>
            )}

            {/* ART LIBRARY RECIPES SUBVIEW */}
            {presetSource === 'recipes' && (
              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-obsidian-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={recipeSearch}
                    onChange={(e) => setRecipeSearch(e.target.value)}
                    placeholder="Search 48 recipes..."
                    className="w-full bg-obsidian-950 border border-obsidian-border hover:border-obsidian-border-hover focus:border-electric-violet text-white font-mono text-2xs pl-8 pr-3 py-1.5 rounded-xs outline-none transition-colors"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'ascii', label: 'ASCII' },
                    { id: 'matrix-terminal', label: 'Matrix' },
                    { id: 'geometric', label: 'Geometric' },
                    { id: 'dithering', label: 'Dither' },
                    { id: 'mosaic-pixels', label: 'Mosaic' },
                    { id: 'abstract', label: 'Abstract' },
                    { id: 'backgrounds', label: 'Bg' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setRecipeCategory(cat.id)}
                      className={cn(
                        'px-2 py-0.5 font-mono text-[9px] uppercase rounded-2xs border transition-colors',
                        recipeCategory === cat.id
                          ? 'bg-electric-violet/20 border-electric-violet text-electric-violet-light font-semibold'
                          : 'bg-obsidian-950 border-obsidian-border text-obsidian-muted hover:text-white'
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Link to Full Visual Art Library */}
                <button
                  onClick={() => navigate('/library')}
                  className="w-full flex items-center justify-between p-2 rounded-xs bg-obsidian-950 border border-obsidian-border hover:border-electric-violet/50 text-obsidian-muted hover:text-white transition-colors group"
                >
                  <span className="font-mono text-2xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-electric-violet" />
                    Open Visual Art Library
                  </span>
                  <ExternalLink className="w-3 h-3 text-obsidian-muted group-hover:text-electric-violet transition-colors" />
                </button>

                {/* Recipe Cards List */}
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {COMMUNITY_RECIPES.filter((r) => {
                    if (recipeCategory !== 'all' && r.category !== recipeCategory) return false;
                    if (recipeSearch.trim()) {
                      const q = recipeSearch.toLowerCase();
                      return (
                        r.name.toLowerCase().includes(q) ||
                        r.description.toLowerCase().includes(q) ||
                        r.tags.some((t) => t.toLowerCase().includes(q)) ||
                        (typeof r.creator === 'string' && r.creator.toLowerCase().includes(q))
                      );
                    }
                    return true;
                  }).map((recipe) => {
                    const isActive = activeRecipeId === recipe.id;
                    return (
                      <div
                        key={recipe.id}
                        className={cn(
                          'border bg-obsidian-950 p-2.5 space-y-2 rounded-xs transition-all',
                          isActive
                            ? 'border-electric-violet shadow-[0_0_15px_rgba(157,0,255,0.15)] ring-1 ring-electric-violet/50'
                            : 'border-obsidian-border hover:border-obsidian-border-hover'
                        )}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-xs uppercase text-white font-semibold truncate" title={recipe.name}>
                            {recipe.name}
                          </span>
                          <Badge variant={isActive ? 'violet' : 'outline'} size="xs">
                            {recipe.category.toUpperCase()}
                          </Badge>
                        </div>

                        <p className="font-mono text-[10px] text-obsidian-muted leading-tight line-clamp-2">
                          {recipe.description}
                        </p>

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-obsidian-border/50">
                          <span className="font-mono text-[9px] text-obsidian-muted truncate">
                            by {typeof recipe.creator === 'string' ? recipe.creator : 'PixelMuse'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {isActive ? (
                              <Button
                                variant="secondary"
                                size="xs"
                                className="font-mono text-[10px] py-0.5 px-2 text-acid-lime border-acid-lime/40"
                                onClick={() => {
                                  resetToRecipeDefaults();
                                  setPresetToast(`${recipe.name} (Reset Defaults)`);
                                  setTimeout(() => setPresetToast(null), 2500);
                                }}
                              >
                                <RotateCcw className="w-2.5 h-2.5 mr-1" />
                                Reset
                              </Button>
                            ) : (
                              <Button
                                variant="primary"
                                size="xs"
                                className="font-mono text-[10px] py-0.5 px-2 bg-electric-violet hover:bg-electric-violet-light text-white border-none"
                                onClick={async () => {
                                  await loadRecipe(recipe, false);
                                  setPresetToast(recipe.name);
                                  setTimeout(() => setPresetToast(null), 2500);
                                }}
                              >
                                Apply Style
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CURATED PRESETS SUBVIEW */}
            {presetSource === 'curated' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-obsidian-border">
                  <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                    Curated Presets
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPresetFilter('all')}
                      className={`px-2 py-0.5 font-mono text-[10px] uppercase rounded-xs transition-colors ${
                        presetFilter === 'all'
                          ? 'bg-acid-lime/20 text-acid-lime border border-acid-lime/50'
                          : 'text-obsidian-muted hover:text-white'
                      }`}
                    >
                      All ({CURATED_PRESETS.length})
                    </button>
                    <button
                      onClick={() => setPresetFilter('favorites')}
                      className={`px-2 py-0.5 font-mono text-[10px] uppercase rounded-xs transition-colors flex items-center gap-1 ${
                        presetFilter === 'favorites'
                          ? 'bg-acid-lime/20 text-acid-lime border border-acid-lime/50'
                          : 'text-obsidian-muted hover:text-white'
                      }`}
                    >
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Favs
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {CURATED_PRESETS.filter((p) => {
                    if (presetFilter === 'favorites') {
                      return isPresetFavorited(p.id);
                    }
                    return true;
                  }).map((preset) => {
                    const isFav = isPresetFavorited(preset.id);
                    const isCurrentlyActive = config.mode === preset.config.mode;

                    return (
                      <div
                        key={preset.id}
                        className={`border bg-obsidian-950 p-3 space-y-2.5 rounded-xs group transition-all ${
                          isCurrentlyActive
                            ? 'border-obsidian-border-hover shadow-[0_0_15px_rgba(204,255,0,0.05)]'
                            : 'border-obsidian-border hover:border-obsidian-border-hover'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: preset.accentColor }}
                            />
                            <span className="font-mono text-xs uppercase text-white font-semibold">
                              {preset.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => toggleFavoritePreset(preset.id)}
                              className={`p-1 hover:text-acid-lime transition-colors ${
                                isFav ? 'text-acid-lime' : 'text-obsidian-muted'
                              }`}
                              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-acid-lime' : ''}`} />
                            </button>
                            <Badge variant="outline" size="xs">
                              {preset.config.mode.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <p className="font-mono text-2xs text-obsidian-muted leading-relaxed">
                          {preset.subtitle}
                        </p>

                        <div className="flex h-1.5 w-full border border-obsidian-border overflow-hidden rounded-2xs">
                          {preset.config.palette.colors.map((c, i) => (
                            <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                          ))}
                        </div>

                        <div className="flex items-center gap-1 flex-wrap pt-0.5">
                          {preset.tags.map((t) => (
                            <span
                              key={t}
                              className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-obsidian-surface text-obsidian-muted border border-obsidian-border/50 rounded-2xs"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <Button
                          variant={isCurrentlyActive ? 'primary' : 'secondary'}
                          size="xs"
                          className="w-full justify-center font-mono"
                          onClick={() => {
                            pushHistory();
                            updateConfig(preset.config);
                            setPresetToast(preset.title);
                            setTimeout(() => setPresetToast(null), 3000);
                          }}
                        >
                          {isCurrentlyActive ? 'Re-Apply Preset' : 'Apply Preset'}
                        </Button>
                      </div>
                    );
                  })}

                  {presetFilter === 'favorites' && CURATED_PRESETS.filter((p) => isPresetFavorited(p.id)).length === 0 && (
                    <div className="py-8 text-center font-mono text-2xs text-obsidian-muted border border-dashed border-obsidian-border p-4 rounded-xs">
                      No favorite presets starred yet. Click the star icon on any preset to save it to your cloud favorites.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RENDER MODES */}
        {activeSidebarTab === 'modes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-obsidian-border">
              <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                Active Raster Engines
              </span>
              <Badge variant="outline" size="xs">
                {renderModesList.length} MODES
              </Badge>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'geometric', label: 'Geometric' },
                { id: 'pixel', label: 'Pixel' },
                { id: 'pattern', label: 'Pattern' },
                { id: 'special', label: 'Special' },
                { id: 'character', label: 'Text' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setModesCategoryFilter(cat.id)}
                  className={cn(
                    'px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider rounded-xs border transition-colors',
                    modesCategoryFilter === cat.id
                      ? 'border-acid-lime text-white bg-obsidian-950 font-semibold'
                      : 'border-obsidian-border text-obsidian-muted hover:text-white'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {renderModesList
                .filter(
                  (m) => modesCategoryFilter === 'all' || m.category === modesCategoryFilter
                )
                .map((mode) => {
                  const isActive = config.mode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setMode(mode.id)}
                      className={cn(
                        'w-full p-2.5 text-left border rounded-xs transition-all flex flex-col space-y-1 cursor-pointer',
                        isActive
                          ? 'border-acid-lime bg-obsidian-950 shadow-crisp-border'
                          : 'border-obsidian-border bg-obsidian-950 hover:border-obsidian-border-hover'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            'font-mono text-xs uppercase font-semibold transition-colors',
                            isActive ? 'text-acid-lime' : 'text-white'
                          )}
                        >
                          {mode.name}
                        </span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-acid-lime shadow-active-lime" />}
                      </div>

                      <span className="font-mono text-[9px] uppercase tracking-wider text-obsidian-muted">
                        {mode.tag}
                      </span>

                      <p className="font-mono text-2xs text-obsidian-text leading-relaxed">
                        {mode.desc}
                      </p>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 4: LAYERS */}
        {activeSidebarTab === 'layers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-obsidian-border">
              <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                Studio Layer Stack
              </span>
              <Badge variant="outline" size="xs">
                {layers.length} LAYERS
              </Badge>
            </div>

            <div className="space-y-2">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="border border-obsidian-border bg-obsidian-950 p-2.5 space-y-2 rounded-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLayerVisibility(layer.id)}
                        className="text-obsidian-muted hover:text-white"
                      >
                        {layer.visible ? (
                          <Eye className="w-3.5 h-3.5 text-acid-lime" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="font-mono text-xs text-white font-medium uppercase">
                        {layer.name}
                      </span>
                    </div>

                    {layer.locked && <Lock className="w-3 h-3 text-obsidian-muted" />}
                  </div>

                  {/* Opacity Slider */}
                  <div className="flex items-center gap-2 font-mono text-2xs text-obsidian-muted">
                    <span>OPACITY</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={layer.opacity}
                      onChange={(e) => setLayerOpacity(layer.id, parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-obsidian-border accent-acid-lime cursor-pointer"
                    />
                    <span className="w-8 text-right font-semibold text-white">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
