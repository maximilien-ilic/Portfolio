'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/* Keep native page scrolling, but soften wheel/trackpad input. Touch and
   keyboard retain their browser behaviour. */
export default function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | undefined;

    const configure = () => {
      lenis?.destroy();
      lenis = undefined;
      if (reduceMotion.matches) return;

      lenis = new Lenis({
        autoRaf: true,
        smoothWheel: true,
        wheelMultiplier: 0.55,
        lerp: 0.12,
        syncTouch: false,
        anchors: true
      });
    };

    configure();
    reduceMotion.addEventListener('change', configure);
    return () => {
      reduceMotion.removeEventListener('change', configure);
      lenis?.destroy();
    };
  }, []);

  return null;
}
