export interface ViewportTransform {
  scale: number;
  translateX: number;
  translateY: number;
}

export class ViewportController {
  private transform: ViewportTransform = {
    scale: 1,
    translateX: 0,
    translateY: 0,
  };

  getTransform(): ViewportTransform {
    return { ...this.transform };
  }

  setZoom(scale: number): void {
    this.transform.scale = Math.max(0.1, Math.min(8, scale));
  }

  zoomBy(delta: number): void {
    this.setZoom(this.transform.scale * delta);
  }

  pan(dx: number, dy: number): void {
    this.transform.translateX += dx;
    this.transform.translateY += dy;
  }

  reset(): void {
    this.transform = {
      scale: 1,
      translateX: 0,
      translateY: 0,
    };
  }

  fitToContainer(containerWidth: number, containerHeight: number, contentWidth: number, contentHeight: number): void {
    const scaleX = (containerWidth * 0.85) / contentWidth;
    const scaleY = (containerHeight * 0.85) / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1.5);
    
    this.transform = {
      scale: Math.max(0.2, scale),
      translateX: 0,
      translateY: 0,
    };
  }
}

