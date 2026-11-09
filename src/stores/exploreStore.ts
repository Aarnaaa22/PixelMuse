import { create } from 'zustand';
import { ArtPreset } from '../types';
import { DEFAULT_CONFIG, BUILTIN_PALETTES } from './studioStore';

export const CURATED_PRESETS: ArtPreset[] = [
  {
    id: 'preset-ascii-cyberpunk',
    title: 'Cyberpunk Monolith',
    subtitle: 'Fine density glyph matrix with electric violet glow',
    author: 'Studio Archive',
    tags: ['ASCII', 'Cyberpunk', 'High Contrast'],
    accentColor: '#9D4EDD',
    config: {
      ...DEFAULT_CONFIG,
      mode: 'ascii',
      ascii: {
        ...DEFAULT_CONFIG.ascii,
        characters: ' .:-=+*#%@',
        fontSize: 10,
        colorMode: 'palette',
        glow: 4,
      },
      palette: BUILTIN_PALETTES[0],
    },
  },
  {
    id: 'preset-dither-bayer-raw',
    title: 'Bayer Industrial',
    subtitle: '8x8 ordered cross-hatch dithering in dual-tone obsidian & acid lime',
    author: 'Studio Archive',
    tags: ['Dither', 'Bayer', 'Acid Lime'],
    accentColor: '#CCFF00',
    config: {
      ...DEFAULT_CONFIG,
      mode: 'dither',
      dither: {
        algorithm: 'bayer-8x8',
        scale: 2,
        threshold: 0.5,
        colorDepth: 2,
        paletteId: 'signal-coral',
        serpentine: true,
      },
      palette: BUILTIN_PALETTES[2],
    },
  },
  {
    id: 'preset-mosaic-diamond',
    title: 'Kinetic Diamond Tessellation',
    subtitle: 'Rotated diamond cells preserving chromatic saturation',
    author: 'Studio Archive',
    tags: ['Mosaic', 'Geometric', 'Editorial'],
    accentColor: '#FF473A',
    config: {
      ...DEFAULT_CONFIG,
      mode: 'pixel-mosaic',
      mosaic: {
        cellSize: 14,
        shape: 'diamond',
        gap: 2,
        jitter: 0,
        angle: 45,
        preserveEdges: true,
      },
      palette: BUILTIN_PALETTES[0],
    },
  },
  {
    id: 'preset-halftone-noir',
    title: 'Rotary Print Halftone',
    subtitle: 'High dynamic range newspaper screen raster in deep monochrome',
    author: 'Studio Archive',
    tags: ['Halftone', 'Noir', 'Print'],
    accentColor: '#B0B0BA',
    config: {
      ...DEFAULT_CONFIG,
      mode: 'halftone',
      halftone: {
        dotSize: 10,
        angle: 45,
        cmykSeparation: false,
        sharpness: 1.5,
      },
      palette: BUILTIN_PALETTES[1],
    },
  },
];

interface ExploreState {
  presets: ArtPreset[];
  selectedCategory: string;
  searchQuery: string;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
}

export const useExploreStore = create<ExploreState>((set) => ({
  presets: CURATED_PRESETS,
  selectedCategory: 'all',
  searchQuery: '',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));

