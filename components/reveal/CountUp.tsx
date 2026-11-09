'use client';

import { useEffect, useRef } from 'react';

/* A number that counts up from zero the first time it scrolls into view.
   The server renders the real value, so without JavaScript (or with
   reduced motion) the figure is just there; the count writes to the DOM
   directly, one frame at a time, without re-rendering. */
export default function CountUp({ value, duration = 900 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains('reveal-on')) return;

    const format = (n: number) => Math.round(n).toLocaleString('en');
    el.textContent = format(0);
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(2, -10 * t); // ease-out expo
          el.textContent = format(t === 1 ? value : value * eased);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return <span ref={ref}>{value.toLocaleString('en')}</span>;
}
