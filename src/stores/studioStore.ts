import { create } from 'zustand';
import {
  PalettePreset,
  RenderConfig,
  RenderMode,
  RenderStats,
  ImageMetadata,
  StudioLayer,
  ColorConfig,
  BackgroundConfig,
  EffectsConfig,
  GeneralRenderParams,
  BlurConfig,
  LightingConfig,
  LightPoint,
  MaskConfig,
  CentralRecipe,
  ArtPreset,
} from '../types';
import { SidebarTab, StudioImageAsset } from '../types/studio';
import { createSamplePhotoImage } from '../utilities/samplePhotos';

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

export const DEFAULT_RENDER_PARAMS: GeneralRenderParams = {
  cellSize: 12,
  density: 1.0,
  coverage: 100,
  invert: false,
  edgeEmphasis: 0,
  charSet: ' .:-=+*#%@',
};

export const DEFAULT_BLUR_CONFIG: BlurConfig = {
  type: 'off',
  radius: 0,
  angle: 0,
};

export const DEFAULT_COLOR_CONFIG: ColorConfig = {
  brightness: 0,
  contrast: 0,
  saturation: 1.0,
  grayscale: false,
  tintColor: '#CCFF00',
  tintOpacity: 0,
  blendMode: 'normal',
};

export const DEFAULT_BACKGROUND_CONFIG: BackgroundConfig = {
  mode: 'solid',
  opacity: 1.0,
  blur: 0,
  blurType: 'gaussian',
  color: '#08080A',
};

export const DEFAULT_EFFECTS_CONFIG: EffectsConfig = {
  bloom: 0,
  vignette: 0,
  scanlines: 0,
  filmGrain: 0,
  chromaticAberration: 0,
  glitch: 0,
  halftone: 0,
  pixelation: 0,
  filmDust: 0,
};

export const DEFAULT_LIGHTING_CONFIG: LightingConfig = {
  enabled: false,
  ambient: 0.35,
  lights: [
    {
      id: 'light-1',
      x: 0.3,
      y: 0.3,
      radius: 0.45,
      intensity: 0.85,
      color: '#FFFFFF',
    },
    {
      id: 'light-2',
      x: 0.7,
      y: 0.6,
      radius: 0.35,
      intensity: 0.75,
      color: '#CCFF00',
    },
  ],
};

export const DEFAULT_MASK_CONFIG: MaskConfig = {
  enabled: false,
  maskCanvas: null,
  maskMetadata: null,
  invert: false,
  feather: 0,
  opacity: 1.0,
};

export const DEFAULT_LAYERS: StudioLayer[] = [
  {
    id: 'layer-post-fx',
    name: 'Post FX & Kinetic Waves',
    type: 'post-fx',
    visible: true,
    opacity: 1,
    locked: false,
    blendMode: 'normal',
  },
  {
    id: 'layer-color-map',
    name: 'Palette Mapping & Tint',
    type: 'color-map',
    visible: true,
    opacity: 1,
    locked: false,
    blendMode: 'normal',
  },
  {
    id: 'layer-raster-core',
    name: 'Generative Raster Core',
    type: 'raster-core',
    visible: true,
    opacity: 1,
    locked: false,
    blendMode: 'normal',
  },
  {
    id: 'layer-base-photo',
    name: 'Base Photography Sensor',
    type: 'base-photo',
    visible: true,
    opacity: 1,
    locked: true,
    blendMode: 'normal',
  },
];

export const DEFAULT_CONFIG: RenderConfig = {
  mode: 'original',
  resolutionScale: 1,
  renderParams: DEFAULT_RENDER_PARAMS,
  color: DEFAULT_COLOR_CONFIG,
  blur: DEFAULT_BLUR_CONFIG,
  background: DEFAULT_BACKGROUND_CONFIG,
  effects: DEFAULT_EFFECTS_CONFIG,
  ascii: {
    characters: ' .:-=+*#%@',
    fontSize: 12,
    lineHeight: 12,
    fontFamily: '"JetBrains Mono", monospace',
    invert: false,
    colorMode: 'original',
    monochromeColor: '#CCFF00',
    backgroundColor: '#08080A',
    contrast: 20,
    brightness: 0,
    glow: 0,
  },
  dither: {
    algorithm: 'bayer-8x8',
    scale: 2,
    threshold: 0.5,
    colorDepth: 4,
    paletteId: 'cyberpunk-editorial',
    serpentine: true,
  },
  mosaic: {
    cellSize: 12,
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
    animated: false,
    isPlaying: false,
    animSpeed: 1,
    speed: 1,
    animStyle: 'wave',
    type: 'wave',
    animIntensity: 0.5,
    intensity: 0.5,
    loop: true,
    frequency: 1,
    currentTime: 0,
    duration: 10,
  },
  lighting: DEFAULT_LIGHTING_CONFIG,
  mask: DEFAULT_MASK_CONFIG,
  palette: BUILTIN_PALETTES[0],
};

