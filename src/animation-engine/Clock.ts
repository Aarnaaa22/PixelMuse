export type FrameCallback = (time: number, deltaTime: number) => void;

export class Clock {
  private isRunning = false;
  private startTime = 0;
  private lastTime = 0;
  private currentTime = 0;
  private rafId: number | null = null;
  private listeners: Set<FrameCallback> = new Set();
  
  // FPS calculation
  private frameCount = 0;
  private lastFpsUpdate = 0;
  private currentFps = 60;

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.lastFpsUpdate = this.startTime;
    this.frameCount = 0;
    this.tick = this.tick.bind(this);
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  reset(): void {
    this.currentTime = 0;
    this.startTime = performance.now();
    this.lastTime = this.startTime;
  }

  subscribe(callback: FrameCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getFps(): number {
    return this.currentFps;
  }

  getTime(): number {
    return this.currentTime;
  }

  private tick(now: number): void {
    if (!this.isRunning) return;

    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1); // clamp delta to avoid spiral
    this.lastTime = now;
    this.currentTime = (now - this.startTime) / 1000;

    // Calculate FPS
    this.frameCount++;
    if (now - this.lastFpsUpdate >= 500) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }

    // Notify subscribers
    for (const listener of this.listeners) {
      listener(this.currentTime, deltaTime);
    }

    this.rafId = requestAnimationFrame(this.tick);
  }
}

export const studioClock = new Clock();

