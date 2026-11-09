import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Play, ArrowRight } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { useMotionStore, useStudioStore } from '../stores';

export const MotionPage: React.FC = () => {
  const navigate = useNavigate();
  const { presets } = useMotionStore();
  const updateMotionConfig = useStudioStore((s) => s.updateMotionConfig);

  const handleApplyMotion = (presetConfig: any) => {
    updateMotionConfig(presetConfig);
    navigate('/studio');
  };

  return (
    <div className="flex-1 bg-obsidian px-6 py-12 max-w-7xl mx-auto w-full">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-obsidian-border">
        <div className="space-y-2">
          <Badge variant="lime" dot>
            Motion Oscillators
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
            Kinetic Raster Dynamics
          </h1>
          <p className="font-mono text-xs text-obsidian-text max-w-xl">
            Drive glyph displacements and scanline pulses at 60 FPS using pure mathematical
            oscillation functions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Play className="w-3.5 h-3.5 text-black" />}
          onClick={() => {
            updateMotionConfig({ isPlaying: true, type: 'scanline' });
            navigate('/studio');
          }}
        >
          Open Live Studio
        </Button>
      </div>

      {/* Motion Oscillators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className="border border-obsidian-border bg-obsidian-surface p-6 flex flex-col justify-between group hover:border-electric-violet transition-colors"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                  OSCILLATOR: {preset.config.type.toUpperCase()}
                </span>
                <Zap className="w-4 h-4 text-electric-violet" />
              </div>

              <h2 className="font-display text-xl font-bold uppercase text-white group-hover:text-electric-violet-light transition-colors">
                {preset.name}
              </h2>

              <p className="font-mono text-xs text-obsidian-text leading-relaxed">
                {preset.description}
              </p>

              <div className="border border-obsidian-border bg-obsidian-950 p-3 font-mono text-2xs space-y-1.5">
                <div className="flex justify-between text-obsidian-muted">
                  <span>BASE FREQUENCY:</span>
                  <span className="text-white">{preset.config.frequency} Hz</span>
                </div>
                <div className="flex justify-between text-obsidian-muted">
                  <span>VELOCITY:</span>
                  <span className="text-acid-lime">{preset.config.speed}x</span>
                </div>
                <div className="flex justify-between text-obsidian-muted">
                  <span>INTENSITY AMPLITUDE:</span>
                  <span className="text-signal-coral">
                    {Math.round(preset.config.intensity * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-obsidian-border flex items-center justify-end">
              <Button
                variant="secondary"
                size="xs"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
                onClick={() => handleApplyMotion(preset.config)}
              >
                Apply To Studio
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
