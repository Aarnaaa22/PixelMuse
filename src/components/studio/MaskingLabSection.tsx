import React, { useRef } from 'react';
import { UploadCloud, RotateCcw, Trash2, Focus } from 'lucide-react';
import { Slider } from '../ui';
import { useStudioStore } from '../../stores';
import { DEFAULT_MASK_CONFIG } from '../../stores/studioStore';
import { cn } from '../../utilities';

interface MaskingLabSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const MaskingLabSection: React.FC<MaskingLabSectionProps> = ({
  isOpen,
  onToggle,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { config, setMaskImage, clearMaskImage, updateMaskConfig } = useStudioStore();

  const mask = config.mask || DEFAULT_MASK_CONFIG;
  const { enabled, maskMetadata, invert, feather, opacity } = mask;

  const handleMaskUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setMaskImage(canvas, {
          name: file.name,
          width: img.width,
          height: img.height,
        });
      }
    };
    img.src = URL.createObjectURL(file);
    e.target.value = '';
  };

  return (
    <div className="border-b border-obsidian-border bg-obsidian-surface">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleMaskUpload}
        className="hidden"
      />

      {/* Section Header Accordion */}
      <div className="flex items-center justify-between p-3.5 hover:bg-obsidian-subtle/50 transition-colors select-none">
        <button
          onClick={onToggle}
          className="flex items-center gap-2.5 flex-1 text-left focus:outline-none"
        >
          <span className="text-acid-lime shrink-0">
            <Focus className="w-4 h-4" />
          </span>
          <span className="font-mono text-xs uppercase font-semibold text-white tracking-wider">
            Masking Lab
          </span>
          {enabled && maskMetadata && (
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
            title="Reset Masking to Defaults"
            className="p-1 text-obsidian-muted hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 pt-1 space-y-4 border-t border-obsidian-border/50">
          {/* Mask Upload / Status */}
          {maskMetadata ? (
            <div className="p-3 bg-obsidian-950 border border-obsidian-border rounded-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-mono text-xs text-white uppercase font-medium block truncate max-w-[180px]">
                    {maskMetadata.name}
                  </span>
                  <span className="font-mono text-[9px] text-obsidian-muted block">
                    {maskMetadata.width} × {maskMetadata.height}px
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateMaskConfig({ enabled: !enabled })}
                    className={cn(
                      'px-2 py-0.5 font-mono text-[10px] uppercase rounded-xs border transition-colors',
                      enabled
                        ? 'border-acid-lime text-acid-lime bg-acid-lime/10'
                        : 'border-obsidian-border text-obsidian-muted'
                    )}
                  >
                    {enabled ? 'Active' : 'Muted'}
                  </button>

                  <button
                    onClick={clearMaskImage}
                    className="p-1 text-obsidian-muted hover:text-signal-coral transition-colors"
                    title="Remove Mask"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-obsidian-border hover:border-acid-lime/60 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-obsidian-950 rounded-xs group"
            >
              <UploadCloud className="w-5 h-5 text-obsidian-muted group-hover:text-acid-lime mb-2 transition-colors" />
              <span className="font-mono text-xs uppercase text-white font-medium">
                Load Mask Image
              </span>
              <span className="font-mono text-[9px] text-obsidian-muted mt-0.5">
                PNG, JPEG luma or alpha channel
              </span>
            </div>
          )}

          {maskMetadata && (
            <>
              {/* Invert Mask Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                  Invert Mask Reveal
                </span>
                <button
                  onClick={() => updateMaskConfig({ invert: !invert })}
                  className={cn(
                    'px-2.5 py-1 font-mono text-2xs uppercase rounded-xs border transition-colors',
                    invert
                      ? 'border-acid-lime text-acid-lime bg-acid-lime/10'
                      : 'border-obsidian-border text-obsidian-muted hover:text-white'
                  )}
                >
                  {invert ? 'Inverted' : 'Standard'}
                </button>
              </div>

              {/* Edge Feather Radius */}
              <Slider
                label="Edge Feathering"
                value={feather}
                min={0}
                max={40}
                step={1}
                unit="px"
                accentColor="lime"
                onChange={(val) => updateMaskConfig({ feather: val })}
              />

              {/* Reveal Opacity */}
              <Slider
                label="Reveal Blend Opacity"
                value={opacity}
                min={0}
                max={1}
                step={0.05}
                unit="x"
                accentColor="lime"
                onChange={(val) => updateMaskConfig({ opacity: val })}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
