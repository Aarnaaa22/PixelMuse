import { useEffect, useRef, useCallback } from 'react';
import { CanvasPipeline } from '../rendering-engine';
import { useStudioStore } from '../stores';
import { useAnimationFrame } from './useAnimationFrame';
import { createDefaultStudioCanvas } from '../utilities';

export function useCanvasRender(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const pipelineRef = useRef<CanvasPipeline | null>(null);
  
  const {
    config,
    sourceImage,
    setSourceImage,
    setStats,
  } = useStudioStore();

  // Initialize pipeline
  if (!pipelineRef.current) {
    pipelineRef.current = new CanvasPipeline();
  }

  // Fallback initial sample image if none provided yet
  useEffect(() => {
    if (!sourceImage) {
      const placeholder = createDefaultStudioCanvas(640, 640);
      setSourceImage(placeholder, {
        name: 'editorial-sculpture.png',
        width: 640,
        height: 640,
        sizeBytes: 0,
        aspectRatio: 1,
      });
    }
  }, [sourceImage, setSourceImage]);

  // Connect canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pipelineRef.current) return;

    pipelineRef.current.attach(canvas);

    return () => {
      pipelineRef.current?.detach();
    };
  }, [canvasRef]);

  // Main render function
  const renderFrame = useCallback((time = 0) => {
    if (!pipelineRef.current || !sourceImage || !canvasRef.current) return;

    const width = ('naturalWidth' in sourceImage ? sourceImage.naturalWidth : sourceImage.width) || 640;
    const height = ('naturalHeight' in sourceImage ? sourceImage.naturalHeight : sourceImage.height) || 640;

    const stats = pipelineRef.current.execute(sourceImage, width, height, config, time);
    setStats(stats);
  }, [sourceImage, config, canvasRef, setStats]);

  // Render on static config changes
  useEffect(() => {
    if (!config.motion.isPlaying) {
      renderFrame(0);
    }
  }, [config, sourceImage, renderFrame]);

  // Continuous animation loop when motion is playing
  useAnimationFrame((time) => {
    renderFrame(time);
  }, config.motion.isPlaying);

  return {
    renderFrame,
    pipeline: pipelineRef.current,
  };
}

