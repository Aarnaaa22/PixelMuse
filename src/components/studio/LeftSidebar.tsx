import React, { useRef } from 'react';
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
} from 'lucide-react';
import { Button, Badge } from '../ui';
import { useStudioStore, BUILTIN_PALETTES } from '../../stores';
import { useImageDrop } from '../../hooks';
import { SAMPLE_PHOTOS, createSamplePhotoCanvas } from '../../utilities/samplePhotos';
import { SidebarTab } from '../../types/studio';
import { RenderMode } from '../../types';
import { cn } from '../../utilities';

interface LeftSidebarProps {
  className?: string;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { onFileInputChange } = useImageDrop();

  const {
    activeSidebarTab,
    setActiveSidebarTab,
    sourceImage,
    imageMetadata,
    setSourceImage,
    clearImage,
    config,
    setMode,
    updateConfig,
    layers,
    toggleLayerVisibility,
    setLayerOpacity,
  } = useStudioStore();

  const tabs: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
    { id: 'upload', label: 'Upload', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'presets', label: 'Presets', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'modes', label: 'Modes', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'layers', label: 'Layers', icon: <Layers className="w-4 h-4" /> },
  ];

  const handleSelectSample = (sampleId: string) => {
    const canvas = createSamplePhotoCanvas(sampleId);
    const sample = SAMPLE_PHOTOS.find((s) => s.id === sampleId)!;
    setSourceImage(canvas, {
      name: `${sample.name.toLowerCase().replace(/\s+/g, '-')}.png`,
      width: sample.width,
      height: sample.height,
      sizeBytes: 0,
      aspectRatio: sample.width / sample.height,
    });
  };

  const [modesCategoryFilter, setModesCategoryFilter] = React.useState<string>('all');

  const renderModesList: {
    id: RenderMode;
    name: string;
    category: 'character' | 'geometric' | 'pixel' | 'pattern' | 'special' | 'retro';
    tag: string;
    desc: string;
  }[] = [
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
        accept="image/*"
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
              onClick={() => setActiveSidebarTab(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-1 rounded-xs transition-colors border text-center',
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
                PNG, JPEG, WebP up to 32MB
              </span>

              <div className="mt-4">
                <Button variant="secondary" size="xs">
                  Browse Files
                </Button>
              </div>
            </div>

            {/* Current Loaded Image Info */}
            {sourceImage && imageMetadata && (
              <div className="border border-obsidian-border bg-obsidian-subtle p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                    ACTIVE PHOTOGRAPH
                  </span>
                  <button
                    onClick={clearImage}
                    className="text-obsidian-muted hover:text-signal-coral"
                    title="Unload Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="font-mono text-xs text-white truncate font-medium">
                  {imageMetadata.name}
                </div>
                <div className="flex items-center gap-2 font-mono text-2xs text-obsidian-muted">
                  <span>
                    {imageMetadata.width} × {imageMetadata.height} PX
                  </span>
                  <span>•</span>
                  <span>RATIO: {imageMetadata.aspectRatio.toFixed(2)}</span>
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
                  4 ITEMS
                </Badge>
              </div>

              <div className="space-y-2">
                {SAMPLE_PHOTOS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample.id)}
                    className="w-full border border-obsidian-border hover:border-acid-lime p-2.5 text-left bg-obsidian-950 flex items-center justify-between group transition-colors rounded-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-mono text-xs uppercase text-white font-medium block group-hover:text-acid-lime transition-colors">
                        {sample.name}
                      </span>
                      <span className="font-mono text-2xs text-obsidian-muted block">
                        {sample.category}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-obsidian-muted group-hover:text-acid-lime transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRESETS */}
        {activeSidebarTab === 'presets' && (
          <div className="space-y-4">
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted block pb-2 border-b border-obsidian-border">
              Curated Style Presets
            </span>

            <div className="space-y-3">
              {[
                {
                  id: 'cyberpunk-ascii',
                  title: 'Cyberpunk Monolith',
                  mode: 'ascii',
                  desc: 'High-glow phosphor matrix with violet and acid lime spectrum.',
                  colors: ['#08080A', '#9D4EDD', '#CCFF00'],
                  apply: () =>
                    updateConfig({
                      mode: 'ascii',
                      ascii: {
                        characters: ' .:-=+*#%@$░▒▓█',
                        fontSize: 10,
                        lineHeight: 10,
                        fontFamily: '"JetBrains Mono", monospace',
                        invert: false,
                        colorMode: 'palette',
                        monochromeColor: '#CCFF00',
                        backgroundColor: '#08080A',
                        contrast: 30,
                        brightness: 0,
                        glow: 5,
                      },
                      palette: BUILTIN_PALETTES[0],
                    }),
                },
                {
                  id: 'bayer-industrial',
                  title: 'Bayer Industrial',
                  mode: 'dither',
                  desc: '8×8 ordered cross-hatch stippling in stark monochrome.',
                  colors: ['#050505', '#686870', '#FAFAFA'],
                  apply: () =>
                    updateConfig({
                      mode: 'dither',
                      dither: {
                        algorithm: 'bayer-8x8',
                        scale: 2,
                        threshold: 0.5,
                        colorDepth: 2,
                        paletteId: 'noir-monochrome',
                        serpentine: true,
                      },
                      palette: BUILTIN_PALETTES[1],
                    }),
                },
                {
                  id: 'kinetic-mosaic',
                  title: 'Kinetic Diamonds',
                  mode: 'pixel-mosaic',
                  desc: 'Rotated 45° diamond cells preserving chromatic saturation.',
                  colors: ['#FF473A', '#CCFF00', '#08080A'],
                  apply: () =>
                    updateConfig({
                      mode: 'pixel-mosaic',
                      mosaic: {
                        cellSize: 14,
                        shape: 'diamond',
                        gap: 2,
                        jitter: 0,
                        angle: 45,
                        preserveEdges: true,
                      },
                      palette: BUILTIN_PALETTES[2],
                    }),
                },
                {
                  id: 'rotary-print',
                  title: 'Rotary Halftone',
                  mode: 'halftone',
                  desc: 'Angled newspaper screen raster with high dynamic contrast.',
                  colors: ['#08080A', '#E58A00', '#FFB833'],
                  apply: () =>
                    updateConfig({
                      mode: 'halftone',
                      halftone: {
                        dotSize: 10,
                        angle: 45,
                        cmykSeparation: false,
                        sharpness: 1.5,
                      },
                      palette: BUILTIN_PALETTES[3],
                    }),
                },
              ].map((preset) => (
                <div
                  key={preset.id}
                  className="border border-obsidian-border bg-obsidian-950 p-3 space-y-3 rounded-xs group hover:border-obsidian-border-hover transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase text-white font-medium">
                      {preset.title}
                    </span>
                    <Badge variant="outline" size="xs">
                      {preset.mode.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="font-mono text-2xs text-obsidian-muted leading-relaxed">
                    {preset.desc}
                  </p>

                  <div className="flex h-1.5 w-full border border-obsidian-border overflow-hidden">
                    {preset.colors.map((c, i) => (
                      <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>

                  <Button
                    variant="secondary"
                    size="xs"
                    className="w-full justify-center"
                    onClick={preset.apply}
                  >
                    Apply Preset
                  </Button>
                </div>
              ))}
            </div>
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
                      onClick={() => setMode(mode.id)}
                      className={cn(
                        'w-full p-2.5 text-left border rounded-xs transition-all flex flex-col space-y-1',
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
