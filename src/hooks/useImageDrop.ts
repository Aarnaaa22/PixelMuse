import { useState, useCallback } from 'react';
import { loadImageFromFile } from '../utilities';
import { useStudioStore } from '../stores';

export const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
export const MAX_FILE_SIZE_BYTES = 40 * 1024 * 1024; // 40MB
export const MAX_TEXTURE_DIMENSION = 4096; // 4K max sensible processing dimension

export function useImageDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setSourceImage = useStudioStore((s) => s.setSourceImage);

  const processFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);

      // 1. Validate file format
      const isValidType =
        SUPPORTED_MIME_TYPES.includes(file.type) ||
        /\.(jpe?g|png|webp)$/i.test(file.name);

      if (!isValidType) {
        const err = 'Invalid file format. Please upload a valid JPEG, PNG, or WebP image.';
        setErrorMessage(err);
        alert(err);
        return;
      }

      // 2. Validate file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const err = 'File size exceeds 40MB limit. Please upload an image under 40MB.';
        setErrorMessage(err);
        alert(err);
        return;
      }

      try {
        const img = await loadImageFromFile(file);

        // 3. Preserve aspect ratio with sensible dimension constraints
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (width <= 0 || height <= 0) {
          throw new Error('Image dimensions are zero or invalid.');
        }

        if (width > MAX_TEXTURE_DIMENSION || height > MAX_TEXTURE_DIMENSION) {
          const scale = Math.min(
            MAX_TEXTURE_DIMENSION / width,
            MAX_TEXTURE_DIMENSION / height
          );
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        setSourceImage(img, {
          name: file.name,
          width,
          height,
          sizeBytes: file.size,
          aspectRatio: width / height,
        });
      } catch (err) {
        console.error('Failed to parse uploaded image', err);
        const msg = 'Failed to load image. The file may be corrupted or unsupported.';
        setErrorMessage(msg);
        alert(msg);
      }
    },
    [setSourceImage]
  );

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

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFile(e.target.files[0]);
      }
      // Reset input value so selecting the same file consecutively triggers onChange
      e.target.value = '';
    },
    [processFile]
  );

  return {
    isDragging,
    errorMessage,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileInputChange,
    processFile,
  };
}
