import { useEffect } from 'react';
import { studioClock, FrameCallback } from '../animation-engine';

export function useAnimationFrame(callback: FrameCallback, isEnabled = true): void {
  useEffect(() => {
    if (!isEnabled) {
      studioClock.stop();
      return;
    }

    studioClock.start();
    const unsubscribe = studioClock.subscribe(callback);

    return () => {
      unsubscribe();
    };
  }, [isEnabled, callback]);
}