interface StudioState {
  projectName: string;
  config: RenderConfig;
  layers: StudioLayer[];
  images: StudioImageAsset[];
  activeImageId: string | null;
  sourceImage: HTMLImageElement | HTMLCanvasElement | null;
  imageMetadata: ImageMetadata | null;
  uploadError: string | null;
  isImageLoading: boolean;
  stats: RenderStats;
  
  // Viewport & Canvas
  zoom: number;
  panX: number;
  panY: number;
  isSplitView: boolean;
  splitPosition: number; // 0 to 100 percentage
  
  // Navigation & Panels
  activeSidebarTab: SidebarTab;
  collapsedSections: Record<string, boolean>; // e.g. { render: false, color: false, ... }
  
  // History
  historyPast: RenderConfig[];
  historyFuture: RenderConfig[];

  // Save / Toast notification
  lastSavedAt: number | null;

  // Actions - Project & History
  setProjectName: (name: string) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  saveProject: () => void;

  // Actions - Sidebar & Inspector
  setActiveSidebarTab: (tab: SidebarTab) => void;
  toggleSection: (sectionId: string) => void;

  // Actions - Config & Parameters
  setMode: (mode: RenderMode) => void;
  updateConfig: (partial: Partial<RenderConfig>) => void;
  updateRenderParams: (partial: Partial<GeneralRenderParams>) => void;
  updateColorConfig: (partial: Partial<ColorConfig>) => void;
  updateBlurConfig: (partial: Partial<BlurConfig>) => void;
  updateBackgroundConfig: (partial: Partial<BackgroundConfig>) => void;
  updateEffectsConfig: (partial: Partial<EffectsConfig>) => void;
  updateAsciiConfig: (partial: Partial<RenderConfig['ascii']>) => void;
  updateDitherConfig: (partial: Partial<RenderConfig['dither']>) => void;
  updateMosaicConfig: (partial: Partial<RenderConfig['mosaic']>) => void;
  updateHalftoneConfig: (partial: Partial<RenderConfig['halftone']>) => void;
  updateMotionConfig: (partial: Partial<RenderConfig['motion']>) => void;
  updateLightingConfig: (partial: Partial<LightingConfig>) => void;
  toggleLighting: () => void;
  addLight: (light?: Partial<LightPoint>) => void;
  removeLight: (id: string) => void;
  updateLight: (id: string, partial: Partial<LightPoint>) => void;
  setMaskImage: (canvas: HTMLCanvasElement, metadata: { name: string; width: number; height: number }) => void;
  clearMaskImage: () => void;
  updateMaskConfig: (partial: Partial<MaskConfig>) => void;
  setPalette: (palette: PalettePreset) => void;

  // Section Resets
  resetRenderSection: () => void;
  resetColorSection: () => void;
  resetBlurSection: () => void;
  resetBackgroundSection: () => void;
  resetEffectsSection: () => void;
  resetMotionSection: () => void;
  resetLightingSection: () => void;
  resetMaskSection: () => void;
  resetAll: () => void;

  // Actions - Layers
  toggleLayerVisibility: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;

