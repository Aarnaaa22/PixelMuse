import React from 'react';
import { Activity, Cpu, Layers } from 'lucide-react';
import { useStudioStore } from '../../stores';
import { cn } from '../../utilities';

interface StatusFooterProps {
  className?: string;
}

export const StatusFooter: React.FC<StatusFooterProps> = ({ className }) => {
  const { stats, config, imageMetadata } = useStudioStore();

  const isMotionActive = config.motion.isPlaying;

  return (
    <footer
      className={cn(
        'h-7 bg-obsidian-950 border-t border-obsidian-border px-4 flex items-center justify-between text-2xs font-mono text-obsidian-muted select-none z-20',
        className
      )}
    >
      {/* Left: Engine & Mode Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              isMotionActive ? 'bg-acid-lime animate-pulse' : 'bg-electric-violet'
            )}
          />
          <span className="uppercase text-obsidian-text font-semibold">
            ENGINE: {config.mode.toUpperCase()}
          </span>
        </div>

        <span className="text-obsidian-border">/</span>

        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-obsidian-muted" />
          <span>PALETTE: {config.palette.name}</span>
        </div>

        {imageMetadata && (
          <>
            <span className="text-obsidian-border">/</span>
            <span>
              SRC: {imageMetadata.width}×{imageMetadata.height}px
            </span>
          </>
        )}
      </div>

      {/* Right: Performance Diagnostics */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-obsidian-muted" />
          <span>RENDER: {stats.renderTimeMs}ms</span>
        </div>

        <span className="text-obsidian-border">/</span>

        <div className="flex items-center gap-1.5">
          <Activity
            className={cn(
              'w-3 h-3',
              stats.fps >= 50 ? 'text-acid-lime' : stats.fps >= 30 ? 'text-signal-coral' : 'text-red-500'
            )}
          />
          <span className={stats.fps >= 50 ? 'text-acid-lime' : ''}>
            {stats.fps} FPS
          </span>
        </div>

        <span className="text-obsidian-border">/</span>

        <span className="text-obsidian-muted">
          OUTPUT: {stats.canvasWidth}×{stats.canvasHeight}
        </span>
      </div>
    </footer>
  );
};

