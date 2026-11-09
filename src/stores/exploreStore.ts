import { create } from 'zustand';
import { ArtPreset } from '../types';
import { DEFAULT_CONFIG, BUILTIN_PALETTES } from './studioStore';

export const CURATED_PRESETS: ArtPreset[] = [
  {
    id: 'preset-mosaic-cyberpunk',
    title: 'Chromatic Mosaic Matrix',
    subtitle: 'High-contrast cellular rectangles with electric violet and acid lime spectrum',
    author: 'Studio Archive',
    tags: ['Mosaic', 'Rectangular', 'Cyberpunk'],
    accentColor: '#CCFF00',
    config: {
      ...DEFAULT_CONFIG,
      mode: 'mosaic',
      renderParams: {
        ...DEFAULT_CONFIG.renderParams,
        cellSize: 14,
        coverage: 90,
        density: 1.0,
        edgeEmphasis: 40,
        invert: false,
      },
      palette: BUILTIN_PALETTES[0],
    },
  },
  {
    id: 'preset-pixel-retro',
    title: 'Arcade Phosphor Pixels',
    subtitle: 'Crisp quantized pixel blocks mapping continuous tones to arcade color palettes',
    author: 'Studio Archive',
    tags: ['Pixel', 'Retro', 'Arcade'],
    accentColor: '#33E533',
    config: {
      ...DEFAULT_CONFIG,
      mode: 'pixel',
      renderParams: {
        ...DEFAULT_CONFIG.renderParams,
        cellSize: 10,
        coverage: 100,
        density: 1.0,
        edgeEmphasis: 0,
        invert: false,
      },
      palette: BUILTIN_PALETTES[4],
    },
  },
  {
    id: 'preset-ascii-cyberpunk',
    title: 'Cyberpunk Monolith',
    subtitle: 'Fine density glyph matrix with electric violet bloom and Rec.709 luminance',
    author: 'Studio Archive',
    tags: ['ASCII', 'Cyberpunk', 'High Contrast'],
    accentColor: '#9D4EDD',
    config: {
      ...DEFAULT_CONFIG,
      mode: 'ascii',
      renderParams: {
        ...DEFAULT_CONFIG.renderParams,
        cellSize: 10,
        density: 1.2,
        charSet: ' .:-=+*#%@$░▒▓█',
        invert: false,
      },
      ascii: {
        ...DEFAULT_CONFIG.ascii,
        characters: ' .:-=+*#%@$░▒▓█',
        fontSize: 10,
        colorMode: 'palette',
        glow: 6,
      },
      palette: BUILTIN_PALETTES[0],
    },
  },
  {
    id: 'preset-dots-stipple',
    title: 'Lithographic Halftone Dots',
    subtitle: 'Modulated circular dots scaling with optical density for stark editorial print look',
    author: 'Studio Archive',
    tags: ['Dots', 'Halftone', 'Editorial'],
    accentColor: '#FF473A',
    config: {
      ...DEFAULT_CONFIG,
      mode: 'dots',
      renderParams: {
        ...DEFAULT_CONFIG.renderParams,
        cellSize: 12,
        coverage: 85,
        density: 1.0,
        edgeEmphasis: 30,
        invert: false,
      },
      palette: BUILTIN_PALETTES[2],
    },
  },
  {
    id: 'preset-dither-bayer-raw',
    title: 'Bayer Industrial',
    subtitle: '8x8 ordered cross-hatch dithering in dual-tone obsidian and acid lime',
    author: 'Studio Archive',
    tags: ['Dither', 'Bayer', 'Acid Lime'],
    accentColor: '#CCFF00',
    config: {
      ...DEFAULT_CONFIG,
      mode: 'dither',
      renderParams: {
        ...DEFAULT_CONFIG.renderParams,
        cellSize: 8,
        invert: false,
      },
      dither: {
        algorithm: 'bayer-8x8',
        scale: 2,
        threshold: 0.5,
        colorDepth: 2,
        paletteId: 'cyberpunk-editorial',
        serpentine: true,
      },
      palette: BUILTIN_PALETTES[0],
    },
  },
  {
    id: 'preset-dither-atkinson',
    title: 'Atkinson 1984 Macintosh',
    subtitle: 'Legendary MacPaint error diffusion preserving 75% error for clean, crisp grain',
    author: 'Studio Archive',
    tags: ['Dither', 'Atkinson', 'Noir'],
    accentColor: '#B0B0BA',
    config: {
      ...DEFAULT_CONFIG,
      mode: 'dither',
      renderParams: {
        ...DEFAULT_CONFIG.renderParams,
        cellSize: 8,
        invert: false,
      },
      dither: {
        algorithm: 'atkinson',
        scale: 2,
        threshold: 0.5,
        colorDepth: 2,
        paletteId: 'noir-monochrome',
        serpentine: true,
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
