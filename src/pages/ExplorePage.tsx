import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { useExploreStore, useStudioStore } from '../stores';
import { ArtPreset } from '../types';
import { CanvasPipeline } from '../rendering-engine';
import { createSamplePhotoCanvas } from '../utilities/samplePhotos';

interface PresetThumbnailProps {
  preset: ArtPreset;
}

const PresetThumbnail: React.FC<PresetThumbnailProps> = ({ preset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pipelineRef = useRef<CanvasPipeline | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!pipelineRef.current) {
      pipelineRef.current = new CanvasPipeline();
    }

    pipelineRef.current.attach(canvas);
    const sample = createSamplePhotoCanvas('marble-sculpture');
    pipelineRef.current.execute(sample, 320, 320, preset.config, 0);

    return () => {
      pipelineRef.current?.detach();
    };
  }, [preset]);

  return (
    <div className="relative aspect-square w-full bg-obsidian-950 border-b border-obsidian-border overflow-hidden group">
      <canvas
        ref={canvasRef}
        width={320}
        height={320}
        className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-2.5 left-2.5">
        <Badge variant="outline" size="xs">
          {preset.config.mode.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
};

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { presets, selectedCategory, searchQuery, setSelectedCategory, setSearchQuery } =
    useExploreStore();
  const updateConfig = useStudioStore((s) => s.updateConfig);
  const setProjectName = useStudioStore((s) => s.setProjectName);

  const categories = [
    { id: 'all', label: 'All Archives' },
    { id: 'mosaic', label: 'Mosaic' },
    { id: 'pixel', label: 'Pixel' },
    { id: 'ascii', label: 'ASCII' },
    { id: 'dots', label: 'Dots' },
    { id: 'dither', label: 'Dither' },
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

  const handleApplyPreset = (preset: ArtPreset) => {
    updateConfig(preset.config);
    setProjectName(preset.title.toUpperCase().replace(/\s+/g, '_'));
    navigate('/studio');
  };

  return (
    <div className="flex-1 bg-obsidian px-6 py-12 max-w-7xl mx-auto w-full select-none">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-obsidian-border">
        <div className="space-y-2">
          <Badge variant="violet" dot>
            Exhibition Catalog
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
            Curated Generative Archives
          </h1>
          <p className="font-mono text-xs text-obsidian-text max-w-xl">
            Tested parameter matrices across luminance topology, error diffusion, and chromatic
            palettes. Click any preset to inspect and load directly into the live studio.
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
        {filteredPresets.map((preset) => (
          <article
            key={preset.id}
            className="border border-obsidian-border bg-obsidian-surface flex flex-col justify-between group hover:border-obsidian-border-hover transition-all rounded-xs overflow-hidden"
          >
            <div>
              {/* Live Canvas Thumbnail */}
              <PresetThumbnail preset={preset} />

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
                variant="primary"
                size="sm"
                className="w-full justify-center"
                icon={<ArrowUpRight className="w-3.5 h-3.5 text-black" />}
                iconPosition="right"
                onClick={() => handleApplyPreset(preset)}
              >
                Load In Studio
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
