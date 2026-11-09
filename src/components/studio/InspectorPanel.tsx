import React from 'react';
import {
  ChevronDown,
  RotateCcw,
  Sliders,
  Palette,
  Layers,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';
import { Slider } from '../ui';
import { useStudioStore, BUILTIN_PALETTES } from '../../stores';
import { RenderMode } from '../../types';
import { ASCII_GLYPH_PRESETS } from '../../rendering-modes/AsciiRenderer';
import { cn } from '../../utilities';

interface InspectorSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onReset: () => void;
  badge?: string;
  children: React.ReactNode;
}

const InspectorSection: React.FC<InspectorSectionProps> = ({
  title,
  icon,
  isOpen,
  onToggle,
  onReset,
  badge,
  children,
}) => {
  return (
    <div className="border-b border-obsidian-border bg-obsidian-surface">
      {/* Section Header Accordion Trigger */}
      <div className="flex items-center justify-between p-3.5 hover:bg-obsidian-subtle/50 transition-colors select-none">
        <button
          onClick={onToggle}
          className="flex items-center gap-2.5 flex-1 text-left focus:outline-none"
        >
          <span className="text-acid-lime shrink-0">{icon}</span>
          <span className="font-mono text-xs uppercase font-semibold text-white tracking-wider">
            {title}
          </span>
          {badge && (
            <span className="font-mono text-[9px] px-1.5 py-0.2 bg-obsidian-950 border border-obsidian-border text-obsidian-muted uppercase rounded-xs">
              {badge}
            </span>
          )}
        </button>

        <div className="flex items-center gap-1">
          {/* Per-section Reset Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            title={`Reset ${title} Parameters to Defaults`}
            className="p-1 text-obsidian-muted hover:text-signal-coral rounded-xs transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <button
            onClick={onToggle}
            className="p-1 text-obsidian-muted hover:text-white rounded-xs transition-colors"
          >
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 transition-transform duration-200',
                isOpen ? 'rotate-180' : ''
              )}
            />
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && <div className="p-4 pt-1 space-y-5 border-t border-obsidian-border/50">{children}</div>}
    </div>
  );
};

export const InspectorPanel: React.FC = () => {
  const {
    config,
    setMode,
    updateRenderParams,
    updateColorConfig,
    updateBackgroundConfig,
    updateEffectsConfig,
    updateMotionConfig,
    updateAsciiConfig,
    updateDitherConfig,
    updateMosaicConfig,
    updateHalftoneConfig,
    setPalette,
    collapsedSections,
    toggleSection,
    resetRenderSection,
    resetColorSection,
    resetBackgroundSection,
    resetEffectsSection,
    resetMotionSection,
  } = useStudioStore();

  const allModesList: { id: RenderMode; label: string; group: string }[] = [
    // Character Based
    { id: 'ascii', label: 'ASCII Glyph', group: 'Character Based' },
    // Geometric
    { id: 'mosaic', label: 'Mosaic', group: 'Geometric' },
    { id: 'dots', label: 'Dots', group: 'Geometric' },
    { id: 'crosses', label: 'Crosses', group: 'Geometric' },
    { id: 'diamonds', label: 'Diamonds', group: 'Geometric' },
    { id: 'hexagons', label: 'Hexagons', group: 'Geometric' },
    { id: 'triangles', label: 'Triangles', group: 'Geometric' },
    { id: 'rings', label: 'Rings', group: 'Geometric' },
    { id: 'hearts', label: 'Hearts', group: 'Geometric' },
    { id: 'stars', label: 'Stars', group: 'Geometric' },
    { id: 'bubbles', label: 'Bubbles', group: 'Geometric' },
    { id: 'hatch', label: 'Hatch', group: 'Geometric' },
    { id: 'contour', label: 'Contour', group: 'Geometric' },
    // Pixel Based
    { id: 'pixel', label: 'Pixel Blocks', group: 'Pixel Based' },
    { id: 'halfblocks', label: 'Halfblocks ▀▄', group: 'Pixel Based' },
    { id: 'braille', label: 'Braille 2×4', group: 'Pixel Based' },
    // Pattern Based
    { id: 'diagonal-lines', label: 'Diagonal Lines', group: 'Pattern Based' },
    { id: 'lines', label: 'Lines Raster', group: 'Pattern Based' },
    { id: 'mixed-patterns', label: 'Mixed Patterns', group: 'Pattern Based' },
    { id: 'voxels', label: 'Voxels 3D', group: 'Pattern Based' },
    { id: 'lego', label: 'Lego Bricks', group: 'Pattern Based' },
    // Special
    { id: 'matrix-rain', label: 'Matrix Rain', group: 'Special' },
    { id: 'hexdump', label: 'Hexdump', group: 'Special' },
    { id: 'disco', label: 'Disco Ball', group: 'Special' },
    // Retro
    { id: 'dither', label: 'Ordered Dither', group: 'Retro' },
  ];

  // Group modes by category
  const groups = Array.from(new Set(allModesList.map((m) => m.group)));

  // Determine whether coverage applies to active mode
  const coverageSupported = ![
    'pixel',
    'dither',
    'ascii',
    'braille',
    'hexdump',
    'matrix-rain',
  ].includes(config.mode);

  return (
    <aside className="w-80 h-full bg-obsidian-surface border-l border-obsidian-border flex flex-col z-20 overflow-hidden select-none">
      {/* Inspector Title Bar */}
      <div className="h-10 px-4 bg-obsidian-950 border-b border-obsidian-border flex items-center justify-between">
        <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted font-semibold">
          Studio Inspector
        </span>
        <span className="font-mono text-2xs text-acid-lime uppercase font-semibold">
          {config.mode}
        </span>
      </div>

      {/* Accordion Sections Scroll Area */}
      <div className="flex-1 overflow-y-auto">
        {/* 1. RENDER SECTION */}
        <InspectorSection
          id="render"
          title="Render"
          icon={<Sliders className="w-4 h-4" />}
          isOpen={!collapsedSections.render}
          onToggle={() => toggleSection('render')}
          onReset={resetRenderSection}
          badge={config.mode}
        >
          {/* Render Mode Categorized Select Dropdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                Raster Engine ({allModesList.length} Modes)
              </label>
              <span title="Select active raster engine">
                <Info className="w-3 h-3 text-obsidian-muted" />
              </span>
            </div>

            <select
              value={config.mode}
              onChange={(e) => setMode(e.target.value as RenderMode)}
              className="w-full bg-obsidian-950 border border-obsidian-border hover:border-acid-lime/60 px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-acid-lime rounded-xs cursor-pointer"
            >
              {groups.map((group) => (
                <optgroup key={group} label={group.toUpperCase()} className="bg-obsidian-950 text-obsidian-muted font-semibold">
                  {allModesList
                    .filter((m) => m.group === group)
                    .map((m) => (
                      <option key={m.id} value={m.id} className="bg-obsidian-900 text-white font-normal">
                        {m.label}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Cell Size */}
          <Slider
            label="Cell Size"
            value={config.renderParams.cellSize}
            min={4}
            max={48}
            step={1}
            unit="px"
            onChange={(val) => {
              updateRenderParams({ cellSize: val });
              updateAsciiConfig({ fontSize: val, lineHeight: val });
              updateMosaicConfig({ cellSize: val });
              updateHalftoneConfig({ dotSize: val });
            }}
          />

          {/* Density */}
          <Slider
            label="Sampling Density"
            value={config.renderParams.density}
            min={0.2}
            max={2.0}
            step={0.1}
            unit="x"
            onChange={(val) => updateRenderParams({ density: val })}
          />

          {/* Coverage (Hidden or Disabled if not supported by mode) */}
          {coverageSupported ? (
            <Slider
              label="Raster Coverage"
              value={config.renderParams.coverage}
              min={10}
              max={100}
              step={5}
              unit="%"
              onChange={(val) => updateRenderParams({ coverage: val })}
            />
          ) : (
            <div className="flex items-center justify-between py-1 opacity-40">
              <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                Raster Coverage
              </span>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-obsidian-950 border border-obsidian-border text-obsidian-muted rounded-xs">
                Fixed to Cell
              </span>
            </div>
          )}

          {/* Edge Emphasis */}
          <Slider
            label="Edge Emphasis"
            value={config.renderParams.edgeEmphasis}
            min={0}
            max={100}
            step={5}
            unit="%"
            accentColor="violet"
            onChange={(val) => updateRenderParams({ edgeEmphasis: val })}
          />

          {/* Invert Direction */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Invert Luminance
            </span>
            <button
              onClick={() => {
                const next = !config.renderParams.invert;
                updateRenderParams({ invert: next });
                updateAsciiConfig({ invert: next });
              }}
              className={cn(
                'px-2.5 py-1 font-mono text-2xs uppercase rounded-xs border transition-colors',
                config.renderParams.invert
                  ? 'border-acid-lime text-acid-lime bg-acid-lime/10'
                  : 'border-obsidian-border text-obsidian-muted hover:text-white'
              )}
            >
              {config.renderParams.invert ? 'Inverted' : 'Normal'}
            </button>
          </div>

          {/* Mode-Specific Extras */}
          {(config.mode === 'ascii' || config.mode === 'matrix-rain' || config.mode === 'hexdump') && (
            <div className="space-y-2 pt-2 border-t border-obsidian-border">
              <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                Glyph Ramp (CharSet)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {ASCII_GLYPH_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      updateRenderParams({ charSet: preset.chars });
                      updateAsciiConfig({ characters: preset.chars });
                    }}
                    className={cn(
                      'p-1.5 text-[10px] font-mono uppercase tracking-wider rounded-xs border text-left truncate',
                      (config.renderParams.charSet || config.ascii.characters) === preset.chars
                        ? 'border-acid-lime text-white bg-obsidian-950'
                        : 'border-obsidian-border text-obsidian-muted hover:text-white'
                    )}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <div className="pt-1.5">
                <input
                  type="text"
                  value={config.renderParams.charSet || config.ascii.characters}
                  onChange={(e) => {
                    updateRenderParams({ charSet: e.target.value });
                    updateAsciiConfig({ characters: e.target.value });
                  }}
                  className="w-full bg-obsidian-950 border border-obsidian-border px-2.5 py-1 font-mono text-xs text-acid-lime focus:outline-none focus:border-acid-lime rounded-xs"
                  placeholder="Custom characters..."
                />
              </div>
            </div>
          )}

          {config.mode === 'dither' && (
            <div className="space-y-2 pt-2 border-t border-obsidian-border">
              <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                Dither Algorithm
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['atkinson', 'bayer-8x8', 'floyd-steinberg', 'bayer-4x4'] as const).map(
                  (algo) => (
                    <button
                      key={algo}
                      onClick={() => updateDitherConfig({ algorithm: algo })}
                      className={cn(
                        'p-1.5 text-[10px] font-mono uppercase tracking-wider rounded-xs border text-left truncate',
                        config.dither.algorithm === algo
                          ? 'border-acid-lime text-white bg-obsidian-950'
                          : 'border-obsidian-border text-obsidian-muted hover:text-white'
                      )}
                    >
                      {algo}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </InspectorSection>

        {/* 2. COLOR SECTION */}
        <InspectorSection
          id="color"
          title="Color"
          icon={<Palette className="w-4 h-4" />}
          isOpen={!collapsedSections.color}
          onToggle={() => toggleSection('color')}
          onReset={resetColorSection}
        >
          {/* Active Palette Picker */}
          <div className="space-y-2">
            <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Studio Palette
            </label>
            <div className="space-y-1.5">
              {BUILTIN_PALETTES.map((pal) => {
                const isSelected = config.palette.id === pal.id;
                return (
                  <button
                    key={pal.id}
                    onClick={() => setPalette(pal)}
                    className={cn(
                      'w-full p-2 text-left border rounded-xs transition-all flex items-center justify-between',
                      isSelected
                        ? 'border-acid-lime bg-obsidian-950'
                        : 'border-obsidian-border bg-obsidian-950 hover:border-obsidian-border-hover'
                    )}
                  >
                    <span className="font-mono text-2xs uppercase text-white font-medium">
                      {pal.name}
                    </span>
                    <div className="flex h-2.5 w-16 border border-obsidian-border overflow-hidden">
                      {pal.colors.map((c, i) => (
                        <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Slider
            label="Brightness"
            value={config.color.brightness}
            min={-50}
            max={50}
            step={1}
            onChange={(val) => {
              updateColorConfig({ brightness: val });
              updateAsciiConfig({ brightness: val });
            }}
          />

          <Slider
            label="Contrast"
            value={config.color.contrast}
            min={-50}
            max={80}
            step={1}
            onChange={(val) => {
              updateColorConfig({ contrast: val });
              updateAsciiConfig({ contrast: val });
            }}
          />

          <Slider
            label="Saturation"
            value={config.color.saturation}
            min={0}
            max={3}
            step={0.1}
            unit="x"
            onChange={(val) => updateColorConfig({ saturation: val })}
          />

          {/* Grayscale Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Grayscale Sensor
            </span>
            <button
              onClick={() => updateColorConfig({ grayscale: !config.color.grayscale })}
              className={cn(
                'px-2.5 py-1 font-mono text-2xs uppercase rounded-xs border transition-colors',
                config.color.grayscale
                  ? 'border-white text-white bg-white/10'
                  : 'border-obsidian-border text-obsidian-muted hover:text-white'
              )}
            >
              {config.color.grayscale ? 'Monochrome' : 'Full Spectrum'}
            </button>
          </div>

          {/* Tint & Tint Opacity */}
          <div className="space-y-2 pt-2 border-t border-obsidian-border">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                Chromatic Tint
              </span>
              <div className="flex items-center gap-1.5">
                {['#CCFF00', '#9D4EDD', '#FF473A', '#33E533', '#FFB833'].map((c) => (
                  <button
                    key={c}
                    onClick={() => updateColorConfig({ tintColor: c })}
                    className={cn(
                      'w-3.5 h-3.5 rounded-xs border',
                      config.color.tintColor === c ? 'border-white scale-110' : 'border-transparent'
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <Slider
              label="Tint Opacity"
              value={config.color.tintOpacity}
              min={0}
              max={1}
              step={0.05}
              unit="x"
              onChange={(val) => updateColorConfig({ tintOpacity: val })}
            />
          </div>
        </InspectorSection>

        {/* 3. BACKGROUND SECTION */}
        <InspectorSection
          id="background"
          title="Background"
          icon={<Layers className="w-4 h-4" />}
          isOpen={!collapsedSections.background}
          onToggle={() => toggleSection('background')}
          onReset={resetBackgroundSection}
        >
          <div className="space-y-2">
            <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Background Mode
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['solid', 'transparent', 'source-blur', 'grid'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateBackgroundConfig({ mode })}
                  className={cn(
                    'p-2 text-2xs font-mono uppercase tracking-wider rounded-xs border text-center transition-colors',
                    config.background.mode === mode
                      ? 'border-acid-lime text-white bg-obsidian-950 font-semibold'
                      : 'border-obsidian-border text-obsidian-muted hover:text-white'
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <Slider
            label="Background Opacity"
            value={config.background.opacity}
            min={0}
            max={1}
            step={0.05}
            unit="x"
            onChange={(val) => updateBackgroundConfig({ opacity: val })}
          />

          <Slider
            label="Background Blur"
            value={config.background.blur}
            min={0}
            max={40}
            step={1}
            unit="px"
            onChange={(val) => updateBackgroundConfig({ blur: val })}
          />
        </InspectorSection>

        {/* 4. EFFECTS SECTION */}
        <InspectorSection
          id="effects"
          title="Effects"
          icon={<Sparkles className="w-4 h-4" />}
          isOpen={!collapsedSections.effects}
          onToggle={() => toggleSection('effects')}
          onReset={resetEffectsSection}
        >
          <Slider
            label="Bloom Glow"
            value={config.effects.bloom}
            min={0}
            max={30}
            step={1}
            unit="px"
            accentColor="violet"
            onChange={(val) => {
              updateEffectsConfig({ bloom: val });
              updateAsciiConfig({ glow: val });
            }}
          />

          <Slider
            label="Vignette"
            value={config.effects.vignette}
            min={0}
            max={1}
            step={0.05}
            unit="x"
            onChange={(val) => updateEffectsConfig({ vignette: val })}
          />

          <Slider
            label="CRT Scanlines"
            value={config.effects.scanlines}
            min={0}
            max={1}
            step={0.05}
            unit="x"
            onChange={(val) => updateEffectsConfig({ scanlines: val })}
          />

          <Slider
            label="Film Grain"
            value={config.effects.filmGrain}
            min={0}
            max={1}
            step={0.05}
            unit="x"
            onChange={(val) => updateEffectsConfig({ filmGrain: val })}
          />

          <Slider
            label="Chromatic Aberration"
            value={config.effects.chromaticAberration}
            min={0}
            max={16}
            step={1}
            unit="px"
            accentColor="coral"
            onChange={(val) => updateEffectsConfig({ chromaticAberration: val })}
          />

          <Slider
            label="Signal Glitch"
            value={config.effects.glitch}
            min={0}
            max={1}
            step={0.05}
            unit="x"
            accentColor="coral"
            onChange={(val) => updateEffectsConfig({ glitch: val })}
          />
        </InspectorSection>

        {/* 5. MOTION SECTION */}
        <InspectorSection
          id="motion"
          title="Motion"
          icon={<Zap className="w-4 h-4" />}
          isOpen={!collapsedSections.motion}
          onToggle={() => toggleSection('motion')}
          onReset={resetMotionSection}
          badge={config.motion.isPlaying ? 'ACTIVE' : undefined}
        >
          {/* Animation Toggle */}
          <div className="flex items-center justify-between pb-1">
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Live Motion Engine
            </span>
            <button
              onClick={() => updateMotionConfig({ isPlaying: !config.motion.isPlaying })}
              className={cn(
                'px-2.5 py-1 font-mono text-2xs uppercase rounded-xs border transition-colors',
                config.motion.isPlaying
                  ? 'border-acid-lime text-acid-lime bg-acid-lime/10 shadow-active-lime'
                  : 'border-obsidian-border text-obsidian-muted hover:text-white'
              )}
            >
              {config.motion.isPlaying ? 'Running (60FPS)' : 'Paused'}
            </button>
          </div>

          {/* Animation Style */}
          <div className="space-y-2">
            <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Oscillation Waveform
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['none', 'scanline', 'sine-wave', 'glitch', 'matrix-rain', 'pulse'] as const).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() =>
                      updateMotionConfig({
                        type,
                        isPlaying: type !== 'none',
                      })
                    }
                    className={cn(
                      'p-2 text-2xs font-mono uppercase tracking-wider rounded-xs border text-left truncate transition-colors',
                      config.motion.type === type
                        ? 'border-electric-violet text-electric-violet-light bg-electric-violet/10'
                        : 'border-obsidian-border text-obsidian-muted hover:text-white'
                    )}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          <Slider
            label="Motion Speed"
            value={config.motion.speed}
            min={0.2}
            max={3.0}
            step={0.1}
            unit="x"
            accentColor="violet"
            onChange={(val) => updateMotionConfig({ speed: val })}
          />

          <Slider
            label="Motion Intensity"
            value={config.motion.intensity}
            min={0.1}
            max={2.0}
            step={0.1}
            unit="x"
            accentColor="violet"
            onChange={(val) => updateMotionConfig({ intensity: val })}
          />
        </InspectorSection>
      </div>
    </aside>
  );
};
