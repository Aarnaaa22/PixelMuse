import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Filter } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { useExploreStore, useStudioStore } from '../stores';
import { ArtPreset } from '../types';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { presets } = useExploreStore();
  const updateConfig = useStudioStore((s) => s.updateConfig);

  const handleApplyPreset = (preset: ArtPreset) => {
    updateConfig(preset.config);
    navigate('/studio');
  };

  return (
    <div className="flex-1 bg-obsidian px-6 py-12 max-w-7xl mx-auto w-full">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-obsidian-border">
        <div className="space-y-2">
          <Badge variant="violet" dot>
            Curated Archives
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
            Explore Generative Presets
          </h1>
          <p className="font-mono text-xs text-obsidian-text max-w-xl">
            Selected parameter configurations tested across high dynamic range portraiture,
            architecture, and graphic stills.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Filter className="w-3.5 h-3.5" />}
          >
            All Archives ({presets.length})
          </Button>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className="border border-obsidian-border bg-obsidian-surface p-6 flex flex-col justify-between group hover:border-obsidian-border-hover transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                  {preset.config.mode.toUpperCase()} MODE
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: preset.accentColor }}
                />
              </div>

              <h2 className="font-display text-xl font-bold uppercase text-white group-hover:text-acid-lime transition-colors">
                {preset.title}
              </h2>

              <p className="font-mono text-xs text-obsidian-text leading-relaxed">
                {preset.subtitle}
              </p>

              {/* Color Bar */}
              <div className="flex h-2.5 w-full border border-obsidian-border overflow-hidden">
                {preset.config.palette.colors.map((c, i) => (
                  <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {preset.tags.map((tag) => (
                  <Badge key={tag} variant="outline" size="xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-obsidian-border flex items-center justify-between">
              <span className="font-mono text-2xs text-obsidian-muted">
                BY {preset.author.toUpperCase()}
              </span>

              <Button
                variant="primary"
                size="xs"
                icon={<ArrowUpRight className="w-3.5 h-3.5 text-black" />}
                iconPosition="right"
                onClick={() => handleApplyPreset(preset)}
              >
                Load In Studio
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
