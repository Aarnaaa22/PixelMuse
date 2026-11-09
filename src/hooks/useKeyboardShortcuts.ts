import { useEffect } from 'react';
import { useStudioStore } from '../stores';
import { RenderMode } from '../types';

export function useKeyboardShortcuts(onOpenExport: () => void, onToggleShortcutsHelp: () => void) {
  const {
    undo,
    redo,
    saveProject,
    resetViewport,
    fitToScreen,
    toggleSplitView,
    config,
    updateMotionConfig,
    setMode,
  } = useStudioStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo / Redo
      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
        return;
      }

      if ((cmdOrCtrl && e.key.toLowerCase() === 'y') || (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        redo();
        return;
      }

      // Quick Save (Ctrl+S / Cmd+S)
      if (cmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveProject();
        return;
      }

      // Export Master (Ctrl+E / Cmd+E)
      if (cmdOrCtrl && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        onOpenExport();
        return;
      }

      // Play / Pause Motion (Spacebar)
      if (e.code === 'Space') {
        e.preventDefault();
        updateMotionConfig({ isPlaying: !config.motion.isPlaying });
        return;
      }

      // Toggle Split Comparison (S)
      if (e.key.toLowerCase() === 's' && !cmdOrCtrl) {
        e.preventDefault();
        toggleSplitView();
        return;
      }

      // Fit to screen (F)
      if (e.key.toLowerCase() === 'f' && !cmdOrCtrl) {
        e.preventDefault();
        fitToScreen();
        return;
      }

      // Reset Viewport (R)
      if (e.key.toLowerCase() === 'r' && !cmdOrCtrl) {
        e.preventDefault();
        resetViewport();
        return;
      }

      // Help Overlay (?)
      if (e.key === '?') {
        e.preventDefault();
        onToggleShortcutsHelp();
        return;
      }

      // Modes (1: Mosaic, 2: Pixel, 3: ASCII, 4: Dots, 5: Dither)
      const modeKeys: Record<string, RenderMode> = {
        '1': 'mosaic',
        '2': 'pixel',
        '3': 'ascii',
        '4': 'dots',
        '5': 'dither',
      };

      if (modeKeys[e.key] && !cmdOrCtrl) {
        e.preventDefault();
        setMode(modeKeys[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    saveProject,
    resetViewport,
    fitToScreen,
    toggleSplitView,
    config,
    updateMotionConfig,
    setMode,
    onOpenExport,
    onToggleShortcutsHelp,
  ]);
}
