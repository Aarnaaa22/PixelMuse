import { useEffect, useRef, useCallback } from 'react';
import { CanvasPipeline } from '../rendering-engine';
import { useStudioStore } from '../stores';
import { useAnimationFrame } from './useAnimationFrame';

export function useCanvasRender(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const pipelineRef = useRef<CanvasPipeline | null>(null);

  const {
    config,
    sourceImage,
    setStats,
  } = useStudioStore();

  // Initialize pipeline
  if (!pipelineRef.current) {
    pipelineRef.current = new CanvasPipeline();
  }

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
  const renderFrame = useCallback(
    (time = 0) => {
      if (!pipelineRef.current || !sourceImage || !canvasRef.current) return;

      const width =
        ('naturalWidth' in sourceImage ? sourceImage.naturalWidth : sourceImage.width) || 640;
      const height =
        ('naturalHeight' in sourceImage ? sourceImage.naturalHeight : sourceImage.height) || 640;

      const stats = pipelineRef.current.execute(sourceImage, width, height, config, time);
      setStats(stats);
    },
    [sourceImage, config, canvasRef, setStats]
  );

  // Render on static config changes
  useEffect(() => {
    if (!config.motion.isPlaying && sourceImage) {
      renderFrame(config.motion.currentTime || 0);
    }
  }, [config, sourceImage, renderFrame]);

  // Continuous animation loop when motion is playing
  useAnimationFrame((time) => {
    if (sourceImage) {
      const dur = config.motion.duration ?? 10;
      const speed = config.motion.animSpeed ?? config.motion.speed ?? 1;
      const scaledTime = time * speed;
      const loopedTime = config.motion.loop
        ? scaledTime % dur
        : Math.min(dur, scaledTime);
      renderFrame(loopedTime);
    }
  }, Boolean(config.motion.isPlaying));

  return {
    renderFrame,
    pipeline: pipelineRef.current,
  };
}
