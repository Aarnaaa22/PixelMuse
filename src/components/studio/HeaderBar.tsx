import React, { useRef } from 'react';
import { Upload, Download, RotateCcw, SplitSquareVertical } from 'lucide-react';
import { Button, IconButton } from '../ui';
import { useStudioStore } from '../../stores';
import { useImageDrop } from '../../hooks';

interface HeaderBarProps {
  onOpenExport?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ onOpenExport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { onFileInputChange } = useImageDrop();
  const { isSplitView, toggleSplitView, resetConfig, resetViewport } = useStudioStore();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="h-12 bg-obsidian-surface border-b border-obsidian-border px-4 flex items-center justify-between z-20">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Left: Input file controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={<Upload className="w-3.5 h-3.5 text-acid-lime" />}
          onClick={handleUploadClick}
        >
          Upload Photo
        </Button>

        <IconButton
          size="sm"
          title="Toggle Split Comparison View"
          active={isSplitView}
          onClick={toggleSplitView}
        >
          <SplitSquareVertical className="w-4 h-4" />
        </IconButton>

        <IconButton
          size="sm"
          title="Reset Viewport & Canvas"
          onClick={() => {
            resetViewport();
          }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </IconButton>
      </div>

      {/* Right: Quick actions & Export */}
      <div className="flex items-center gap-2.5">
        <Button
          variant="ghost"
          size="xs"
          onClick={resetConfig}
          className="text-obsidian-muted hover:text-signal-coral"
        >
          Reset Params
        </Button>

        <Button
          variant="primary"
          size="sm"
          icon={<Download className="w-3.5 h-3.5" />}
          onClick={onOpenExport}
        >
          Export Art
        </Button>
      </div>
    </header>
  );
};

