import React, { useState } from 'react';
import { X, Download, Check, Sparkles, FolderPlus } from 'lucide-react';
import { Button } from '../ui';
import { useStudioStore } from '../../stores';
import { ExportFormat } from '../../types';
import { CanvasPipeline } from '../../rendering-engine';
import { CellGridSampler } from '../../image-processing';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [savedVault, setSavedVault] = useState(false);

  const { config, projectName, sourceImage, imageMetadata } = useStudioStore();

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    try {
      let targetCanvas: HTMLCanvasElement | null = null;

      // Render through unified pipeline to ensure 100% preview-export parity and true scaling
      if (sourceImage && imageMetadata) {
        const exportCanvas = document.createElement('canvas');
        const pipeline = new CanvasPipeline();
        pipeline.attach(exportCanvas);
        const exportConfig = {
          ...config,
          resolutionScale: config.resolutionScale * scale,
        };
        pipeline.execute(
          sourceImage,
          imageMetadata.width,
          imageMetadata.height,
          exportConfig,
          config.motion.currentTime || 0
        );
        targetCanvas = exportCanvas;
      } else {
        targetCanvas = document.querySelector('canvas');
      }

      if (!targetCanvas) return;

      if (format === 'txt') {
        // Plain ASCII text file sampled directly from the rendered image
        const tCtx = targetCanvas.getContext('2d');
        const imgData = tCtx?.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
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
          `/* PIXELMUSE GENERATIVE ART MATRIX - ${projectName} */\n` +
          `/* RASTER MODE: ${config.mode.toUpperCase()} - RESOLUTION: ${targetCanvas.width}x${targetCanvas.height} */\n\n` +
          asciiText;

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.txt`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
        const link = document.createElement('a');
        link.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${format}`;
        link.href = targetCanvas.toDataURL(mime, 0.95);
        link.click();
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveToVault = () => {
    try {
      const canvas = document.querySelector('canvas');
      const thumb = canvas ? canvas.toDataURL('image/jpeg', 0.6) : '';
      const existing = JSON.parse(localStorage.getItem('pixelmuse_creations') || '[]');
      const newCreation = {
        id: `creation-${Date.now()}`,
        title: projectName,
        timestamp: Date.now(),
        thumbnail: thumb,
        mode: config.mode,
        config,
        exportFormat: format,
      };
      localStorage.setItem('pixelmuse_creations', JSON.stringify([newCreation, ...existing]));
      setSavedVault(true);
      setTimeout(() => setSavedVault(false), 2000);
    } catch (err) {
      console.error('Vault save failed', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md select-none">
      <div className="w-full max-w-md bg-obsidian-surface border border-obsidian-border p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-obsidian-muted hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-acid-lime" />
          <h3 className="font-display text-sm uppercase tracking-widest text-white">
            Export Master Artwork
          </h3>
        </div>

        <div className="space-y-5">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Master Format
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['png', 'jpeg', 'webp', 'txt'] as ExportFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`p-2.5 font-mono text-xs uppercase tracking-wider rounded-xs border text-center transition-colors ${
                    format === fmt
                      ? 'border-acid-lime text-white bg-obsidian-subtle font-semibold shadow-crisp-border'
                      : 'border-obsidian-border text-obsidian-muted hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Scale Resolution Factor */}
          <div className="space-y-2">
            <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Supersampling Multiplier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`p-2 font-mono text-xs uppercase tracking-wider rounded-xs border text-center transition-colors ${
                    scale === s
                      ? 'border-acid-lime text-acid-lime bg-acid-lime/10 font-semibold'
                      : 'border-obsidian-border text-obsidian-muted hover:text-white'
                  }`}
                >
                  {s}x Raster
                </button>
              ))}
            </div>
          </div>

          {/* Quick Save to Vault */}
          <div className="pt-2 border-t border-obsidian-border flex items-center justify-between">
            <span className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Studio Vault
            </span>
            <button
              onClick={handleSaveToVault}
              className="flex items-center gap-1.5 font-mono text-2xs uppercase text-electric-violet-light hover:underline"
            >
              {savedVault ? (
                <>
                  <Check className="w-3.5 h-3.5 text-acid-lime" />
                  <span className="text-acid-lime">Saved in Vault!</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Save To Gallery</span>
                </>
              )}
            </button>
          </div>

          {/* Action Triggers */}
          <div className="pt-4 border-t border-obsidian-border flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={
                downloadSuccess ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )
              }
              onClick={handleDownload}
              disabled={isExporting}
            >
              {downloadSuccess ? 'Downloaded!' : 'Download Master'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
