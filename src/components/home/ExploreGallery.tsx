import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Play } from 'lucide-react';
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
  sampleSubject: 'marble-sculpture' | 'cyber-portrait' | 'brutalist-facade';
  isAnimated: boolean;
}[] = [
  {
    presetId: 'preset-digital-bloom',
    displayTitle: 'DIGITAL BLOOM',
    effectLabel: 'Dots / Bloom',
    description: 'Luminous circular dots modulating with luminance bloom and violet spectrum.',
    sampleSubject: 'marble-sculpture',
    isAnimated: false,
  },
  {
    presetId: 'preset-cyber-terminal',
    displayTitle: 'CYBER TERMINAL',
    effectLabel: 'ASCII Matrix',
    description: 'Dense monospace glyph typography with phosphor CRT cathode scanlines.',
    sampleSubject: 'cyber-portrait',
    isAnimated: false,
  },
  {
    presetId: 'preset-neon-dream',
    displayTitle: 'NEON DREAM',
    effectLabel: 'Geometric Crosses',
    description: 'Electric violet and signal coral geometric crosses with neon synthwave glow.',
    sampleSubject: 'marble-sculpture',
    isAnimated: false,
  },
  {
    presetId: 'preset-retro-pixels',
    displayTitle: 'RETRO PIXELS',
    effectLabel: 'Quantized Pixel',
    description: 'Sharp 8-bit quantized arcade pixel blocks with phosphor edge clarity.',
    sampleSubject: 'cyber-portrait',
    isAnimated: false,
  },
  {
    presetId: 'preset-soft-dither',
    displayTitle: 'MONOCHROME STUDY',
    effectLabel: 'Atkinson Dither',
    description: '1984 MacPaint error diffusion with preserved highlight grain and noir tone.',
    sampleSubject: 'brutalist-facade',
    isAnimated: false,
  },
  {
    presetId: 'preset-acid-geometry',
    displayTitle: 'ACID GEOMETRY',
    effectLabel: 'Prismatic Hexagons',
    description: 'Interlocking hexagonal cellular prisms soaked in high-voltage acid lime.',
    sampleSubject: 'marble-sculpture',
    isAnimated: false,
  },
  {
    presetId: 'preset-matrix-rain',
    displayTitle: 'MATRIX RAIN',
    effectLabel: 'Animated Code Rain',
    description: 'Cascading digital code streams with phosphor trails and 60 FPS animation.',
    sampleSubject: 'cyber-portrait',
    isAnimated: true,
  },
  {
    presetId: 'preset-chromatic-pulse',
    displayTitle: 'KINETIC RINGS',
    effectLabel: 'Animated Rings',
    description: 'Harmonic concentric rings oscillating with radial energy and chromatic flares.',
    sampleSubject: 'marble-sculpture',
    isAnimated: true,
  },
];

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pipelineRef = useRef<CanvasPipeline | null>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize pipeline and cached source image
  useEffect(() => {
    if (!sourceCanvasRef.current) {
      sourceCanvasRef.current = createSamplePhotoCanvas(item.sampleSubject);
    }
    if (!pipelineRef.current) {
      pipelineRef.current = new CanvasPipeline();
    }
    const canvas = canvasRef.current;
    if (canvas && pipelineRef.current) {
      pipelineRef.current.attach(canvas);
    }
    return () => {
      pipelineRef.current?.detach();
    };
  }, [item.sampleSubject]);

  // Render loop driven by hover/active state
  useEffect(() => {
    const canvas = canvasRef.current;
    const source = sourceCanvasRef.current;
    const pipeline = pipelineRef.current;
    if (!canvas || !source || !pipeline) return;

    let rafId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      if (item.isAnimated) {
        // Continuous kinetic loop for animated styles
        pipeline.execute(source, 360, 360, preset.config, elapsed);
        if (isActive) {
          rafId = requestAnimationFrame(render);
        }
      } else {
        if (isActive) {
          // Dynamic sweep reveal demonstrating the transformation from photo to generative raster
          const sweep = ((Math.sin(elapsed * 2.5) + 1) / 2);
          const dynamicConfig = {
            ...preset.config,
            renderParams: {
              ...preset.config.renderParams,
              coverage: Math.round(50 + sweep * 50),
              edgeEmphasis: Math.round(sweep * 60),
            },
          };
          pipeline.execute(source, 360, 360, dynamicConfig, elapsed);
          rafId = requestAnimationFrame(render);
        } else {
          // Default static presentation
          pipeline.execute(source, 360, 360, preset.config, 0);
        }
      }
    };

    render(performance.now());

    if (isActive) {
      rafId = requestAnimationFrame(render);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isActive, item.isAnimated, preset.config]);

  return (
    <article
      ref={containerRef}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onClick={onActivate}
      className={`group relative bg-obsidian-surface border transition-all duration-300 rounded-xs flex flex-col justify-between overflow-hidden cursor-pointer ${
        isActive
          ? 'border-acid-lime shadow-[0_0_25px_rgba(204,255,0,0.15)] ring-1 ring-acid-lime/50'
          : 'border-obsidian-border hover:border-obsidian-border-hover'
      }`}
    >
      {/* Artwork Canvas Stage */}
      <div className="relative aspect-square w-full bg-obsidian-950 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
          <Badge variant={isActive ? 'lime' : 'outline'} size="xs">
            {item.effectLabel}
          </Badge>
          {item.isAnimated && (
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-obsidian-950/80 border border-electric-violet/50 text-electric-violet-light rounded-2xs flex items-center gap-1">
              <Play className="w-2 h-2 fill-current" />
              60 FPS
            </span>
          )}
        </div>

        {/* Active Scan Indicator */}
        {isActive && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 bg-obsidian-950/90 border border-acid-lime font-mono text-[9px] text-acid-lime uppercase rounded-2xs shadow-active-lime animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-acid-lime animate-ping" />
            <span>ACTIVE LIVE RASTER</span>
          </div>
        )}
      </div>

      {/* Card Content & Action Area */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3 bg-obsidian-surface">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm sm:text-base font-extrabold uppercase text-white tracking-wide group-hover:text-acid-lime transition-colors">
              {item.displayTitle}
            </h3>
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: preset.accentColor }}
            />
          </div>
          <p className="font-mono text-2xs text-obsidian-text leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Color Palette Bar */}
        <div className="flex h-1.5 w-full border border-obsidian-border rounded-2xs overflow-hidden">
          {preset.config.palette.colors.map((c, i) => (
            <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <Button
            variant={isActive ? 'primary' : 'secondary'}
            size="sm"
            className="w-full justify-center font-mono text-xs font-bold"
            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
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
  const updateConfig = useStudioStore((s) => s.updateConfig);
  const setProjectName = useStudioStore((s) => s.setProjectName);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleSelectPreset = useCallback((preset: ArtPreset) => {
    updateConfig(preset.config);
    setProjectName(preset.title.toUpperCase().replace(/\s+/g, '_'));
    navigate('/studio');
  }, [updateConfig, setProjectName, navigate]);

  return (
    <section className="px-6 py-24 max-w-7xl mx-auto w-full border-b border-obsidian-border studio-grain">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-obsidian-border">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="lime" dot>
              Interactive Art Gallery
            </Badge>
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              08 LIVE EXPERIENCES
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-none">
            Explore Generative Transformations
          </h2>
          <p className="font-mono text-xs sm:text-sm text-obsidian-text max-w-2xl leading-relaxed">
            Hover over any artwork (or tap on mobile) to experience real-time Canvas 2D rasterization.
            Click <span className="text-acid-lime font-semibold">Try This Style</span> to load its exact
            formulas into your Studio workspace.
          </p>
        </div>

        <div className="font-mono text-2xs text-obsidian-muted uppercase tracking-widest text-right">
          <div>DIRECT CANVAS BLIT</div>
          <div className="text-acid-lime">HARDWARE ACCELERATED</div>
        </div>
      </div>

      {/* 8-Piece Interactive Exhibition Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {GALLERY_ITEMS.map((item) => {
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
