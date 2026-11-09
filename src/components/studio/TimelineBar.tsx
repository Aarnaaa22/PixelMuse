import React from 'react';
import { Play, Pause, FastForward, Activity } from 'lucide-react';
import { IconButton } from '../ui';
import { useStudioStore } from '../../stores';

export const TimelineBar: React.FC = () => {
  const { config, updateMotionConfig } = useStudioStore();
  const isPlaying = config.motion.isPlaying;

  const togglePlayback = () => {
    updateMotionConfig({ isPlaying: !isPlaying });
  };

  return (
    <div className="h-10 bg-obsidian-surface border-t border-obsidian-border px-4 flex items-center justify-between z-20">
      {/* Play/Pause & Speed */}
      <div className="flex items-center gap-3">
        <IconButton
          size="xs"
          variant={isPlaying ? 'lime' : 'default'}
          title={isPlaying ? 'Pause Motion Engine' : 'Play Motion Engine'}
          onClick={togglePlayback}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </IconButton>

        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs uppercase text-obsidian-muted">
            Oscillator:
          </span>
          <span className="font-mono text-2xs text-acid-lime uppercase font-semibold">
            {config.motion.type}
          </span>
        </div>
      </div>

      {/* Scrub speed quick selector */}
      <div className="flex items-center gap-2">
        <FastForward className="w-3 h-3 text-obsidian-muted" />
        <span className="font-mono text-2xs text-obsidian-muted">Speed:</span>
        <div className="flex items-center gap-1">
          {[0.5, 1, 1.5, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => updateMotionConfig({ speed: spd })}
              className={`font-mono text-2xs px-1.5 py-0.5 rounded-xs border ${
                config.motion.speed === spd
                  ? 'border-acid-lime text-acid-lime bg-acid-lime/10'
                  : 'border-obsidian-border text-obsidian-muted hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        <div className="h-3 w-px bg-obsidian-border mx-1" />

        <div className="flex items-center gap-1 text-2xs font-mono text-obsidian-muted">
          <Activity className="w-3 h-3 text-electric-violet" />
          <span>Intensity: {Math.round(config.motion.intensity * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