  // Actions - Image & Viewport
  setSourceImage: (img: HTMLImageElement | HTMLCanvasElement | null, metadata: ImageMetadata | null) => void;
  selectImage: (id: string) => void;
  removeImage: (id: string) => void;
  clearImage: () => void;
  clearAllImages: () => void;
  setUploadError: (error: string | null) => void;
  setIsImageLoading: (loading: boolean) => void;
  setStats: (stats: RenderStats) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetViewport: () => void;
  fitToScreen: () => void;
  toggleSplitView: () => void;
  // Active Art Library Recipe
  activeRecipe: CentralRecipe | null;
  activeRecipeId: string | null;
  loadRecipe: (recipe: CentralRecipe, preloadSampleIfNoImage?: boolean) => Promise<void>;
  resetToRecipeDefaults: () => void;
  clearActiveRecipe: () => void;
  applyPreset: (preset: ArtPreset, preloadSampleIfNoImage?: boolean) => Promise<void>;

  setSplitPosition: (pos: number) => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  projectName: 'UNTITLED_STUDIO_01',
  config: DEFAULT_CONFIG,
  layers: DEFAULT_LAYERS,
  images: [],
  activeImageId: null,
  activeRecipe: null,
  activeRecipeId: null,
  sourceImage: null,
  imageMetadata: null,
  uploadError: null,
  isImageLoading: false,
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
  isSplitView: false,
  splitPosition: 50,
  activeSidebarTab: 'upload',
  collapsedSections: {
    render: false,
    color: false,
    blur: true,
    background: true,
    effects: true,
    motion: true,
    lighting: true,
    mask: true,
  },
  historyPast: [],
  historyFuture: [],
  lastSavedAt: null,

  setProjectName: (projectName) => set({ projectName }),

  pushHistory: () => {
    const { config, historyPast } = get();
    set({
      historyPast: [...historyPast.slice(-15), JSON.parse(JSON.stringify(config))],
      historyFuture: [],
    });
  },

  undo: () => {
    const { historyPast, historyFuture, config } = get();
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    set({
      config: previous,
      historyPast: historyPast.slice(0, -1),
      historyFuture: [JSON.parse(JSON.stringify(config)), ...historyFuture],
    });
  },

  redo: () => {
    const { historyPast, historyFuture, config } = get();
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    set({
      config: next,
      historyPast: [...historyPast, JSON.parse(JSON.stringify(config))],
      historyFuture: historyFuture.slice(1),
    });
  },

  saveProject: () => {
    const { projectName, config, imageMetadata } = get();
    const payload = {
      id: `proj-${Date.now()}`,
      name: projectName,
      config,
      imageMetadata,
      savedAt: Date.now(),
    };
    try {
      localStorage.setItem('pixelmuse_saved_project', JSON.stringify(payload));
    } catch {
      // fallback
    }
    set({ lastSavedAt: Date.now() });
  },

  setActiveSidebarTab: (activeSidebarTab) => set({ activeSidebarTab }),

  toggleSection: (sectionId) =>
    set((state) => ({
      collapsedSections: {
        ...state.collapsedSections,
        [sectionId]: !state.collapsedSections[sectionId],
      },
    })),

  loadRecipe: async (recipe, preloadSampleIfNoImage = true) => {
    set({
      activeRecipe: recipe,
      activeRecipeId: recipe.id,
      projectName: recipe.name.toUpperCase().replace(/\s+/g, '_'),
    });
    try {
      localStorage.setItem('pixelmuse_active_recipe_id', recipe.id);
    } catch {}

    const conf = recipe.defaultConfig || recipe.config || {};
    const merged: RenderConfig = {
      ...DEFAULT_CONFIG,
      ...conf,
      renderParams: { ...DEFAULT_CONFIG.renderParams, ...(conf.renderParams || {}) },
      color: { ...DEFAULT_CONFIG.color, ...(conf.color || {}) },
      effects: { ...DEFAULT_CONFIG.effects, ...(conf.effects || {}) },
      motion: { ...DEFAULT_CONFIG.motion, ...(conf.motion || {}) },
      ascii: { ...DEFAULT_CONFIG.ascii, ...(conf.ascii || {}) },
      dither: { ...DEFAULT_CONFIG.dither, ...(conf.dither || {}) },
      mosaic: { ...DEFAULT_CONFIG.mosaic, ...(conf.mosaic || {}) },
      halftone: { ...DEFAULT_CONFIG.halftone, ...(conf.halftone || {}) },
    };

    get().pushHistory();
    set({ config: merged });

    // If no image is currently selected, load a high-fidelity sample photograph
    if (!get().sourceImage && preloadSampleIfNoImage) {
      try {
        set({ isImageLoading: true, uploadError: null });
        const sampleId = recipe.previewConfig?.samplePhotoId || 'marble-sculpture';
        const sample = await createSamplePhotoImage(sampleId);
        get().setSourceImage(sample, {
          name: `${sampleId}.png`,
          width: 640,
          height: 640,
          aspectRatio: 1,
          sizeBytes: 120000,
        });
      } catch (err) {
        console.error('[PixelMuse Recipe Sample Load Error]:', err);
      } finally {
        set({ isImageLoading: false });
      }
    }
  },

