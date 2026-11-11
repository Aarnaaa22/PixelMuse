import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search, Play, Sparkles } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { SiteFooter } from '../components/common';
import { useExploreStore, useStudioStore } from '../stores';
import { ArtPreset } from '../types';
import { CanvasPipeline } from '../rendering-engine';
import { createSamplePhotoCanvas } from '../utilities/samplePhotos';

interface InteractiveThumbnailProps {
  preset: ArtPreset;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

const InteractiveThumbnail: React.FC<InteractiveThumbnailProps> = ({
  preset,
  isActive,
  onActivate,
  onDeactivate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pipelineRef = useRef<CanvasPipeline | null>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const isIntersectingRef = useRef<boolean>(false);
  const isAnimated = preset.config.motion?.isPlaying || preset.config.mode === 'matrix-rain' || preset.config.mode === 'rings';
  const BUFFER_SIZE = 280;

  useEffect(() => {
    if (!sourceCanvasRef.current) {
      sourceCanvasRef.current = createSamplePhotoCanvas('marble-sculpture');
    }
    if (!offscreenRef.current) {
      const off = document.createElement('canvas');
      off.width = BUFFER_SIZE;
      off.height = BUFFER_SIZE;
      offscreenRef.current = off;
    }
    if (!pipelineRef.current) {
      pipelineRef.current = new CanvasPipeline();
    }
    if (pipelineRef.current && offscreenRef.current) {
      pipelineRef.current.attach(offscreenRef.current);
    }
    return () => {
      pipelineRef.current?.detach();
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        isIntersectingRef.current = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const source = sourceCanvasRef.current;
    const offscreen = offscreenRef.current;
    const pipeline = pipelineRef.current;
    if (!canvas || !source || !offscreen || !pipeline) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    const startTime = performance.now();

    const draw = (now: number) => {
      if (!isIntersectingRef.current) {
        if (isActive) rafId = requestAnimationFrame(draw);
        return;
      }

      const elapsed = (now - startTime) / 1000;

      if (isAnimated) {
        pipeline.execute(source, BUFFER_SIZE, BUFFER_SIZE, preset.config, elapsed);
        ctx.clearRect(0, 0, BUFFER_SIZE, BUFFER_SIZE);
        ctx.drawImage(offscreen, 0, 0, BUFFER_SIZE, BUFFER_SIZE);
        if (isActive || isIntersectingRef.current) {
          rafId = requestAnimationFrame(draw);
        }
      } else {
        if (isActive) {
          // Dynamic before/after split scan
          const sweep = (Math.sin(elapsed * 2.2) + 1) / 2;
          const splitX = Math.round(sweep * BUFFER_SIZE);

          pipeline.execute(source, BUFFER_SIZE, BUFFER_SIZE, preset.config, elapsed);
          ctx.clearRect(0, 0, BUFFER_SIZE, BUFFER_SIZE);

          // Raw Photo slice on left
          if (splitX > 0) {
            ctx.drawImage(source, 0, 0, (splitX / BUFFER_SIZE) * source.width, source.height, 0, 0, splitX, BUFFER_SIZE);
          }
          // Generative Raster on right
          if (splitX < BUFFER_SIZE) {
            ctx.drawImage(offscreen, splitX, 0, BUFFER_SIZE - splitX, BUFFER_SIZE, splitX, 0, BUFFER_SIZE - splitX, BUFFER_SIZE);
          }

          // Laser divider
          const glowGrad = ctx.createLinearGradient(splitX - 6, 0, splitX + 6, 0);
          glowGrad.addColorStop(0, 'rgba(204, 255, 0, 0)');
          glowGrad.addColorStop(0.5, 'rgba(204, 255, 0, 0.85)');
          glowGrad.addColorStop(1, 'rgba(204, 255, 0, 0)');
          ctx.fillStyle = glowGrad;
          ctx.fillRect(splitX - 6, 0, 12, BUFFER_SIZE);

          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(splitX, 0);
          ctx.lineTo(splitX, BUFFER_SIZE);
          ctx.stroke();

          rafId = requestAnimationFrame(draw);
        } else {
          // Static render
          pipeline.execute(source, BUFFER_SIZE, BUFFER_SIZE, preset.config, 0);
          ctx.clearRect(0, 0, BUFFER_SIZE, BUFFER_SIZE);
          ctx.drawImage(offscreen, 0, 0, BUFFER_SIZE, BUFFER_SIZE);
        }
      }
    };

    draw(performance.now());
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isActive, isAnimated, preset.config]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onClick={onActivate}
      className="relative aspect-square w-full bg-obsidian-950 border-b border-obsidian-border overflow-hidden select-none cursor-pointer"
    >
      <canvas
        ref={canvasRef}
        width={BUFFER_SIZE}
        height={BUFFER_SIZE}
        className="w-full h-full object-cover block"
      />
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
        <Badge variant={isActive ? 'lime' : 'outline'} size="xs">
          {preset.config.mode.toUpperCase()}
        </Badge>
        {isAnimated && (
          <span className="font-mono text-[9px] px-1.5 py-0.5 bg-obsidian-950/80 border border-electric-violet/50 text-electric-violet-light rounded-2xs flex items-center gap-1">
            <Play className="w-2 h-2 fill-current" />
            MOTION
          </span>
        )}
      </div>

      {isActive && (
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-obsidian-950/90 border border-acid-lime font-mono text-[9px] text-acid-lime uppercase rounded-2xs shadow-active-lime pointer-events-none animate-fade-in">
          <span>{isAnimated ? 'LIVE STREAM' : 'INTERACTIVE SCAN'}</span>
        </div>
      )}
    </div>
  );
};

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { presets, selectedCategory, searchQuery, setSelectedCategory, setSearchQuery } =
    useExploreStore();
  const applyPreset = useStudioStore((s) => s.applyPreset);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Presets' },
    { id: 'dots', label: 'Dots / Bloom' },
    { id: 'ascii', label: 'ASCII' },
    { id: 'crosses', label: 'Neon Crosses' },
    { id: 'pixel', label: 'Pixels' },
    { id: 'contour', label: 'Monochrome' },
    { id: 'hexagons', label: 'Acid Geometry' },
    { id: 'dither', label: 'Dither' },
    { id: 'mosaic', label: 'Mosaic / Glitch' },
    { id: 'matrix-rain', label: 'Matrix' },
    { id: 'rings', label: 'Kinetic Rings' },
  ];

  const filteredPresets = presets.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.config.mode === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleApplyPreset = async (preset: ArtPreset) => {
    await applyPreset(preset, true);
    navigate('/studio');
  };

  return (
    <div className="flex-1 flex flex-col bg-obsidian select-none">
      <div className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-obsidian-border">
          <div className="space-y-2">
            <Badge variant="lime" dot>
              Interactive Art Gallery
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
              Curated Generative Archives
            </h1>
            <p className="font-mono text-xs text-obsidian-text max-w-xl">
              Hover over any artwork (or tap on mobile) to experience live Canvas 2D rasterization.
              Click <span className="text-acid-lime font-semibold">Try This Style</span> to load its exact formulas into the Studio.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-obsidian-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search presets by tag or title..."
              className="w-full bg-obsidian-surface border border-obsidian-border pl-9 pr-3 py-1.5 font-mono text-xs text-white placeholder:text-obsidian-muted focus:outline-none focus:border-acid-lime rounded-xs"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 pt-6 pb-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider rounded-xs border transition-colors ${
                selectedCategory === cat.id
                  ? 'border-acid-lime text-acid-lime bg-acid-lime/10 font-semibold'
                  : 'border-obsidian-border text-obsidian-muted hover:text-white hover:bg-obsidian-surface'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredPresets.map((preset) => {
            const isCardActive = activeCardId === preset.id;
            return (
              <article
                key={preset.id}
                className={`border bg-obsidian-surface flex flex-col justify-between group transition-all rounded-xs overflow-hidden ${
                  isCardActive
                    ? 'border-acid-lime shadow-[0_0_20px_rgba(204,255,0,0.15)] ring-1 ring-acid-lime/50'
                    : 'border-obsidian-border hover:border-obsidian-border-hover'
                }`}
              >
                <div>
                  {/* Live Canvas Thumbnail */}
                  <InteractiveThumbnail
                    preset={preset}
                    isActive={isCardActive}
                    onActivate={() => setActiveCardId(preset.id)}
                    onDeactivate={() => setActiveCardId(null)}
                  />

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-obsidian-muted uppercase tracking-widest">
                        ARCHIVE SPEC // {preset.config.mode.toUpperCase()}
                      </span>
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                    </div>

                    <h2 className="font-display text-lg font-bold uppercase text-white group-hover:text-acid-lime transition-colors">
                      {preset.title}
                    </h2>

                    <p className="font-mono text-xs text-obsidian-text leading-relaxed line-clamp-2">
                      {preset.subtitle}
                    </p>

                    {/* Color Palette Bar */}
                    <div className="flex h-2 w-full border border-obsidian-border overflow-hidden">
                      {preset.config.palette.colors.map((c, i) => (
                        <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>

                    {/* Parameters Metadata Strip */}
                    <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-obsidian-muted">
                      <span>CELL: {preset.config.renderParams.cellSize}PX</span>
                      <span>•</span>
                      <span>PALETTE: {preset.config.palette.name}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Button
                    variant={isCardActive ? 'primary' : 'secondary'}
                    size="sm"
                    className="w-full justify-center font-mono font-bold"
                    icon={isCardActive ? <Sparkles className="w-3.5 h-3.5 text-black" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    iconPosition="right"
                    onClick={() => handleApplyPreset(preset)}
                  >
                    {isCardActive ? 'TRY THIS STYLE' : 'OPEN IN STUDIO'}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};
