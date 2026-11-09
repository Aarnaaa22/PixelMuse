import React from 'react';
import { Sun, Plus, Trash2, RotateCcw, Lightbulb } from 'lucide-react';
import { Slider } from '../ui';
import { useStudioStore } from '../../stores';
import { DEFAULT_LIGHTING_CONFIG } from '../../stores/studioStore';
import { cn } from '../../utilities';

interface LightingLabSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const LightingLabSection: React.FC<LightingLabSectionProps> = ({
  isOpen,
  onToggle,
  onReset,
}) => {
  const { config, updateLightingConfig, toggleLighting, addLight, removeLight, updateLight } =
    useStudioStore();

  const lighting = config.lighting || DEFAULT_LIGHTING_CONFIG;
  const { enabled, ambient, lights } = lighting;

  const colorPresets = ['#FFFFFF', '#CCFF00', '#9D4EDD', '#FF473A', '#33E533', '#FFB833'];

  return (
    <div className="border-b border-obsidian-border bg-obsidian-surface">
      {/* Section Header Accordion */}
      <div className="flex items-center justify-between p-3.5 hover:bg-obsidian-subtle/50 transition-colors select-none">
        <button
          onClick={onToggle}
          className="flex items-center gap-2.5 flex-1 text-left focus:outline-none"
        >
          <span className="text-acid-lime shrink-0">
            <Sun className="w-4 h-4" />
          </span>
          <span className="font-mono text-xs uppercase font-semibold text-white tracking-wider">
            Lighting Lab
          </span>
          {enabled && (
            <span className="font-mono text-[9px] px-1.5 py-0.2 bg-acid-lime/10 border border-acid-lime/40 text-acid-lime uppercase rounded-xs">
              {lights.length} LIGHTS
            </span>
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            title="Reset Lighting to Defaults"
            className="p-1 text-obsidian-muted hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 pt-1 space-y-4 border-t border-obsidian-border/50">
          {/* Master Enable/Disable Lighting */}
          <div className="flex items-center justify-between pb-1">
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Studio Spotlight Engine
            </span>
            <button
              onClick={toggleLighting}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 font-mono text-2xs uppercase rounded-xs border transition-colors',
                enabled
                  ? 'border-acid-lime text-acid-lime bg-acid-lime/10 shadow-active-lime'
                  : 'border-obsidian-border text-obsidian-muted hover:text-white'
              )}
            >
              <Lightbulb className="w-3 h-3" />
              <span>{enabled ? 'Lighting Active' : 'Lighting Disabled'}</span>
            </button>
          </div>

          {enabled && (
            <>
              {/* Ambient Illumination Baseline */}
              <Slider
                label="Ambient Base Illumination"
                value={ambient}
                min={0}
                max={1}
                step={0.05}
                unit="x"
                accentColor="lime"
                onChange={(val) => updateLightingConfig({ ambient: val })}
              />

              {/* Light Points List */}
              <div className="space-y-3 pt-2 border-t border-obsidian-border">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                    Configured Light Points ({lights.length})
                  </span>
                  <button
                    onClick={() => addLight()}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-xs border border-acid-lime/50 text-acid-lime hover:bg-acid-lime/10 font-mono text-[10px] uppercase transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Light</span>
                  </button>
                </div>

                {lights.map((light, idx) => (
                  <div
                    key={light.id}
                    className="p-3 bg-obsidian-950 border border-obsidian-border rounded-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: light.color || '#FFFFFF' }}
                        />
                        <span className="font-mono text-xs uppercase text-white font-medium">
                          Light #{idx + 1}
                        </span>
                      </div>

                      <button
                        onClick={() => removeLight(light.id)}
                        className="text-obsidian-muted hover:text-signal-coral transition-colors"
                        title="Remove Light"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Position Sliders (Normalized X & Y) */}
                    <div className="grid grid-cols-2 gap-2">
                      <Slider
                        label="Pos X"
                        value={Math.round(light.x * 100)}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        onChange={(val) => updateLight(light.id, { x: val / 100 })}
                      />
                      <Slider
                        label="Pos Y"
                        value={Math.round(light.y * 100)}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        onChange={(val) => updateLight(light.id, { y: val / 100 })}
                      />
                    </div>

                    {/* Radius & Intensity */}
                    <Slider
                      label="Light Radius"
                      value={Math.round(light.radius * 100)}
                      min={5}
                      max={100}
                      step={1}
                      unit="%"
                      onChange={(val) => updateLight(light.id, { radius: val / 100 })}
                    />

                    <Slider
                      label="Light Intensity"
                      value={light.intensity}
                      min={0}
                      max={1}
                      step={0.05}
                      unit="x"
                      accentColor="lime"
                      onChange={(val) => updateLight(light.id, { intensity: val })}
                    />

                    {/* Color Swatches */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-[10px] text-obsidian-muted uppercase">
                        Light Color
                      </span>
                      <div className="flex items-center gap-1">
                        {colorPresets.map((c) => (
                          <button
                            key={c}
                            onClick={() => updateLight(light.id, { color: c })}
                            className={cn(
                              'w-3 h-3 rounded-xs border',
                              light.color === c ? 'border-white scale-110' : 'border-transparent'
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