  resetToRecipeDefaults: () => {
    const { activeRecipe } = get();
    if (!activeRecipe) {
      get().resetAll();
      return;
    }
    get().pushHistory();
    const conf = activeRecipe.defaultConfig || activeRecipe.config || {};
    const merged: RenderConfig = {
      ...DEFAULT_CONFIG,
      ...conf,
      renderParams: { ...DEFAULT_CONFIG.renderParams, ...(conf.renderParams || {}) },
      color: { ...DEFAULT_CONFIG.color, ...(conf.color || {}) },
      effects: { ...DEFAULT_CONFIG.effects, ...(conf.effects || {}) },
      motion: { ...DEFAULT_CONFIG.motion, ...(conf.motion || {}) },
      ascii: { ...DEFAULT_CONFIG.ascii, ...(conf.ascii || {}) },
      dither: { ...DEFAULT_CONFIG.dither, ...(conf.dither || {}) },
      mosaic: { ...DEFAULT_CONFIG.mosaic, ...(conf.mosaic || {}) },
      halftone: { ...DEFAULT_CONFIG.halftone, ...(conf.halftone || {}) },
    };
    set({ config: merged });
  },

  clearActiveRecipe: () => {
    set({ activeRecipe: null, activeRecipeId: null });
    try {
      localStorage.removeItem('pixelmuse_active_recipe_id');
    } catch {}
  },

  applyPreset: async (preset, preloadSampleIfNoImage = true) => {
    get().pushHistory();
    get().updateConfig(preset.config);
    get().setProjectName(preset.title.toUpperCase().replace(/\s+/g, '_'));

    if (!get().sourceImage && preloadSampleIfNoImage) {
      try {
        set({ isImageLoading: true, uploadError: null });
        const sampleId = 'marble-sculpture';
        const sample = await createSamplePhotoImage(sampleId);
        get().setSourceImage(sample, {
          name: `${preset.title.toLowerCase().replace(/\s+/g, '-')}.png`,
          width: 640,
          height: 640,
          aspectRatio: 1,
          sizeBytes: 120000,
        });
      } catch (err) {
        console.error('[PixelMuse Preset Sample Load Error]:', err);
      } finally {
        set({ isImageLoading: false });
      }
    }
  },

  setMode: (mode) => {
    get().pushHistory();
    set((state) => ({ config: { ...state.config, mode } }));
  },

  updateConfig: (partial) => {
    set((state) => ({ config: { ...state.config, ...partial } }));
  },

