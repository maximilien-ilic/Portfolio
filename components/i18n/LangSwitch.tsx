'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import type { Lang } from './T';
import styles from './LangSwitch.module.css';

/* A dark paper shutter covers the page while the language changes.
   The language names use outlines from Estrella, just like the hero. */

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
      const bands = Array.from(overlay.querySelectorAll<HTMLElement>('[data-shutter]'));
      const word = overlay.querySelector<HTMLElement>('[data-word]')!;
      const ease = 'cubic-bezier(0.77, 0, 0.18, 1)';

      // Two sheets rise from the bottom, leaving a narrow paper edge.
      const ins = bands.map((band, i) =>
        band.animate([{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }], {
          duration: 460,
          delay: i * 65,
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
          { duration: 600, easing: 'ease-out', fill: 'forwards' }
        );

        // Both sheets continue upwards to reveal the translated page.
        const outs = bands.map((band, i) =>
          band.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-105%)' }], {
            duration: 440,
            delay: 420 + (bands.length - 1 - i) * 65,
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
          <div data-shutter="" className={`${styles.shutter} ${styles.edge}`} />
          <div data-shutter="" className={styles.shutter} />
          <div data-word="" className={styles.word}>
            {/* Outlined SVGs preserve Estrella’s letterforms, including ç. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/lettering/${target}.svg`} alt="" width="800" height="240" />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
