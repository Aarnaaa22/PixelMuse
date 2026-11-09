import { useState, useCallback } from 'react';
import { loadImageFromFile } from '../utilities';
import { useStudioStore } from '../stores';

export function useImageDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const setSourceImage = useStudioStore((s) => s.setSourceImage);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please provide a valid image file (PNG, JPEG, WebP).');
      return;
    }

    try {
      const img = await loadImageFromFile(file);
      setSourceImage(img, {
        name: file.name,
        width: img.naturalWidth,
        height: img.naturalHeight,
        sizeBytes: file.size,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      });
    } catch (err) {
      console.error('Failed to parse uploaded image', err);
    }
  }, [setSourceImage]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const onFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  return {
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileInputChange,
    processFile,
  };
}

