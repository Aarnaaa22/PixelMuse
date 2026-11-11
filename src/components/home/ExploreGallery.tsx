import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Play, Sparkles, SlidersHorizontal, Eye } from 'lucide-react';
import { Button, Badge } from '../ui';
import { CURATED_PRESETS } from '../../presets/curatedPresets';
import { CanvasPipeline } from '../../rendering-engine';
import { createSamplePhotoCanvas } from '../../utilities/samplePhotos';
import { useStudioStore } from '../../stores';
import { ArtPreset } from '../../types';

// The 8 requested preview experiences mapping directly to our real curated presets
const GALLERY_ITEMS: {
  presetId: string;
  displayTitle: string;
  effectLabel: string;
  description: string;
  sampleSubject: 'marble-sculpture' | 'cyberpunk-neon' | 'brutalist-facade';
  isAnimated: boolean;
  category: 'kinetic' | 'raster';
}[] = [
  {
    presetId: 'preset-digital-bloom',
    displayTitle: 'DIGITAL BLOOM',
    effectLabel: 'Dots / Bloom',
    description: 'Luminous circular dots modulating with luminance bloom and delicate violet spectrum.',
    sampleSubject: 'marble-sculpture',
    isAnimated: false,
    category: 'raster',
  },
  {
    presetId: 'preset-cyber-terminal',
    displayTitle: 'CYBER TERMINAL',
    effectLabel: 'ASCII Matrix',
    description: 'Dense monospace glyph typography with phosphor CRT cathode scanlines.',
    sampleSubject: 'cyberpunk-neon',
    isAnimated: false,
    category: 'raster',
  },
  {
    presetId: 'preset-neon-dream',
    displayTitle: 'NEON DREAM',
    effectLabel: 'Geometric Crosses',
    description: 'Electric violet and signal coral geometric crosses with deep synthwave glow.',
    sampleSubject: 'marble-sculpture',
    isAnimated: false,
    category: 'raster',
  },
  {
    presetId: 'preset-retro-pixels',
    displayTitle: 'RETRO PIXELS',
    effectLabel: 'Quantized Pixel',
    description: 'Sharp quantized 8-bit arcade blocks with phosphor edge clarity.',
    sampleSubject: 'cyberpunk-neon',
    isAnimated: false,
    category: 'raster',
  },
  {
    presetId: 'preset-soft-dither',
    displayTitle: 'MONOCHROME STUDY',
    effectLabel: 'Atkinson Dither',
    description: '1984 MacPaint error diffusion with preserved highlight grain and noir tone.',
    sampleSubject: 'brutalist-facade',
    isAnimated: false,
    category: 'raster',
  },
  {
    presetId: 'preset-acid-geometry',
    displayTitle: 'ACID GEOMETRY',
    effectLabel: 'Prismatic Hexagons',
    description: 'Stark interlocking hexagonal prisms soaked in high-voltage acid lime.',
    sampleSubject: 'marble-sculpture',
    isAnimated: false,
    category: 'raster',
  },
  {
    presetId: 'preset-matrix-rain',
    displayTitle: 'MATRIX RAIN',
    effectLabel: 'Animated Code Rain',
    description: 'Cascading digital code streams with phosphor trails and 60 FPS animation.',
    sampleSubject: 'cyberpunk-neon',
    isAnimated: true,
    category: 'kinetic',
  },
  {
    presetId: 'preset-chromatic-pulse',
    displayTitle: 'KINETIC RINGS',
    effectLabel: 'Animated Rings',
    description: 'Harmonic concentric rings oscillating with radial energy and chromatic flares.',
    sampleSubject: 'marble-sculpture',
    isAnimated: true,
    category: 'kinetic',
  },
];

const PREVIEW_BUFFER_SIZE = 280;

interface GalleryCardProps {
  item: typeof GALLERY_ITEMS[0];
  preset: ArtPreset;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onSelect: (preset: ArtPreset) => void;
}

