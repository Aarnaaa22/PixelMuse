import React, { useState } from 'react';
import { X, Download, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui';
import { useStudioStore } from '../../stores';
import { ExportFormat } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const { config } = useStudioStore();

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;

      const link = document.createElement('a');
      link.download = `pixelmuse-${config.mode}-${Date.now()}.${format}`;
      link.href = canvas.toDataURL(`image/${format === 'png' ? 'png' : 'jpeg'}`);
      link.click();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
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
            Export Artwork
          </h3>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              File Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['png', 'jpeg', 'txt'] as ExportFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`p-2.5 font-mono text-xs uppercase tracking-wider rounded-xs border text-center transition-colors ${
                    format === fmt
                      ? 'border-acid-lime text-white bg-obsidian-subtle'
                      : 'border-obsidian-border text-obsidian-muted hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-2xs uppercase tracking-widest text-obsidian-muted">
              Export Scale
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`p-2 font-mono text-xs uppercase tracking-wider rounded-xs border text-center transition-colors ${
                    scale === s
                      ? 'border-acid-lime text-acid-lime bg-acid-lime/10'
                      : 'border-obsidian-border text-obsidian-muted hover:text-white'
                  }`}
                >
                  {s}x Resolution
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-obsidian-border flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={copied ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              onClick={handleDownload}
              disabled={isExporting}
            >
              {copied ? 'Exported!' : 'Download Master'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

