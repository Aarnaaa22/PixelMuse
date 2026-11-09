import React from 'react';
import { Play, Pause, Repeat, SkipBack, SkipForward, Activity, FastForward } from 'lucide-react';
import { IconButton } from '../ui';
import { useStudioStore } from '../../stores';
import { cn } from '../../utilities';

export const TimelineBar: React.FC = () => {
  const { config, updateMotionConfig } = useStudioStore();
  const { isPlaying, speed, loop, type } = config.motion;
  const currentTime = config.motion.currentTime ?? 0;
  const duration = config.motion.duration ?? 10;

  const togglePlayback = () => {
    updateMotionConfig({ isPlaying: !isPlaying });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMotionConfig({ currentTime: parseFloat(e.target.value) });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${String(mins).padStart(2, '0')}:${secs.padStart(5, '0')}`;
  };

  return (
    <footer className="h-12 bg-obsidian-950 border-t border-obsidian-border px-4 flex items-center justify-between z-20 select-none">
      {/* Left: Play/Pause, Frame Steppers, and Loop */}
      <div className="flex items-center gap-2">
        <IconButton
          size="sm"
          variant={isPlaying ? 'lime' : 'default'}
          title={isPlaying ? 'Pause Motion (Space)' : 'Play Motion (Space)'}
          onClick={togglePlayback}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </IconButton>

        <IconButton
          size="xs"
          title="Rewind to 00:00"
          onClick={() => updateMotionConfig({ currentTime: 0 })}
        >
          <SkipBack className="w-3 h-3" />
        </IconButton>

        <IconButton
          size="xs"
          title="Step Forward 1s"
          onClick={() => updateMotionConfig({ currentTime: Math.min(duration, currentTime + 1) })}
        >
          <SkipForward className="w-3 h-3" />
        </IconButton>

        <IconButton
          size="xs"
          active={loop}
          title={loop ? 'Loop Enabled' : 'Loop Disabled'}
          onClick={() => updateMotionConfig({ loop: !loop })}
        >
          <Repeat className="w-3 h-3" />
        </IconButton>

        <div className="h-4 w-px bg-obsidian-border mx-1" />

        {/* Current Animation Time Display */}
        <div className="font-mono text-xs text-white tracking-widest font-semibold flex items-center gap-1.5">
          <span className="text-acid-lime">{formatTime(currentTime)}</span>
          <span className="text-obsidian-muted">/</span>
          <span className="text-obsidian-muted">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Center: Timeline Scrubber Track */}
      <div className="flex-1 max-w-xl mx-6 flex items-center gap-3">
        <span className="font-mono text-2xs uppercase text-obsidian-muted tracking-wider">
          Seek
        </span>
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-obsidian-border rounded-none appearance-none cursor-pointer accent-acid-lime"
            style={{
              background: `linear-gradient(to right, #CCFF00 ${(currentTime / duration) * 100}%, #1F1F28 ${(currentTime / duration) * 100}%)`,
            }}
          />
        </div>
      </div>

      {/* Right: Oscillator Diagnostics & Speed Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-mono text-2xs">
          <Activity className="w-3.5 h-3.5 text-electric-violet" />
          <span className="text-obsidian-muted uppercase">WAVE:</span>
          <span className="text-white uppercase font-medium">{type}</span>
        </div>

        <div className="h-4 w-px bg-obsidian-border" />

        <div className="flex items-center gap-1 font-mono text-2xs">
          <FastForward className="w-3 h-3 text-obsidian-muted" />
          {[0.5, 1, 1.5, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => updateMotionConfig({ speed: spd })}
              className={cn(
                'px-1.5 py-0.5 rounded-xs border uppercase text-[10px]',
                speed === spd
                  ? 'border-acid-lime text-acid-lime bg-acid-lime/10 font-semibold'
                  : 'border-obsidian-border text-obsidian-muted hover:text-white'
              )}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};
