import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Check,
  Sparkles,
  AlertCircle,
  Maximize2,
  Lock,
  Unlock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../ui';
import { useStudioStore } from '../../stores';
import { ExportFormat } from '../../types';
import { CanvasPipeline } from '../../rendering-engine';
import { CellGridSampler } from '../../image-processing';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DimensionPreset = 'source' | 'square-hd' | 'square-2k' | 'fhd-16-9' | 'uhd-4k' | 'portrait-9-16' | 'custom';

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { config, projectName, sourceImage, imageMetadata } = useStudioStore();

  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState<number>(1);
  const [dimensionPreset, setDimensionPreset] = useState<DimensionPreset>('source');
  const [customWidth, setCustomWidth] = useState<number>(1920);
  const [customHeight, setCustomHeight] = useState<number>(1080);
  const [aspectRatioLocked, setAspectRatioLocked] = useState<boolean>(true);
  const [transparentBg, setTransparentBg] = useState<boolean>(false);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Initialize dimensions based on image metadata or defaults
  useEffect(() => {
    if (imageMetadata) {
      setCustomWidth(imageMetadata.width);
      setCustomHeight(imageMetadata.height);
    } else {
      setCustomWidth(1920);
      setCustomHeight(1080);
    }
  }, [imageMetadata]);

  if (!isOpen) return null;

  // Compute final export width and height
  const getTargetDimensions = (): { width: number; height: number } => {
    let baseW = 1920;
    let baseH = 1080;

    if (imageMetadata) {
      baseW = imageMetadata.width;
      baseH = imageMetadata.height;
    }

    switch (dimensionPreset) {
      case 'source':
        return { width: Math.round(baseW * scale), height: Math.round(baseH * scale) };
      case 'square-hd':
        return { width: Math.round(1080 * scale), height: Math.round(1080 * scale) };
      case 'square-2k':
        return { width: Math.round(2048 * scale), height: Math.round(2048 * scale) };
      case 'fhd-16-9':
        return { width: Math.round(1920 * scale), height: Math.round(1080 * scale) };
      case 'uhd-4k':
        return { width: Math.round(3840 * scale), height: Math.round(2160 * scale) };
      case 'portrait-9-16':
        return { width: Math.round(1080 * scale), height: Math.round(1920 * scale) };
      case 'custom':
        return {
          width: Math.round(Math.max(64, Math.min(8192, customWidth)) * scale),
          height: Math.round(Math.max(64, Math.min(8192, customHeight)) * scale),
        };
      default:
        return { width: baseW, height: baseH };
    }
  };

  const { width: finalWidth, height: finalHeight } = getTargetDimensions();
  const supportsTransparency = format === 'png' || format === 'webp';
  const isHighResolution = finalWidth > 4096 || finalHeight > 4096;

  const handleWidthChange = (val: number) => {
    setCustomWidth(val);
    if (aspectRatioLocked) {
      const ratio = imageMetadata ? imageMetadata.aspectRatio : 16 / 9;
      setCustomHeight(Math.round(val / ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setCustomHeight(val);
    if (aspectRatioLocked) {
      const ratio = imageMetadata ? imageMetadata.aspectRatio : 16 / 9;
      setCustomWidth(Math.round(val * ratio));
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    setDownloadSuccess(null);
    setExportProgress('Initializing unified raster pipeline...');

    try {
      // Practical browser memory limits guard
      if (finalWidth > 8192 || finalHeight > 8192) {
        throw new Error(
          `Requested resolution (${finalWidth}×${finalHeight}px) exceeds the safe browser limit of 8192px. Please reduce the scale multiplier.`
        );
      }

      // JSON Configuration Export
      if (format === 'json') {
        setExportProgress('Serializing project settings...');
        const payload = {
          name: projectName,
          version: '1.0',
          exportedAt: new Date().toISOString(),
          dimensions: { width: finalWidth, height: finalHeight },
          config,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `${projectName.toLowerCase().replace(/\s+/g, '_')}_config.json`;
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setDownloadSuccess(filename);
        setIsExporting(false);
        return;
      }

      // Offscreen Master Rendering Canvas
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = finalWidth;
      exportCanvas.height = finalHeight;

      // Pipeline execution
      setExportProgress(`Executing raster cores at ${finalWidth}×${finalHeight}px...`);

      // Prepare configuration with transparency override if requested
      const exportConfig = {
        ...config,
        background: {
          ...config.background,
          mode: transparentBg && supportsTransparency ? ('none' as const) : config.background.mode,
        },
      };

      let source = sourceImage;
      if (!source) {
        // Fallback to active stage canvas
        const activeCanvas = document.querySelector('canvas');
        if (!activeCanvas) {
          throw new Error('No artwork canvas available for rendering. Load an image or preset.');
        }
        source = activeCanvas;
      }

      const pipeline = new CanvasPipeline();
      pipeline.attach(exportCanvas);
      pipeline.execute(
        source,
        finalWidth,
        finalHeight,
        exportConfig,
        config.motion.currentTime || 0
      );

      // TXT ASCII Glyph Matrix Export
      if (format === 'txt') {
        setExportProgress('Extracting luminance glyph matrix...');
        const tCtx = exportCanvas.getContext('2d');
        const imgData = tCtx?.getImageData(0, 0, finalWidth, finalHeight);
        let asciiText = '';

        if (imgData) {
          const chars = config.renderParams.charSet || config.ascii.characters || ' .:-=+*#%@';
          const grid = CellGridSampler.sample(
            imgData,
            Math.max(4, config.renderParams.cellSize),
            config.renderParams.density
          );
          const lines: string[] = [];
          for (let r = 0; r < grid.rows; r++) {
            let line = '';
            for (let c = 0; c < grid.cols; c++) {
              const cell = grid.cells[r * grid.cols + c];
              if (cell) {
                const lum = config.renderParams.invert ? 1 - cell.luminance : cell.luminance;
                const idx = Math.min(chars.length - 1, Math.max(0, Math.floor(lum * chars.length)));
                line += chars[idx];
              }
            }
            lines.push(line);
          }
          asciiText = lines.join('\n');
        }

        const textContent =
          `/* PIXELMUSE GENERATIVE ART MATRIX */\n` +
          `/* PROJECT: ${projectName} */\n` +
          `/* MODE: ${config.mode.toUpperCase()} - RESOLUTION: ${finalWidth}x${finalHeight}px */\n` +
          `/* DATE: ${new Date().toLocaleString()} */\n\n` +
          asciiText;

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `${projectName.toLowerCase().replace(/\s+/g, '_')}_matrix.txt`;
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setDownloadSuccess(filename);
        setIsExporting(false);
      } else {
        // Image Formats: PNG, JPEG, WebP
        setExportProgress(`Encoding ${format.toUpperCase()} master buffer...`);
        const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
        const quality = format === 'jpeg' ? 0.95 : 0.96;

        exportCanvas.toBlob(
          (blob) => {
            if (!blob) {
              setExportError('Failed to generate image buffer from canvas.');
              setIsExporting(false);
              return;
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const filename = `${projectName.toLowerCase().replace(/\s+/g, '_')}_${finalWidth}x${finalHeight}.${format}`;
            link.download = filename;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            setDownloadSuccess(filename);
            setIsExporting(false);
          },
          mime,
          quality
        );
      }
    } catch (err: unknown) {
      console.error('[PixelMuse] Export failed:', err);
      const msg = err instanceof Error ? err.message : 'Export failed due to browser limitations.';
      setExportError(msg);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md select-none">
      <div className="w-full max-w-xl bg-obsidian-surface border border-obsidian-border p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-obsidian-muted hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-obsidian-border mb-5">
          <div className="w-8 h-8 rounded-xs bg-obsidian-subtle border border-acid-lime/50 flex items-center justify-center text-acid-lime">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-sm uppercase tracking-widest text-white">
              Export Master Artwork
            </h3>
            <p className="font-mono text-2xs text-obsidian-muted">
              Lossless 2D canvas pipeline • {finalWidth} × {finalHeight} PX
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {downloadSuccess && (
          <div className="mb-4 p-3 bg-acid-lime/10 border border-acid-lime/40 text-acid-lime font-mono text-xs flex items-center gap-2.5 rounded-xs animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <div>
              <span className="font-bold">Export Complete:</span> {downloadSuccess}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {exportError && (
          <div className="mb-4 p-3 bg-signal-coral/10 border border-signal-coral/40 text-signal-coral font-mono text-xs flex items-start gap-2.5 rounded-xs animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Export Error:</span> {exportError}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {/* 1. Format Selection */}
          <div className="space-y-2">
            <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted block">
              1. Master Format
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'png', label: 'PNG', sub: 'Lossless' },
                { id: 'jpeg', label: 'JPEG', sub: 'Compressed' },
                { id: 'webp', label: 'WebP', sub: 'Modern' },
                { id: 'txt', label: 'TXT', sub: 'ASCII Matrix' },
                { id: 'json', label: 'JSON', sub: 'Preset Config' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormat(fmt.id as ExportFormat)}
                  className={`p-2.5 rounded-xs border text-left transition-colors flex flex-col justify-between ${
                    format === fmt.id
                      ? 'border-acid-lime bg-obsidian-subtle shadow-crisp-border'
                      : 'border-obsidian-border bg-obsidian-950 hover:border-obsidian-border-hover'
                  }`}
                >
                  <span
                    className={`font-mono text-xs uppercase font-bold ${
                      format === fmt.id ? 'text-white' : 'text-obsidian-text'
                    }`}
                  >
                    {fmt.label}
                  </span>
                  <span className="font-mono text-[9px] text-obsidian-muted mt-0.5">
                    {fmt.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Transparent Background Toggle (where supported) */}
          {supportsTransparency && (
            <div className="p-3 bg-obsidian-950 border border-obsidian-border rounded-xs flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-white uppercase font-medium block">
                  Transparent Background
                </span>
                <span className="font-mono text-2xs text-obsidian-muted block mt-0.5">
                  Renders generative elements with alpha transparency (PNG/WebP only)
                </span>
              </div>
              <input
                type="checkbox"
                checked={transparentBg}
                onChange={(e) => setTransparentBg(e.target.checked)}
                className="w-4 h-4 accent-acid-lime rounded-xs cursor-pointer"
              />
            </div>
          )}

          {/* 3. Dimension Presets */}
          <div className="space-y-2">
            <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted block">
              2. Dimensions & Aspect Ratio
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'source', label: 'Original Source', desc: imageMetadata ? `${imageMetadata.width}×${imageMetadata.height}` : 'Canvas Default' },
                { id: 'square-hd', label: 'Square HD', desc: '1080 × 1080' },
                { id: 'square-2k', label: 'Square 2K', desc: '2048 × 2048' },
                { id: 'fhd-16-9', label: '16:9 FHD', desc: '1920 × 1080' },
                { id: 'uhd-4k', label: '4K Ultra HD', desc: '3840 × 2160' },
                { id: 'portrait-9-16', label: '9:16 Story/Reel', desc: '1080 × 1920' },
                { id: 'custom', label: 'Custom', desc: 'User Defined' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setDimensionPreset(p.id as DimensionPreset)}
                  className={`p-2 rounded-xs border text-left transition-colors ${
                    dimensionPreset === p.id
                      ? 'border-acid-lime bg-obsidian-subtle'
                      : 'border-obsidian-border bg-obsidian-950 hover:border-obsidian-border-hover'
                  }`}
                >
                  <span
                    className={`font-mono text-xs uppercase block font-semibold truncate ${
                      dimensionPreset === p.id ? 'text-acid-lime' : 'text-white'
                    }`}
                  >
                    {p.label}
                  </span>
                  <span className="font-mono text-[9px] text-obsidian-muted block mt-0.5 truncate">
                    {p.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Dimension Inputs if Custom Selected */}
          {dimensionPreset === 'custom' && (
            <div className="p-3 bg-obsidian-950 border border-obsidian-border rounded-xs grid grid-cols-12 gap-3 items-end">
              <div className="col-span-5">
                <label className="block font-mono text-2xs uppercase text-obsidian-muted mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  min={64}
                  max={8192}
                  value={customWidth}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full bg-obsidian-subtle border border-obsidian-border px-2.5 py-1 font-mono text-xs text-white focus:outline-none focus:border-acid-lime"
                />
              </div>

              <div className="col-span-2 flex justify-center pb-1">
                <button
                  type="button"
                  onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
                  className={`p-1.5 border rounded-xs transition-colors ${
                    aspectRatioLocked
                      ? 'border-acid-lime text-acid-lime bg-acid-lime/10'
                      : 'border-obsidian-border text-obsidian-muted hover:text-white'
                  }`}
                  title={aspectRatioLocked ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
                >
                  {aspectRatioLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="col-span-5">
                <label className="block font-mono text-2xs uppercase text-obsidian-muted mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  min={64}
                  max={8192}
                  value={customHeight}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full bg-obsidian-subtle border border-obsidian-border px-2.5 py-1 font-mono text-xs text-white focus:outline-none focus:border-acid-lime"
                />
              </div>
            </div>
          )}

          {/* 4. Supersampling Multiplier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
                3. Supersampling Multiplier
              </label>
              <span className="font-mono text-2xs text-acid-lime font-bold">
                Output: {finalWidth} × {finalHeight} px
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { factor: 1, label: '1x Standard', desc: 'Direct 1:1 Scale' },
                { factor: 2, label: '2x High Density', desc: 'Crisp Sub-pixels' },
                { factor: 4, label: '4x Ultra HD', desc: 'Master Gallery Print' },
              ].map((s) => (
                <button
                  key={s.factor}
                  onClick={() => setScale(s.factor)}
                  className={`p-2.5 rounded-xs border text-left transition-colors ${
                    scale === s.factor
                      ? 'border-acid-lime text-acid-lime bg-acid-lime/10 font-semibold'
                      : 'border-obsidian-border text-obsidian-muted hover:text-white bg-obsidian-950'
                  }`}
                >
                  <span className="font-mono text-xs uppercase block font-bold">
                    {s.label}
                  </span>
                  <span className="font-mono text-[9px] text-obsidian-muted block mt-0.5">
                    {s.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {isHighResolution && (
            <div className="p-2.5 bg-electric-violet/10 border border-electric-violet/40 text-electric-violet-light font-mono text-2xs flex items-center gap-2 rounded-xs">
              <Maximize2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                Ultra-high resolution raster ({finalWidth}×{finalHeight}px). Master encoding may take 2-4 seconds.
              </span>
            </div>
          )}

          {/* Export Action Button */}
          <div className="pt-3 border-t border-obsidian-border flex items-center justify-between gap-4">
            <div className="font-mono text-2xs text-obsidian-muted truncate">
              {isExporting ? exportProgress : `Target: ${projectName.toLowerCase()}.${format}`}
            </div>

            <Button
              variant="primary"
              size="md"
              disabled={isExporting}
              icon={isExporting ? <Check className="w-4 h-4 animate-spin text-black" /> : <Download className="w-4 h-4 text-black" />}
              iconPosition="right"
              onClick={handleExport}
              className="px-6 h-10 font-bold"
            >
              {isExporting ? 'Rendering...' : 'Download Master Artwork'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
