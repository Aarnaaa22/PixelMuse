import React from 'react';
import { Play, Pause, Repeat, SkipBack, SkipForward, Activity } from 'lucide-react';
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
    <footer className="h-12 shrink-0 bg-obsidian-950 border-t border-obsidian-border px-4 flex items-center justify-between z-20 select-none">
      {/* Left: Play/Pause, Frame Steppers, and Loop */}
      <div className="flex items-center gap-2">
        <IconButton
          size="sm"
          variant={isPlaying ? 'lime' : 'default'}
          title={isPlaying ? 'Pause Motion (Spacebar) — Halt raster animations' : 'Play Motion (Spacebar) — Animate generative waves and matrix rain'}
          onClick={togglePlayback}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </IconButton>

        <IconButton
          size="xs"
          title="Rewind to 00:00 — Reset motion time to initial frame"
          onClick={() => updateMotionConfig({ currentTime: 0 })}
        >
          <SkipBack className="w-3 h-3" />
        </IconButton>

        <IconButton
          size="xs"
          title="Step Forward 1s — Advance animation position"
          onClick={() => updateMotionConfig({ currentTime: Math.min(duration, currentTime + 1) })}
        >
          <SkipForward className="w-3 h-3" />
        </IconButton>

        <IconButton
          size="xs"
          active={loop}
          title={loop ? 'Loop Enabled — Repeat animation continuously' : 'Loop Disabled — Stop at timeline end'}
          onClick={() => updateMotionConfig({ loop: !loop })}
        >
          <Repeat className="w-3 h-3" />
        </IconButton>

        <div className="h-4 w-px bg-obsidian-border mx-1" />

        {/* Current Animation Time Display */}
        <div
          className="font-mono text-xs text-white tracking-widest font-semibold flex items-center gap-1.5"
          title="Elapsed animation time / total duration"
        >
          <span className="text-acid-lime">{formatTime(currentTime)}</span>
          <span className="text-obsidian-muted">/</span>
          <span className="text-obsidian-muted">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Center: Timeline Scrubber Track */}
      <div
        className="flex-1 max-w-xl mx-6 flex items-center gap-3"
        title="Scrub Animation Timeline — Drag slider to preview effect across time"
      >
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
            title={`Current Frame: ${currentTime.toFixed(2)}s`}
            className="w-full h-1 bg-obsidian-border rounded-none appearance-none cursor-pointer accent-acid-lime"
            style={{
              background: `linear-gradient(to right, #CCFF00 ${(currentTime / duration) * 100}%, #1F1F28 ${(currentTime / duration) * 100}%)`,
            }}
          />
        </div>
      </div>

      {/* Right: Oscillator Diagnostics & Speed Selector */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-1.5 font-mono text-2xs"
          title="Oscillation Waveform: Sinusoidal mathematical harmonics"
        >
          <Activity className="w-3.5 h-3.5 text-electric-violet" />
          <span className="text-obsidian-muted uppercase">WAVE:</span>
          <span className="text-white uppercase">{type || 'SINE'}</span>
        </div>

        <div className="flex items-center gap-1">
          {[1, 1.5, 2].map((s) => (
            <button
              key={s}
              onClick={() => updateMotionConfig({ speed: s, animSpeed: s })}
              title={`Playback Rate: ${s}x Realtime`}
              className={cn(
                'px-1.5 py-0.5 font-mono text-2xs uppercase rounded-xs transition-colors',
                (speed === s || config.motion.animSpeed === s)
                  ? 'bg-acid-lime text-black font-bold'
                  : 'text-obsidian-muted hover:text-white'
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};