const InteractiveArtworkCard: React.FC<GalleryCardProps> = ({
  item,
  preset,
  isActive,
  onActivate,
  onDeactivate,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pipelineRef = useRef<CanvasPipeline | null>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isIntersectingRef = useRef<boolean>(false);
  const mouseSplitPosRef = useRef<number | null>(null);

  // Initialize pipeline, cached source image, and offscreen buffer
  useEffect(() => {
    if (!sourceCanvasRef.current) {
      sourceCanvasRef.current = createSamplePhotoCanvas(item.sampleSubject);
    }
    if (!offscreenCanvasRef.current) {
      const off = document.createElement('canvas');
      off.width = PREVIEW_BUFFER_SIZE;
      off.height = PREVIEW_BUFFER_SIZE;
      offscreenCanvasRef.current = off;
    }
    if (!pipelineRef.current) {
      pipelineRef.current = new CanvasPipeline();
    }
    const canvas = canvasRef.current;
    if (canvas && pipelineRef.current) {
      // Attach pipeline to offscreen canvas so rendering can be composited to target
      pipelineRef.current.attach(offscreenCanvasRef.current);
    }

    return () => {
      pipelineRef.current?.detach();
    };
  }, [item.sampleSubject]);

  // Viewport IntersectionObserver to pause when outside viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersectingRef.current = entry?.isIntersecting ?? false;
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Main Canvas Render Loop (Responsive to hover, touch, and animations)
  useEffect(() => {
    const canvas = canvasRef.current;
    const source = sourceCanvasRef.current;
    const offscreen = offscreenCanvasRef.current;
    const pipeline = pipelineRef.current;
    if (!canvas || !source || !offscreen || !pipeline) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let startTime = performance.now();

    const drawFrame = (now: number) => {
      // Suspend rendering if completely offscreen
      if (!isIntersectingRef.current) {
        if (isActive) {
          rafId = requestAnimationFrame(drawFrame);
        }
        return;
      }

      const elapsed = (now - startTime) / 1000;

      if (item.isAnimated) {
        // ANIMATED EFFECT: continuous Canvas 2D motion loop
        pipeline.execute(source, PREVIEW_BUFFER_SIZE, PREVIEW_BUFFER_SIZE, preset.config, elapsed);
        ctx.clearRect(0, 0, PREVIEW_BUFFER_SIZE, PREVIEW_BUFFER_SIZE);
        ctx.drawImage(offscreen, 0, 0, PREVIEW_BUFFER_SIZE, PREVIEW_BUFFER_SIZE);

        // Keep loop running if active or in viewport
        if (isActive || isIntersectingRef.current) {
          rafId = requestAnimationFrame(drawFrame);
        }
      } else {
        // NON-ANIMATED EFFECT: Interactive before/after transformation sweep
        if (isActive) {
          // Dynamic sweep reveal demonstrating raw photo -> generative artwork transformation
          const autoSweep = (Math.sin(elapsed * 2.2) + 1) / 2;
          const sweep = mouseSplitPosRef.current !== null ? mouseSplitPosRef.current : autoSweep;
          const splitX = Math.max(0, Math.min(PREVIEW_BUFFER_SIZE, Math.round(sweep * PREVIEW_BUFFER_SIZE)));

          // Render generative raster to offscreen buffer with subtle live oscillation
          const animatedConfig = {
            ...preset.config,
            renderParams: {
              ...preset.config.renderParams,
              edgeEmphasis: (preset.config.renderParams?.edgeEmphasis || 30) + Math.round(Math.sin(elapsed * 3) * 8),
            },
          };
          pipeline.execute(source, PREVIEW_BUFFER_SIZE, PREVIEW_BUFFER_SIZE, animatedConfig, elapsed);

          ctx.clearRect(0, 0, PREVIEW_BUFFER_SIZE, PREVIEW_BUFFER_SIZE);

          // 1. Draw Original Photograph on Left Slice
          if (splitX > 0) {
            ctx.drawImage(
              source,
              0,
              0,
              (splitX / PREVIEW_BUFFER_SIZE) * source.width,
              source.height,
              0,
              0,
              splitX,
              PREVIEW_BUFFER_SIZE
            );
          }

          // 2. Draw Generative Artwork on Right Slice
          if (splitX < PREVIEW_BUFFER_SIZE) {
            ctx.drawImage(
              offscreen,
              splitX,
              0,
              PREVIEW_BUFFER_SIZE - splitX,
              PREVIEW_BUFFER_SIZE,
              splitX,
              0,
              PREVIEW_BUFFER_SIZE - splitX,
              PREVIEW_BUFFER_SIZE
            );
          }

          // 3. Laser Split Divider Line with Glow
          const glowGrad = ctx.createLinearGradient(splitX - 6, 0, splitX + 6, 0);
          glowGrad.addColorStop(0, 'rgba(204, 255, 0, 0)');
          glowGrad.addColorStop(0.5, 'rgba(204, 255, 0, 0.85)');
          glowGrad.addColorStop(1, 'rgba(204, 255, 0, 0)');
          ctx.fillStyle = glowGrad;
          ctx.fillRect(splitX - 6, 0, 12, PREVIEW_BUFFER_SIZE);

          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(splitX, 0);
          ctx.lineTo(splitX, PREVIEW_BUFFER_SIZE);
          ctx.stroke();

          // 4. Subtle HUD Split Indicators
          ctx.font = 'bold 8px monospace';
          if (splitX > 55) {
            ctx.fillStyle = 'rgba(8, 8, 10, 0.75)';
            ctx.fillRect(6, PREVIEW_BUFFER_SIZE - 20, 52, 14);
            ctx.fillStyle = '#A0A0B0';
            ctx.fillText('RAW PHOTO', 10, PREVIEW_BUFFER_SIZE - 10);
          }
          if (PREVIEW_BUFFER_SIZE - splitX > 65) {
            ctx.fillStyle = 'rgba(8, 8, 10, 0.75)';
            ctx.fillRect(PREVIEW_BUFFER_SIZE - 68, PREVIEW_BUFFER_SIZE - 20, 62, 14);
            ctx.fillStyle = '#CCFF00';
            ctx.fillText('RASTER GEN', PREVIEW_BUFFER_SIZE - 64, PREVIEW_BUFFER_SIZE - 10);
          }

          rafId = requestAnimationFrame(drawFrame);
        } else {
          // Default Idle State: Display the complete generative effect
          pipeline.execute(source, PREVIEW_BUFFER_SIZE, PREVIEW_BUFFER_SIZE, preset.config, 0);
          ctx.clearRect(0, 0, PREVIEW_BUFFER_SIZE, PREVIEW_BUFFER_SIZE);
          ctx.drawImage(offscreen, 0, 0, PREVIEW_BUFFER_SIZE, PREVIEW_BUFFER_SIZE);
        }
      }
    };

    drawFrame(performance.now());

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isActive, item.isAnimated, preset.config]);

  // Handle interactive mouse position for split slider
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!item.isAnimated && isActive && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      mouseSplitPosRef.current = Math.max(0.05, Math.min(0.95, relX));
    }
  };

  const handleMouseLeave = () => {
    mouseSplitPosRef.current = null;
    onDeactivate();
  };

  return (
    <article
      ref={containerRef}
      onMouseEnter={onActivate}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onActivate}
      className={`group relative bg-obsidian-surface border transition-all duration-300 rounded-xs flex flex-col justify-between overflow-hidden cursor-pointer ${
        isActive
          ? 'border-acid-lime shadow-[0_0_25px_rgba(204,255,0,0.18)] ring-1 ring-acid-lime/60 -translate-y-1'
          : 'border-obsidian-border hover:border-obsidian-border-hover'
      }`}
    >
      {/* Artwork Canvas Stage */}
      <div className="relative aspect-square w-full bg-obsidian-950 overflow-hidden select-none">
        <canvas
          ref={canvasRef}
          width={PREVIEW_BUFFER_SIZE}
          height={PREVIEW_BUFFER_SIZE}
          className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-102"
        />

        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-none">
          <Badge variant={isActive ? 'lime' : 'outline'} size="xs">
            {item.effectLabel}
          </Badge>
          {item.isAnimated && (
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-obsidian-950/85 border border-electric-violet/50 text-electric-violet-light rounded-2xs flex items-center gap-1 backdrop-blur-xs">
              <Play className="w-2 h-2 fill-current" />
              60 FPS
            </span>
          )}
        </div>

        {/* Active Scan Indicator */}
        {isActive && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 bg-obsidian-950/90 border border-acid-lime font-mono text-[9px] text-acid-lime uppercase rounded-2xs shadow-active-lime animate-fade-in backdrop-blur-xs pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-acid-lime animate-ping" />
            <span>{item.isAnimated ? 'LIVE STREAM' : 'INTERACTIVE SCAN'}</span>
          </div>
        )}

        {/* Interactive Hover Prompt on Desktop when unhovered */}
        {!isActive && (
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 pointer-events-none">
            <span className="font-mono text-[10px] text-acid-lime flex items-center gap-1.5 uppercase font-medium">
              <Eye className="w-3 h-3" />
              Hover to Experience Effect
            </span>
          </div>
        )}
      </div>

      {/* Card Body & Info Area */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3 bg-obsidian-surface border-t border-obsidian-border/50">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm sm:text-base font-extrabold uppercase text-white tracking-wide group-hover:text-acid-lime transition-colors">
              {item.displayTitle}
            </h3>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-obsidian-border"
              style={{ backgroundColor: preset.accentColor }}
              title={`Preset Accent: ${preset.accentColor}`}
            />
          </div>

          <p className="font-mono text-2xs text-obsidian-text leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Palette Bar */}
        <div className="flex h-1.5 w-full border border-obsidian-border rounded-2xs overflow-hidden">
          {preset.config.palette.colors.map((c, i) => (
            <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* CTA Action Button */}
        <div className="pt-1">
          <Button
            variant={isActive ? 'primary' : 'secondary'}
            size="sm"
            className="w-full justify-center font-mono text-xs font-bold"
            icon={isActive ? <Sparkles className="w-3.5 h-3.5 text-black" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
            iconPosition="right"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(preset);
            }}
          >
            {isActive ? 'TRY THIS STYLE' : 'OPEN IN STUDIO'}
          </Button>
        </div>
      </div>
    </article>
  );
};

