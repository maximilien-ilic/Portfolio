'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import HandLettering, { TITLES, type TitleId } from '@/components/lettering/HandLettering';
import { NAME } from '@/data/site';
import styles from './Hero.module.css';

/* The tagline is built from word chips, like a label maker strip: the one
   that matters is red and torn along the bottom edge. The yellow bubble on
   top is the only call to action in the hero. */
const CHIPS = [
  { text: 'secure-minded', tone: 'red' },
  { text: 'fullstack developer', tone: 'grey' },
  { text: '&', tone: 'dark' },
  { text: 'cybersecurity student', tone: 'grey' }
] as const;

const noop = () => () => {};

export default function Hero() {
  const [drawn, setDrawn] = useState(false);
  const [bubble, setBubble] = useState(true);
  const onDrawn = useCallback(() => setDrawn(true), []);

  // Title under test: ?title=estrella (default), estrella-drawn or anton.
  // Read from the URL on the client; the server renders the default.
  const asked = useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).get('title'),
    () => null
  );
  const title: TitleId = TITLES.includes(asked as TitleId) ? (asked as TitleId) : 'estrella';

  return (
    <section id="home" className={styles.hero} data-drawn={drawn}>
      <h1 className={styles.title}>
        <span className="sr-only">{NAME}</span>
        <HandLettering key={title} title={title} onDrawn={onDrawn} />
      </h1>

      <div className={styles.tagline}>
        {bubble && (
          <div className={styles.bubble}>
            <a href="#contact">let’s talk?</a>
            <button type="button" aria-label="Dismiss" onClick={() => setBubble(false)}>
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 2 L10 10 M10 2 L2 10" />
              </svg>
            </button>
          </div>
        )}

        <p className={styles.chips}>
          {CHIPS.map((chip, index) => (
            <span
              key={chip.text}
              className={`${styles.chip} ${styles[chip.tone]}`}
              style={{ ['--i' as string]: index }}
            >
              {chip.text}
            </span>
          ))}
        </p>
      </div>

      <a href="#about" className={styles.scroll} aria-label="Scroll to the about section">
        <span className={styles.marquee} aria-hidden="true">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>scroll for more</span>
          ))}
        </span>
      </a>
    </section>
  );
}
