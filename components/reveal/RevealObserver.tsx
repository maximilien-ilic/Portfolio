'use client';

import { useEffect } from 'react';

/* Watches every [data-reveal] element on the page and marks it
   data-shown the first time it scrolls into view. The motion itself is
   pure CSS (globals.css, "Scroll reveal"), keyed on data-reveal:

     up    rises and comes into focus (panels, cards, rows)
     pop   springs in from a smaller size (chips, buttons)
     wipe  is uncovered left to right (the black-strip statements)

   Stagger with an inline --d delay. Nothing is hidden unless the inline
   script in the layout has added .reveal-on to <html>, which it skips for
   reduced motion — so without JavaScript, or with motion turned down,
   everything is simply there. */
export default function RevealObserver() {
  useEffect(() => {
    if (!document.documentElement.classList.contains('reveal-on')) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = '';
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
