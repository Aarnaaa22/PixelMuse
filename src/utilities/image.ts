export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        try {
          if ('decode' in img) {
            await img.decode();
          }
        } catch {
          // Fall back gracefully if decode() fails or is unsupported
        }
        resolve(img);
      };
      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from URL: ${url}`));
    img.src = url;
  });
}

/**
 * Creates a sample generative studio photograph placeholder
 * so the studio is immediately alive even before uploading a custom photo.
 */
export function createDefaultStudioCanvas(width = 640, height = 640): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Obsidian atmospheric dark gradient background
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#0F0E17');
  bg.addColorStop(0.5, '#1A1829');
  bg.addColorStop(1, '#08080C');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Editorial sculptural geometric form (torus/cylinder highlight)
  const cx = width / 2;
  const cy = height / 2;

  // Ambient glows
  const radialGlow = ctx.createRadialGradient(cx, cy - 40, 20, cx, cy, 260);
  radialGlow.addColorStop(0, 'rgba(157, 78, 221, 0.45)');
  radialGlow.addColorStop(0.5, 'rgba(204, 255, 0, 0.25)');
  radialGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  // Central sculptural subject (monolithic marble bust or geometric sphere)
  const sphereGrad = ctx.createRadialGradient(cx - 50, cy - 60, 10, cx, cy, 180);
  sphereGrad.addColorStop(0, '#FFFFFF');
  sphereGrad.addColorStop(0.2, '#E2E1D9');
  sphereGrad.addColorStop(0.5, '#736B92');
  sphereGrad.addColorStop(0.8, '#252136');
  sphereGrad.addColorStop(1, '#0C0A14');
  ctx.fillStyle = sphereGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 170, 0, Math.PI * 2);
  ctx.fill();

  // Acid lime razor rim light
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#CCFF00';
  ctx.beginPath();
  ctx.arc(cx, cy, 170, Math.PI * 0.75, Math.PI * 1.35);
  ctx.stroke();

  // Signal coral dynamic accent line
  ctx.strokeStyle = '#FF473A';
  ctx.beginPath();
  ctx.arc(cx, cy, 170, Math.PI * 1.85, Math.PI * 0.25);
  ctx.stroke();

  return canvas;
}

