import React from 'react';
import { Sliders, Palette, Zap, Image as ImageIcon } from 'lucide-react';
import { Slider, TabGroup } from '../ui';
import { useStudioStore, BUILTIN_PALETTES } from '../../stores';
import { cn } from '../../utilities';

export const InspectorPanel: React.FC = () => {
  const {
    config,
    activeInspectorTab,
    setActiveInspectorTab,
    updateAsciiConfig,
    updateDitherConfig,
    updateMosaicConfig,
    updateHalftoneConfig,
    updateConfig,
    setPalette,
  } = useStudioStore();

  const tabs = [
    { id: 'render' as const, label: 'Mode', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'palette' as const, label: 'Color', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'motion' as const, label: 'Motion', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'export' as const, label: 'Input', icon: <ImageIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <aside className="w-80 h-full bg-obsidian-surface border-l border-obsidian-border flex flex-col z-20 overflow-hidden">
      {/* Tab Navigation */}
      <div className="px-3 pt-3">
        <TabGroup
          tabs={tabs}
          activeId={activeInspectorTab}
          onChange={(tab) => setActiveInspectorTab(tab)}
          variant="pill"
          className="w-full justify-between"
        />
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeInspectorTab === 'render' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-obsidian-border flex items-center justify-between">
              <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                Parameters
              </span>
              <span className="font-mono text-2xs text-acid-lime uppercase">
                {config.mode}
              </span>
            </div>

            {/* ASCII Mode Controls */}
            {config.mode === 'ascii' && (
              <div className="space-y-5">
                <Slider
                  label="Font Size"
                  value={config.ascii.fontSize}
                  min={6}
                  max={28}
                  step={1}
                  unit="px"
                  onChange={(fontSize) => updateAsciiConfig({ fontSize, lineHeight: fontSize })}
                />

                <Slider
                  label="Contrast"
                  value={config.ascii.contrast}
                  min={-50}
                  max={80}
                  step={2}
                  onChange={(contrast) => updateAsciiConfig({ contrast })}
                />

                <Slider
                  label="Brightness"
                  value={config.ascii.brightness}
                  min={-50}
                  max={50}
                  step={1}
                  onChange={(brightness) => updateAsciiConfig({ brightness })}
                />

                <Slider
                  label="Glow Radius"
                  value={config.ascii.glow}
                  min={0}
                  max={20}
                  step={1}
                  unit="px"
                  accentColor="violet"
                  onChange={(glow) => updateAsciiConfig({ glow })}
                />

                <div className="space-y-2 pt-2 border-t border-obsidian-border">
                  <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                    Glyph Ramp
                  </label>
                  <input
                    type="text"
                    value={config.ascii.characters}
                    onChange={(e) => updateAsciiConfig({ characters: e.target.value })}
                    className="w-full bg-obsidian-950 border border-obsidian-border px-3 py-1.5 font-mono text-xs text-acid-lime focus:outline-none focus:border-acid-lime"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                    Invert Luminance
                  </span>
                  <button
                    onClick={() => updateAsciiConfig({ invert: !config.ascii.invert })}
                    className={cn(
                      'px-2.5 py-1 text-2xs font-mono uppercase rounded-xs border',
                      config.ascii.invert
                        ? 'border-acid-lime text-acid-lime bg-acid-lime/10'
                        : 'border-obsidian-border text-obsidian-muted'
                    )}
                  >
                    {config.ascii.invert ? 'Inverted' : 'Normal'}
                  </button>
                </div>
              </div>
            )}

            {/* Dither Mode Controls */}
            {config.mode === 'dither' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                    Dither Algorithm
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['bayer-4x4', 'bayer-8x8'] as const).map((algo) => (
                      <button
                        key={algo}
                        onClick={() => updateDitherConfig({ algorithm: algo })}
                        className={cn(
                          'p-2 text-2xs font-mono uppercase tracking-wider rounded-xs border text-left',
                          config.dither.algorithm === algo
                            ? 'border-acid-lime text-white bg-obsidian-subtle'
                            : 'border-obsidian-border text-obsidian-muted hover:text-white'
                        )}
                      >
                        {algo}
                      </button>
                    ))}
                  </div>
                </div>

                <Slider
                  label="Dither Scale"
                  value={config.dither.scale}
                  min={1}
                  max={6}
                  step={1}
                  unit="x"
                  onChange={(scale) => updateDitherConfig({ scale })}
                />
              </div>
            )}

            {/* Pixel Mosaic Mode Controls */}
            {config.mode === 'pixel-mosaic' && (
              <div className="space-y-5">
                <Slider
                  label="Cell Size"
                  value={config.mosaic.cellSize}
                  min={4}
                  max={36}
                  step={1}
                  unit="px"
                  onChange={(cellSize) => updateMosaicConfig({ cellSize })}
                />

                <Slider
                  label="Cell Gap"
                  value={config.mosaic.gap}
                  min={0}
                  max={8}
                  step={1}
                  unit="px"
                  onChange={(gap) => updateMosaicConfig({ gap })}
                />

                <div className="space-y-2">
                  <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                    Tile Geometry
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['square', 'circle', 'diamond'] as const).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => updateMosaicConfig({ shape })}
                        className={cn(
                          'p-2 text-2xs font-mono uppercase tracking-wider rounded-xs border text-center',
                          config.mosaic.shape === shape
                            ? 'border-acid-lime text-white bg-obsidian-subtle'
                            : 'border-obsidian-border text-obsidian-muted hover:text-white'
                        )}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Halftone Mode Controls */}
            {config.mode === 'halftone' && (
              <div className="space-y-5">
                <Slider
                  label="Screen Dot Size"
                  value={config.halftone.dotSize}
                  min={6}
                  max={32}
                  step={1}
                  unit="px"
                  onChange={(dotSize) => updateHalftoneConfig({ dotSize })}
                />

                <Slider
                  label="Screen Angle"
                  value={config.halftone.angle}
                  min={0}
                  max={90}
                  step={5}
                  unit="°"
                  onChange={(angle) => updateHalftoneConfig({ angle })}
                />
              </div>
            )}
          </div>
        )}

        {/* Palette Tab */}
        {activeInspectorTab === 'palette' && (
          <div className="space-y-4">
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted block pb-2 border-b border-obsidian-border">
              Curated Studio Palettes
            </span>

            <div className="space-y-2.5">
              {BUILTIN_PALETTES.map((pal) => {
                const isSelected = config.palette.id === pal.id;
                return (
                  <button
                    key={pal.id}
                    onClick={() => setPalette(pal)}
                    className={cn(
                      'w-full p-3 text-left border rounded-xs transition-all flex flex-col gap-2',
                      isSelected
                        ? 'border-acid-lime bg-obsidian-subtle shadow-crisp-border'
                        : 'border-obsidian-border bg-obsidian-surface hover:border-obsidian-border-hover'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase font-medium text-white">
                        {pal.name}
                      </span>
                      <span className="font-mono text-2xs text-obsidian-muted uppercase">
                        {pal.category}
                      </span>
                    </div>

                    <div className="flex h-4 w-full border border-obsidian-border overflow-hidden">
                      {pal.colors.map((color, i) => (
                        <div
                          key={i}
                          className="flex-1 h-full"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Motion Tab */}
        {activeInspectorTab === 'motion' && (
          <div className="space-y-5">
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted block pb-2 border-b border-obsidian-border">
              Parametric Oscillators
            </span>

            <div className="space-y-2">
              <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                Motion Wave Form
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['none', 'scanline', 'sine-wave', 'glitch'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      updateConfig({
                        motion: {
                          ...config.motion,
                          type,
                          isPlaying: type !== 'none',
                        },
                      })
                    }
                    className={cn(
                      'p-2 text-2xs font-mono uppercase tracking-wider rounded-xs border text-left',
                      config.motion.type === type
                        ? 'border-electric-violet text-electric-violet-light bg-electric-violet/10'
                        : 'border-obsidian-border text-obsidian-muted hover:text-white'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <Slider
              label="Wave Intensity"
              value={config.motion.intensity}
              min={0.1}
              max={2.0}
              step={0.1}
              accentColor="violet"
              onChange={(intensity) =>
                updateConfig({
                  motion: { ...config.motion, intensity },
                })
              }
            />

            <Slider
              label="Speed Multiplier"
              value={config.motion.speed}
              min={0.2}
              max={3.0}
              step={0.1}
              unit="x"
              accentColor="violet"
              onChange={(speed) =>
                updateConfig({
                  motion: { ...config.motion, speed },
                })
              }
            />
          </div>
        )}

        {/* Input & Output Config Tab */}
        {activeInspectorTab === 'export' && (
          <div className="space-y-5">
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted block pb-2 border-b border-obsidian-border">
              Pipeline Raster Scaling
            </span>

            <Slider
              label="Pipeline Resolution"
              value={config.resolutionScale}
              min={0.5}
              max={2.0}
              step={0.25}
              unit="x"
              onChange={(resolutionScale) => updateConfig({ resolutionScale })}
            />
          </div>
        )}
      </div>
    </aside>
  );
};

