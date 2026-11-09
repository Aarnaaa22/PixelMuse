import React from 'react';
import { Type, Grid3X3, Disc, Sparkles } from 'lucide-react';
import { RenderMode } from '../../types';
import { useStudioStore } from '../../stores';
import { cn } from '../../utilities';

interface ModeOption {
  id: RenderMode;
  label: string;
  tagline: string;
  icon: React.ReactNode;
}

const MODES: ModeOption[] = [
  {
    id: 'ascii',
    label: 'ASCII Glyph',
    tagline: 'Luminance text raster',
    icon: <Type className="w-4 h-4" />,
  },
  {
    id: 'dither',
    label: 'Dither Bit',
    tagline: 'Bayer & error diffusion',
    icon: <Grid3X3 className="w-4 h-4" />,
  },
  {
    id: 'pixel-mosaic',
    label: 'Mosaic Tile',
    tagline: 'Geometric cell binning',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'halftone',
    label: 'Halftone Print',
    tagline: 'Rotary press screening',
    icon: <Disc className="w-4 h-4" />,
  },
];

export const ModeSelector: React.FC = () => {
  const { config, setMode } = useStudioStore();

  return (
    <div className="grid grid-cols-4 gap-1 p-1 bg-obsidian-950 border-b border-obsidian-border">
      {MODES.map((mode) => {
        const isActive = config.mode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => setMode(mode.id)}
            className={cn(
              'group relative flex flex-col items-start p-2.5 text-left transition-all rounded-xs border',
              isActive
                ? 'bg-obsidian-surface border-acid-lime/60 shadow-crisp-border'
                : 'bg-transparent border-transparent hover:border-obsidian-border hover:bg-obsidian-subtle/50'
            )}
          >
            <div className="flex items-center gap-2 w-full justify-between">
              <span
                className={cn(
                  'shrink-0 transition-colors',
                  isActive ? 'text-acid-lime' : 'text-obsidian-muted group-hover:text-white'
                )}
              >
                {mode.icon}
              </span>
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-colors',
                  isActive ? 'bg-acid-lime shadow-active-lime' : 'bg-transparent'
                )}
              />
            </div>

            <span
              className={cn(
                'mt-2 font-mono text-xs uppercase font-medium tracking-wide transition-colors',
                isActive ? 'text-white' : 'text-obsidian-text group-hover:text-white'
              )}
            >
              {mode.label}
            </span>

            <span className="font-mono text-2xs text-obsidian-muted line-clamp-1 mt-0.5">
              {mode.tagline}
            </span>
          </button>
        );
      })}
    </div>
  );
};

