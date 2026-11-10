export interface SamplePhotoItem {
  id: string;
  name: string;
  category: string;
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}

export const SAMPLE_PHOTOS: SamplePhotoItem[] = [
  {
    id: 'marble-sculpture',
    name: 'Marble Monolith Bust',
    category: 'Sculpture / High Dynamic Range',
    width: 640,
    height: 640,
    draw: (ctx, w, h) => {
      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#0F0E17');
      bg.addColorStop(0.5, '#1A1829');
      bg.addColorStop(1, '#08080C');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Glow behind head
      const radialGlow = ctx.createRadialGradient(cx, cy - 40, 20, cx, cy, 260);
      radialGlow.addColorStop(0, 'rgba(157, 78, 221, 0.45)');
      radialGlow.addColorStop(0.5, 'rgba(204, 255, 0, 0.25)');
      radialGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, w, h);

      // Central sculptural sphere/bust
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

      // Razor rim lights
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#CCFF00';
      ctx.beginPath();
      ctx.arc(cx, cy, 170, Math.PI * 0.75, Math.PI * 1.35);
      ctx.stroke();

      ctx.strokeStyle = '#FF473A';
      ctx.beginPath();
      ctx.arc(cx, cy, 170, Math.PI * 1.85, Math.PI * 0.25);
      ctx.stroke();
    },
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cybernetic Neon Profile',
    category: 'Portrait / Chromatic Rim',
    width: 640,
    height: 640,
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Silhouette head
      ctx.fillStyle = '#1A1A24';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 140, 180, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dual neon rim lights
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#9D4EDD';
      ctx.beginPath();
      ctx.arc(cx, cy, 145, Math.PI * 0.5, Math.PI * 1.5);
      ctx.stroke();

      ctx.strokeStyle = '#CCFF00';
      ctx.beginPath();
      ctx.arc(cx, cy, 145, Math.PI * 1.5, Math.PI * 0.5);
      ctx.stroke();

      // High-tech ocular visor
      ctx.fillStyle = '#FF473A';
      ctx.fillRect(cx - 100, cy - 40, 200, 24);
    },
  },
  {
    id: 'brutalist-concrete',
    name: 'Brutalist Concrete Facade',
    category: 'Architecture / Linear',
    width: 640,
    height: 640,
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#111116';
      ctx.fillRect(0, 0, w, h);

      // Angled concrete piers
      for (let i = 0; i < 8; i++) {
        const x = i * 85 - 20;
        const grad = ctx.createLinearGradient(x, 0, x + 70, h);
        grad.addColorStop(0, i % 2 === 0 ? '#EAEAEF' : '#454552');
        grad.addColorStop(0.5, i % 2 === 0 ? '#9898A6' : '#22222B');
        grad.addColorStop(1, '#09090C');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 60, 0);
        ctx.lineTo(x + 20, h);
        ctx.lineTo(x - 40, h);
        ctx.closePath();
        ctx.fill();
      }
    },
  },
  {
    id: 'botanical-cellular',
    name: 'Botanical Leaf Veins',
    category: 'Organic / High Contrast',
    width: 640,
    height: 640,
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#080A08';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;

      // Central stem
      ctx.strokeStyle = '#CCFF00';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx, h);
      ctx.bezierCurveTo(cx - 30, h * 0.6, cx + 30, h * 0.3, cx, 0);
      ctx.stroke();

      // Radiating leaf veins
      ctx.strokeStyle = '#33E533';
      ctx.lineWidth = 2;
      for (let y = 80; y < h - 40; y += 45) {
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.lineTo(cx - 180, y - 60);
        ctx.moveTo(cx, y);
        ctx.lineTo(cx + 180, y - 60);
        ctx.stroke();
      }
    },
  },
];

export function createSamplePhotoCanvas(sampleId: string): HTMLCanvasElement {
  const sample = SAMPLE_PHOTOS.find((s) => s.id === sampleId) || SAMPLE_PHOTOS[0];
  const canvas = document.createElement('canvas');
  canvas.width = sample.width;
  canvas.height = sample.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    sample.draw(ctx, sample.width, sample.height);
  }
  return canvas;
}

export async function createSamplePhotoImage(sampleId: string): Promise<HTMLImageElement> {
  const canvas = createSamplePhotoCanvas(sampleId);
  const dataUrl = canvas.toDataURL('image/png');
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        if ('decode' in img) {
          await img.decode();
        }
      } catch {
        // Fall back gracefully
      }
      resolve(img);
    };
    img.onerror = () => reject(new Error('Failed to decode sample photograph asset.'));
    img.src = dataUrl;
  });
}
