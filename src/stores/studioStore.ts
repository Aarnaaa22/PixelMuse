import { create } from 'zustand';
import { PalettePreset, RenderConfig, RenderMode, RenderStats, ImageMetadata } from '../types';

export const BUILTIN_PALETTES: PalettePreset[] = [
  {
    id: 'cyberpunk-editorial',
    name: 'Obsidian / Acid / Violet',
    category: 'cyberpunk',
    colors: ['#08080A', '#1F1F28', '#9D4EDD', '#CCFF00', '#F4F4F6'],
  },
  {
    id: 'noir-monochrome',
    name: 'Noir Monochrome',
    category: 'monochrome',
    colors: ['#050505', '#242426', '#686870', '#B0B0BA', '#FAFAFA'],
  },
  {
    id: 'signal-coral',
    name: 'Signal Coral & Lime',
    category: 'editorial',
    colors: ['#08080A', '#2E1515', '#FF473A', '#CCFF00', '#FFFFFF'],
  },
  {
    id: 'amber-cathode',
    name: 'Cathode Amber',
    category: 'retro',
    colors: ['#0A0600', '#3D2400', '#8A5200', '#E58A00', '#FFB833'],
  },
  {
    id: 'matrix-phosphor',
    name: 'Phosphor Green',
    category: 'retro',
    colors: ['#020A02', '#0A2E0A', '#1A7A1A', '#33E533', '#CCFF00'],
  },
];

export const DEFAULT_CONFIG: RenderConfig = {
  mode: 'ascii',
  resolutionScale: 1,
  ascii: {
    characters: ' .:-=+*#%@',
    fontSize: 12,
    lineHeight: 12,
    fontFamily: '"JetBrains Mono", monospace',
    invert: false,
    colorMode: 'palette',
    monochromeColor: '#CCFF00',
    backgroundColor: '#08080A',
    contrast: 20,
    brightness: 0,
    glow: 0,
  },
  dither: {
    algorithm: 'bayer-4x4',
    scale: 2,
    threshold: 0.5,
    colorDepth: 4,
    paletteId: 'cyberpunk-editorial',
    serpentine: true,
  },
  mosaic: {
    cellSize: 10,
    shape: 'square',
    gap: 1,
    jitter: 0,
    angle: 0,
    preserveEdges: false,
  },
  halftone: {
    dotSize: 12,
    angle: 45,
    cmykSeparation: false,
    sharpness: 1,
  },
  motion: {
    isPlaying: false,
    speed: 1,
    loop: true,
    type: 'none',
    intensity: 0.5,
    frequency: 1,
  },
  palette: BUILTIN_PALETTES[0],
};

interface StudioState {
  config: RenderConfig;
  sourceImage: HTMLImageElement | HTMLCanvasElement | null;
  imageMetadata: ImageMetadata | null;
  stats: RenderStats;
  zoom: number;
  panX: number;
  panY: number;
  activeInspectorTab: 'render' | 'palette' | 'motion' | 'export';
  isSplitView: boolean;
  splitPosition: number; // 0 to 100 percentage
  
  // Actions
  setMode: (mode: RenderMode) => void;
  updateConfig: (partial: Partial<RenderConfig>) => void;
  updateAsciiConfig: (partial: Partial<RenderConfig['ascii']>) => void;
  updateDitherConfig: (partial: Partial<RenderConfig['dither']>) => void;
  updateMosaicConfig: (partial: Partial<RenderConfig['mosaic']>) => void;
  updateHalftoneConfig: (partial: Partial<RenderConfig['halftone']>) => void;
  updateMotionConfig: (partial: Partial<RenderConfig['motion']>) => void;
  setPalette: (palette: PalettePreset) => void;
  setSourceImage: (img: HTMLImageElement | HTMLCanvasElement, metadata: ImageMetadata) => void;
  setStats: (stats: RenderStats) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetViewport: () => void;
  setActiveInspectorTab: (tab: 'render' | 'palette' | 'motion' | 'export') => void;
  toggleSplitView: () => void;
  setSplitPosition: (pos: number) => void;
  resetConfig: () => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  config: DEFAULT_CONFIG,
  sourceImage: null,
  imageMetadata: null,
  stats: {
    fps: 60,
    renderTimeMs: 0,
    pixelCount: 0,
    elementCount: 0,
    canvasWidth: 0,
    canvasHeight: 0,
  },
  zoom: 1,
  panX: 0,
  panY: 0,
  activeInspectorTab: 'render',
  isSplitView: false,
  splitPosition: 50,

  setMode: (mode) =>
    set((state) => ({ config: { ...state.config, mode } })),

  updateConfig: (partial) =>
    set((state) => ({ config: { ...state.config, ...partial } })),

  updateAsciiConfig: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        ascii: { ...state.config.ascii, ...partial },
      },
    })),

  updateDitherConfig: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        dither: { ...state.config.dither, ...partial },
      },
    })),

  updateMosaicConfig: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        mosaic: { ...state.config.mosaic, ...partial },
      },
    })),

  updateHalftoneConfig: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        halftone: { ...state.config.halftone, ...partial },
      },
    })),

  updateMotionConfig: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        motion: { ...state.config.motion, ...partial },
      },
    })),

  setPalette: (palette) =>
    set((state) => ({ config: { ...state.config, palette } })),

  setSourceImage: (img, metadata) =>
    set({ sourceImage: img, imageMetadata: metadata }),

  setStats: (stats) => set({ stats }),

  setZoom: (zoom) => set({ zoom }),

  setPan: (panX, panY) => set({ panX, panY }),

  resetViewport: () => set({ zoom: 1, panX: 0, panY: 0 }),

  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),

  toggleSplitView: () => set((state) => ({ isSplitView: !state.isSplitView })),

  setSplitPosition: (splitPosition) => set({ splitPosition }),

  resetConfig: () => set({ config: DEFAULT_CONFIG }),
}));

