import { RenderConfig } from './engine';

export type SidebarTab = 'upload' | 'presets' | 'modes' | 'layers';

export interface SamplePhoto {
  id: string;
  title: string;
  category: string;
  width: number;
  height: number;
}

export interface ImageMetadata {
  name: string;
  width: number;
  height: number;
  sizeBytes: number;
  aspectRatio: number;
}

export type ExportFormat = 'png' | 'jpeg' | 'webp' | 'svg' | 'txt' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  scale: number;
  includeBackground: boolean;
  quality: number;
  filename: string;
}

export interface ArtPreset {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  tags: string[];
  config: RenderConfig;
  previewUrl?: string;
  accentColor: string;
}

export interface CreationRecord {
  id: string;
  title: string;
  timestamp: number;
  thumbnail: string;
  mode: string;
  config: RenderConfig;
  exportFormat: ExportFormat;
}
