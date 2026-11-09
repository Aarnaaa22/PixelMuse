import React from 'react';
import { Play, Pause, RotateCcw, Repeat, Activity } from 'lucide-react';
import { Slider } from '../ui';
import { useStudioStore } from '../../stores';
import { AnimationStyle } from '../../types';
import { cn } from '../../utilities';

interface MotionLabSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const MotionLabSection: React.FC<MotionLabSectionProps> = ({
  isOpen,
  onToggle,
  onReset,
}) => {
  const { config, updateMotionConfig } = useStudioStore();
  const { animated, isPlaying, animSpeed, speed, animStyle, type, animIntensity, intensity, loop } =
    config.motion;

  const activeAnimated = Boolean(animated || isPlaying);
  const activeSpeed = animSpeed ?? speed ?? 1;
  const activeStyle: AnimationStyle = animStyle || type || 'wave';
  const activeIntensity = animIntensity ?? intensity ?? 0.5;

  const animationStyles: { id: AnimationStyle; label: string; desc: string }[] = [
    { id: 'wave', label: 'Wave', desc: 'Undulating sinusoidal spatial propagation' },
    { id: 'pulse', label: 'Pulse', desc: 'Rhythmic breathing scale and luminous expansion' },
    { id: 'shimmer', label: 'Shimmer', desc: 'High-frequency faceted micro-glint phase' },
    { id: 'ripple', label: 'Ripple', desc: 'Concentric circular outward waves from center' },
    { id: 'flicker', label: 'Flicker', desc: 'Stochastic neon power surges and micro-dropouts' },
  ];

  return (
    <div className="border-b border-obsidian-border bg-obsidian-surface">
      {/* Section Header Accordion */}
      <div className="flex items-center justify-between p-3.5 hover:bg-obsidian-subtle/50 transition-colors select-none">
        <button
          onClick={onToggle}
          className="flex items-center gap-2.5 flex-1 text-left focus:outline-none"
        >
          <span className="text-acid-lime shrink-0">
            <Activity className="w-4 h-4" />
          </span>
          <span className="font-mono text-xs uppercase font-semibold text-white tracking-wider">
            Motion Lab
          </span>
          {activeAnimated && (
            <span className="font-mono text-[9px] px-1.5 py-0.2 bg-acid-lime/10 border border-acid-lime/40 text-acid-lime uppercase rounded-xs">
              ACTIVE
            </span>
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            title="Reset Motion to Defaults"
            className="p-1 text-obsidian-muted hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 pt-1 space-y-4 border-t border-obsidian-border/50">
          {/* Master Play / Pause Controller */}
          <div className="flex items-center justify-between pb-1">
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Kinetic Engine
            </span>
            <button
              onClick={() =>
                updateMotionConfig({
                  animated: !activeAnimated,
                  isPlaying: !activeAnimated,
                })
              }
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 font-mono text-2xs uppercase rounded-xs border transition-colors',
                activeAnimated
                  ? 'border-acid-lime text-acid-lime bg-acid-lime/10 shadow-active-lime'
                  : 'border-obsidian-border text-obsidian-muted hover:text-white'
              )}
            >
              {activeAnimated ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>Running (60FPS)</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 ml-0.5" />
                  <span>Play Animation</span>
                </>
              )}
            </button>
          </div>

          {/* Animation Style Selector */}
          <div className="space-y-2">
            <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Animation Style
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {animationStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() =>
                    updateMotionConfig({
                      animStyle: style.id,
                      type: style.id,
                    })
                  }
                  className={cn(
                    'p-2 text-left rounded-xs border transition-colors flex flex-col',
                    activeStyle === style.id
                      ? 'border-acid-lime text-white bg-obsidian-950 font-semibold shadow-crisp-border'
                      : 'border-obsidian-border text-obsidian-muted hover:text-white bg-obsidian-950'
                  )}
                >
                  <span className="font-mono text-xs uppercase">{style.label}</span>
                  <span className="font-mono text-[9px] text-obsidian-muted tracking-tight truncate mt-0.5">
                    {style.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Speed Slider */}
          <Slider
            label="Animation Speed"
            value={activeSpeed}
            min={0.1}
            max={3.0}
            step={0.1}
            unit="x"
            accentColor="lime"
            onChange={(val) =>
              updateMotionConfig({
                animSpeed: val,
                speed: val,
              })
            }
          />

          {/* Intensity Slider */}
          <Slider
            label="Displacement Intensity"
            value={activeIntensity}
            min={0.05}
            max={1.0}
            step={0.05}
            unit="x"
            accentColor="lime"
            onChange={(val) =>
              updateMotionConfig({
                animIntensity: val,
                intensity: val,
              })
            }
          />

          {/* Loop Control & Reset Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-obsidian-border">
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateMotionConfig({ loop: !loop })}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-xs border font-mono text-2xs uppercase transition-colors',
                  loop
                    ? 'border-acid-lime text-acid-lime bg-acid-lime/10'
                    : 'border-obsidian-border text-obsidian-muted hover:text-white'
                )}
              >
                <Repeat className="w-3 h-3" />
                <span>{loop ? 'Loop: ON' : 'Loop: OFF'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                updateMotionConfig({
                  currentTime: 0,
                  animated: false,
                  isPlaying: false,
                });
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xs border border-obsidian-border text-obsidian-muted hover:text-white font-mono text-2xs uppercase transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Pos</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
