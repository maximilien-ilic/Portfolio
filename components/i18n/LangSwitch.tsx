'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import type { Lang } from './T';
import styles from './LangSwitch.module.css';

/* The FR / EN switch, and the transition that goes with it: six bands in
   the background's colours sweep across the whole screen, the new
   language's name shows for a beat while everything is covered, the text
   swaps underneath, and the bands carry on out the other side.

   The language lives on <html data-lang> (set before first paint by the
   inline script in the layout, from localStorage) and every string is
   already in the page in both languages — see T.tsx. */

const BANDS = ['#f51a29', '#ff6b0a', '#ffcc0f', '#ffb3d1', '#144dff', '#8429f5'];

const NAMES: Record<Lang, string> = { fr: 'Français', en: 'English' };

function readLang(): Lang {
  return document.documentElement.dataset.lang === 'en' ? 'en' : 'fr';
}

function subscribe(onChange: () => void) {
  window.addEventListener('langchange', onChange);
  return () => window.removeEventListener('langchange', onChange);
}

function apply(lang: Lang) {
  const html = document.documentElement;
  html.dataset.lang = lang;
  html.lang = lang;
  try {
    localStorage.setItem('lang', lang);
  } catch {
    // Private mode: the choice just won't be remembered.
  }
  window.dispatchEvent(new Event('langchange'));
}

export default function LangSwitch({ className }: { className?: string }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => 'fr' as Lang);
  const [target, setTarget] = useState<Lang | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const toggle = () => {
    if (busy.current) return;
    const next: Lang = lang === 'fr' ? 'en' : 'fr';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(next);
      return;
    }

    busy.current = true;
    setTarget(next);

    // Wait one frame for the overlay to mount, then run it.
    requestAnimationFrame(() => {
      const overlay = overlayRef.current;
      if (!overlay) {
        apply(next);
        busy.current = false;
        setTarget(null);
        return;
      }
      const bands = Array.from(overlay.querySelectorAll<HTMLElement>('[data-band]'));
      const word = overlay.querySelector<HTMLElement>('[data-word]')!;
      const ease = 'cubic-bezier(0.77, 0, 0.18, 1)';

      // In: bands sweep from the left, each a beat after the previous.
      const ins = bands.map((band, i) =>
        band.animate([{ transform: 'translateX(-115%) skewX(-12deg)' }, { transform: 'translateX(0) skewX(-12deg)' }], {
          duration: 420,
          delay: i * 45,
          easing: ease,
          fill: 'forwards'
        })
      );

      Promise.all(ins.map((a) => a.finished)).then(() => {
        // Fully covered: swap the language, show its name.
        apply(next);
        const show = word.animate(
          [
            { opacity: 0, transform: 'translateY(16px) scale(0.96)' },
            { opacity: 1, transform: 'none', offset: 0.35 },
            { opacity: 1, transform: 'none', offset: 0.75 },
            { opacity: 0, transform: 'translateY(-10px)' }
          ],
          { duration: 520, easing: 'ease-out', fill: 'forwards' }
        );

        // Out: bands carry on to the right, last in first out.
        const outs = bands.map((band, i) =>
          band.animate([{ transform: 'translateX(0) skewX(-12deg)' }, { transform: 'translateX(115%) skewX(-12deg)' }], {
            duration: 440,
            delay: 300 + (bands.length - 1 - i) * 45,
            easing: ease,
            fill: 'forwards'
          })
        );

        Promise.all([show.finished, ...outs.map((a) => a.finished)]).then(() => {
          busy.current = false;
          setTarget(null);
        });
      });
    });
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.switch} ${className ?? ''}`}
        onClick={toggle}
        disabled={target !== null}
        aria-busy={target !== null}
        aria-label={lang === 'fr' ? 'Switch the site to English' : 'Passer le site en français'}
      >
        <span className={lang === 'fr' ? styles.on : undefined}>FR</span>
        <span className={lang === 'en' ? styles.on : undefined}>EN</span>
      </button>

      {target && createPortal(
        <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
          {BANDS.map((color, i) => (
            <div
              key={color}
              data-band=""
              className={styles.band}
              style={{ background: color, top: `${(i * 100) / BANDS.length}%` }}
            />
          ))}
          <div data-word="" className={styles.word}>
            {NAMES[target]}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
