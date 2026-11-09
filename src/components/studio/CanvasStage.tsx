import React, { useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, UploadCloud } from 'lucide-react';
import { IconButton } from '../ui';
import { useCanvasRender, useImageDrop } from '../../hooks';
import { useStudioStore } from '../../stores';

export const CanvasStage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useCanvasRender(canvasRef);
  const { isDragging, onDragOver, onDragLeave, onDrop } = useImageDrop();

  const {
    zoom,
    setZoom,
    panX,
    panY,
    setPan,
    isSplitView,
    splitPosition,
    setSplitPosition,
    sourceImage,
  } = useStudioStore();

  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle click or Alt+click to pan
    if (e.button === 1 || e.altKey) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan(e.clientX - dragStart.x, e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div
      ref={containerRef}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative flex-1 h-full w-full bg-obsidian-950 overflow-hidden select-none flex items-center justify-center studio-checker"
    >
      {/* Canvas Mount Container with dynamic zoom and pan */}
      <div
        className="relative transition-transform duration-75 shadow-2xl"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <canvas
          ref={canvasRef}
          className="border border-obsidian-border bg-obsidian block max-w-none shadow-crisp-border"
        />

        {/* Optional Split-screen comparison */}
        {isSplitView && sourceImage && (
          <div
            className="absolute inset-0 overflow-hidden border-r-2 border-acid-lime pointer-events-none"
            style={{ width: `${splitPosition}%` }}
          >
            {'src' in sourceImage ? (
              <img
                src={sourceImage.src}
                alt="Original"
                className="w-full h-full object-cover max-w-none"
                style={{
                  width: canvasRef.current?.width || '100%',
                  height: canvasRef.current?.height || '100%',
                }}
              />
            ) : null}
          </div>
        )}
      </div>

      {/* Split Slider Controller Bar */}
      {isSplitView && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-obsidian-surface/90 border border-obsidian-border px-4 py-2 flex items-center gap-3 rounded-xs backdrop-blur-md">
          <span className="font-mono text-2xs uppercase text-obsidian-muted">Split View</span>
          <input
            type="range"
            min={0}
            max={100}
            value={splitPosition}
            onChange={(e) => setSplitPosition(parseFloat(e.target.value))}
            className="w-36 h-1 bg-obsidian-border accent-acid-lime cursor-pointer"
          />
          <span className="font-mono text-2xs text-acid-lime">{splitPosition}%</span>
        </div>
      )}

      {/* Floating Viewport Quick Controls */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 bg-obsidian-surface/90 border border-obsidian-border p-1 rounded-xs backdrop-blur-sm">
        <IconButton
          size="xs"
          title="Zoom Out"
          onClick={() => setZoom(Math.max(0.2, zoom - 0.2))}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </IconButton>

        <span className="font-mono text-2xs px-2 text-obsidian-text w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>

        <IconButton
          size="xs"
          title="Zoom In"
          onClick={() => setZoom(Math.min(4, zoom + 0.2))}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </IconButton>

        <IconButton
          size="xs"
          title="Reset Zoom"
          onClick={() => {
            setZoom(1);
            setPan(0, 0);
          }}
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </IconButton>
      </div>

      {/* Drag & Drop Visual Target Overlay */}
      {isDragging && (
        <div className="absolute inset-4 z-50 border-2 border-dashed border-acid-lime bg-obsidian/90 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
          <UploadCloud className="w-12 h-12 text-acid-lime animate-bounce mb-3" />
          <p className="font-display text-lg uppercase tracking-widest text-white">
            Release to Load Studio Photograph
          </p>
          <p className="font-mono text-xs text-obsidian-muted mt-1">
            PNG, JPEG, WebP supported
          </p>
        </div>
      )}
    </div>
  );
};
