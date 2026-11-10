import { useState, useCallback } from 'react';
import { loadImageFromFile } from '../utilities';
import { useStudioStore } from '../stores';

export const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
export const MAX_FILE_SIZE_BYTES = 40 * 1024 * 1024; // 40MB
export const MAX_TEXTURE_DIMENSION = 4096; // 4K max sensible processing dimension

export function useImageDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setSourceImage, setUploadError, setIsImageLoading } = useStudioStore();

  const processFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);
      setUploadError(null);
      setIsImageLoading(true);

      try {
        // 1. Validate file format (PNG, JPEG, WebP)
        const isValidType =
          SUPPORTED_MIME_TYPES.includes(file.type) ||
          /\.(jpe?g|png|webp)$/i.test(file.name);

        if (!isValidType) {
          throw new Error(
            `Unsupported image format (${file.type || 'unknown'}). Please upload a valid PNG, JPEG, or WebP photograph.`
          );
        }

        // 2. Validate file size (max 40MB)
        if (file.size > MAX_FILE_SIZE_BYTES) {
          throw new Error(
            `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 40MB limit. Please upload an image under 40MB.`
          );
        }

        // 3. Asynchronously load and decode image bitmap
        const img = await loadImageFromFile(file);

        // 4. Preserve aspect ratio with sensible maximum texture dimension constraints
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

        // 5. Separate image source asset and metadata in state
        setSourceImage(img, {
          name: file.name,
          width,
          height,
          sizeBytes: file.size,
          aspectRatio: width / height,
        });
      } catch (err: any) {
        const errorMsg = err?.message || 'Failed to decode image. The file may be corrupted or in an unsupported format.';
        console.error('[PixelMuse Image Upload Error]:', err);
        setErrorMessage(errorMsg);
        setUploadError(errorMsg);
      } finally {
        setIsImageLoading(false);
      }
    },
    [setSourceImage, setUploadError, setIsImageLoading]
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
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          await processFile(e.dataTransfer.files[i]);
        }
      }
    },
    [processFile]
  );

  const onFileInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        for (let i = 0; i < e.target.files.length; i++) {
          await processFile(e.target.files[i]);
        }
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