  updateRenderParams: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        renderParams: { ...state.config.renderParams, ...partial },
      },
    })),

  updateColorConfig: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        color: { ...state.config.color, ...partial },
      },
    })),

  updateBlurConfig: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        blur: { ...(state.config.blur || DEFAULT_BLUR_CONFIG), ...partial },
      },
    })),

  updateBackgroundConfig: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        background: { ...state.config.background, ...partial },
      },
    })),

  updateEffectsConfig: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        effects: { ...state.config.effects, ...partial },
      },
    })),

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
    set((state) => {
      const motion = { ...state.config.motion, ...partial };
      // Keep aliases in sync
      if (partial.animated !== undefined) motion.isPlaying = partial.animated;
      if (partial.isPlaying !== undefined) motion.animated = partial.isPlaying;
      if (partial.animSpeed !== undefined) motion.speed = partial.animSpeed;
      if (partial.speed !== undefined) motion.animSpeed = partial.speed;
      if (partial.animStyle !== undefined) motion.type = partial.animStyle;
      if (partial.type !== undefined) motion.animStyle = partial.type;
      if (partial.animIntensity !== undefined) motion.intensity = partial.animIntensity;
      if (partial.intensity !== undefined) motion.animIntensity = partial.intensity;
      return {
        config: {
          ...state.config,
          motion,
        },
      };
    }),

  updateLightingConfig: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        lighting: {
          ...(state.config.lighting || DEFAULT_LIGHTING_CONFIG),
          ...partial,
        },
      },
    })),

  toggleLighting: () =>
    set((state) => {
      const cur = state.config.lighting || DEFAULT_LIGHTING_CONFIG;
      return {
        config: {
          ...state.config,
          lighting: { ...cur, enabled: !cur.enabled },
        },
      };
    }),

  addLight: (light) =>
    set((state) => {
      const cur = state.config.lighting || DEFAULT_LIGHTING_CONFIG;
      const newLight: LightPoint = {
        id: `light-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        x: 0.5,
        y: 0.5,
        radius: 0.35,
        intensity: 0.8,
        color: '#FFFFFF',
        ...light,
      };
      return {
        config: {
          ...state.config,
          lighting: {
            ...cur,
            enabled: true,
            lights: [...cur.lights, newLight],
          },
        },
      };
    }),

  removeLight: (id) =>
    set((state) => {
      const cur = state.config.lighting || DEFAULT_LIGHTING_CONFIG;
      return {
        config: {
          ...state.config,
          lighting: {
            ...cur,
            lights: cur.lights.filter((l) => l.id !== id),
          },
        },
      };
    }),

  updateLight: (id, partial) =>
    set((state) => {
      const cur = state.config.lighting || DEFAULT_LIGHTING_CONFIG;
      return {
        config: {
          ...state.config,
          lighting: {
            ...cur,
            lights: cur.lights.map((l) => (l.id === id ? { ...l, ...partial } : l)),
          },
        },
      };
    }),

  resetLightingSection: () => {
    get().pushHistory();
    set((state) => ({
      config: { ...state.config, lighting: DEFAULT_LIGHTING_CONFIG },
    }));
  },

  setMaskImage: (canvas, metadata) =>
    set((state) => ({
      config: {
        ...state.config,
        mask: {
          ...(state.config.mask || DEFAULT_MASK_CONFIG),
          enabled: true,
          maskCanvas: canvas,
          maskMetadata: metadata,
        },
      },
    })),

  clearMaskImage: () =>
    set((state) => ({
      config: {
        ...state.config,
        mask: {
          ...(state.config.mask || DEFAULT_MASK_CONFIG),
          enabled: false,
          maskCanvas: null,
          maskMetadata: null,
        },
      },
    })),

  updateMaskConfig: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        mask: {
          ...(state.config.mask || DEFAULT_MASK_CONFIG),
          ...partial,
        },
      },
    })),

  resetMaskSection: () => {
    get().pushHistory();
    set((state) => ({
      config: { ...state.config, mask: DEFAULT_MASK_CONFIG },
    }));
  },

  setPalette: (palette) =>
    set((state) => ({ config: { ...state.config, palette } })),

  resetRenderSection: () => {
    get().pushHistory();
    set((state) => ({
      config: { ...state.config, renderParams: DEFAULT_RENDER_PARAMS },
    }));
  },

  resetColorSection: () => {
    get().pushHistory();
    set((state) => ({
      config: { ...state.config, color: DEFAULT_COLOR_CONFIG },
    }));
  },

  resetBlurSection: () => {
    get().pushHistory();
    set((state) => ({
      config: { ...state.config, blur: DEFAULT_BLUR_CONFIG },
    }));
  },

  resetBackgroundSection: () => {
    get().pushHistory();
    set((state) => ({
      config: { ...state.config, background: DEFAULT_BACKGROUND_CONFIG },
    }));
  },

  resetEffectsSection: () => {
    get().pushHistory();
    set((state) => ({
      config: { ...state.config, effects: DEFAULT_EFFECTS_CONFIG },
    }));
  },

  resetMotionSection: () => {
    get().pushHistory();
    set((state) => ({
      config: { ...state.config, motion: DEFAULT_CONFIG.motion },
    }));
  },

  resetAll: () => {
    get().pushHistory();
    set({ config: DEFAULT_CONFIG });
  },

  toggleLayerVisibility: (layerId) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === layerId ? { ...l, visible: !l.visible } : l
      ),
    })),

  setLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === layerId ? { ...l, opacity } : l
      ),
    })),

  setSourceImage: (img, metadata) => {
    if (!img || !metadata) {
      set({
        sourceImage: null,
        imageMetadata: null,
        activeImageId: null,
        zoom: 1,
        panX: 0,
        panY: 0,
      });
      return;
    }

    const id = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    let thumbUrl = '';
    if ('src' in img && typeof img.src === 'string' && img.src.length > 0) {
      thumbUrl = img.src;
    } else if (img instanceof HTMLCanvasElement) {
      try {
        thumbUrl = img.toDataURL('image/png');
      } catch {
        thumbUrl = '';
      }
    }

    const asset: StudioImageAsset = {
      id,
      name: metadata.name,
      width: metadata.width,
      height: metadata.height,
      aspectRatio: metadata.aspectRatio,
      sizeBytes: metadata.sizeBytes,
      thumbnailUrl: thumbUrl,
      image: img,
    };

    set((state) => {
      const existingFiltered = state.images.filter((i) => i.name !== metadata.name);
      return {
        images: [asset, ...existingFiltered],
        activeImageId: id,
        sourceImage: img,
        imageMetadata: metadata,
        uploadError: null,
        isImageLoading: false,
        zoom: 1,
        panX: 0,
        panY: 0,
        // Crucial requirement: Default newly uploaded photograph to pristine original mode so user sees real photo first
        config: {
          ...state.config,
          mode: 'original' as RenderMode,
        },
      };
    });
  },

  selectImage: (id: string) => {
    const { images } = get();
    const asset = images.find((i) => i.id === id);
    if (!asset) return;

    set({
      activeImageId: id,
      sourceImage: asset.image,
      imageMetadata: {
        name: asset.name,
        width: asset.width,
        height: asset.height,
        sizeBytes: asset.sizeBytes,
        aspectRatio: asset.aspectRatio,
      },
      zoom: 1,
      panX: 0,
      panY: 0,
      uploadError: null,
    });
  },

  removeImage: (id: string) => {
    set((state) => {
      const remaining = state.images.filter((i) => i.id !== id);
      if (state.activeImageId === id) {
        if (remaining.length > 0) {
          const next = remaining[0];
          return {
            images: remaining,
            activeImageId: next.id,
            sourceImage: next.image,
            imageMetadata: {
              name: next.name,
              width: next.width,
              height: next.height,
              sizeBytes: next.sizeBytes,
              aspectRatio: next.aspectRatio,
            },
            zoom: 1,
            panX: 0,
            panY: 0,
          };
        } else {
          return {
            images: [],
            activeImageId: null,
            sourceImage: null,
            imageMetadata: null,
            zoom: 1,
            panX: 0,
            panY: 0,
          };
        }
      }
      return { images: remaining };
    });
  },

  clearImage: () => {
    const { activeImageId } = get();
    if (activeImageId) {
      get().removeImage(activeImageId);
    } else {
      set({
        sourceImage: null,
        imageMetadata: null,
        activeImageId: null,
        uploadError: null,
        isImageLoading: false,
        zoom: 1,
        panX: 0,
        panY: 0,
      });
    }
  },

  clearAllImages: () =>
    set({
      images: [],
      activeImageId: null,
      sourceImage: null,
      imageMetadata: null,
      uploadError: null,
      isImageLoading: false,
      zoom: 1,
      panX: 0,
      panY: 0,
    }),

  setUploadError: (uploadError) => set({ uploadError }),

  setIsImageLoading: (isImageLoading) => set({ isImageLoading }),

  setStats: (stats) => set({ stats }),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(8, zoom)) }),

  setPan: (panX, panY) => set({ panX, panY }),

  resetViewport: () => set({ zoom: 1, panX: 0, panY: 0 }),

  fitToScreen: () => set({ zoom: 1, panX: 0, panY: 0 }),

  toggleSplitView: () => set((state) => ({ isSplitView: !state.isSplitView })),

  setSplitPosition: (splitPosition) => set({ splitPosition }),
}));