export const ExploreGallery: React.FC = () => {
  const navigate = useNavigate();
  const applyPreset = useStudioStore((s) => s.applyPreset);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'kinetic' | 'raster'>('all');

  const handleSelectPreset = useCallback(
    async (preset: ArtPreset) => {
      await applyPreset(preset, true);
      navigate('/studio');
    },
    [applyPreset, navigate]
  );

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (categoryFilter === 'kinetic') return item.isAnimated;
    if (categoryFilter === 'raster') return !item.isAnimated;
    return true;
  });

  return (
    <section className="px-6 py-24 max-w-7xl mx-auto w-full border-b border-obsidian-border studio-grain">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-obsidian-border">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="lime" dot>
              Interactive Art Gallery
            </Badge>
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              08 LIVE GENERATIVE EXHIBITS
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-none">
            Explore Generative Transformations
          </h2>
          <p className="font-mono text-xs sm:text-sm text-obsidian-text max-w-2xl leading-relaxed">
            Hover over any artwork (or tap on mobile) to experience live Canvas 2D rasterization.
            Watch photographic textures dissolve into ASCII, dither matrices, and animated harmonic loops, then launch into Studio with{' '}
            <span className="text-acid-lime font-semibold">Try This Style</span>.
          </p>
        </div>

        {/* View Filter Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-obsidian-surface border border-obsidian-border rounded-xs">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 font-mono text-2xs uppercase rounded-2xs transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-acid-lime text-black font-bold'
                  : 'text-obsidian-muted hover:text-white'
              }`}
            >
              All (8)
            </button>
            <button
              onClick={() => setCategoryFilter('kinetic')}
              className={`px-2.5 py-1 font-mono text-2xs uppercase rounded-2xs transition-colors flex items-center gap-1 ${
                categoryFilter === 'kinetic'
                  ? 'bg-acid-lime text-black font-bold'
                  : 'text-obsidian-muted hover:text-white'
              }`}
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              Kinetic
            </button>
            <button
              onClick={() => setCategoryFilter('raster')}
              className={`px-2.5 py-1 font-mono text-2xs uppercase rounded-2xs transition-colors flex items-center gap-1 ${
                categoryFilter === 'raster'
                  ? 'bg-acid-lime text-black font-bold'
                  : 'text-obsidian-muted hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-2.5 h-2.5" />
              Rasters
            </button>
          </div>
        </div>
      </div>

      {/* 8-Piece Interactive Exhibition Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const matchedPreset =
            CURATED_PRESETS.find((p) => p.id === item.presetId) || CURATED_PRESETS[0];

          return (
            <InteractiveArtworkCard
              key={item.presetId}
              item={item}
              preset={matchedPreset}
              isActive={activeCardId === item.presetId}
              onActivate={() => setActiveCardId(item.presetId)}
              onDeactivate={() => setActiveCardId(null)}
              onSelect={handleSelectPreset}
            />
          );
        })}
      </div>
    </section>
  );
};
