'use client';

import { useCallback, useState } from 'react';
import HandLettering from '@/components/lettering/HandLettering';
import T from '@/components/i18n/T';
import { NAME } from '@/data/site';
import styles from './Hero.module.css';

/* The tagline is built from word chips, like a label maker strip: the one
   that matters is red and torn along the bottom edge. The yellow bubble on
   top is the only call to action in the hero. */
const CHIPS = [
  { key: 'secure', fr: 'esprit sécurité', en: 'secure-minded', tone: 'red' },
  { key: 'dev', fr: 'développeur fullstack', en: 'fullstack developer', tone: 'grey' },
  { key: 'and', fr: '&', en: '&', tone: 'dark' },
  { key: 'student', fr: 'étudiant en cybersécurité', en: 'cybersecurity student', tone: 'grey' }
] as const;

export default function Hero() {
  const [drawn, setDrawn] = useState(false);
  const [bubble, setBubble] = useState(true);
  const onDrawn = useCallback(() => setDrawn(true), []);

  return (
    <section id="home" className={styles.hero} data-drawn={drawn} data-live="">
      <h1 className={styles.title}>
        <span className="sr-only">{NAME}</span>
        <HandLettering onDrawn={onDrawn} />
      </h1>

      <div className={styles.tagline}>
        {bubble && (
          <div className={styles.bubble}>
            <a href="#contact">
              <T fr="on en parle ?" en="let’s talk?" />
            </a>
            <button type="button" aria-label="Fermer · Dismiss" onClick={() => setBubble(false)}>
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 2 L10 10 M10 2 L2 10" />
              </svg>
            </button>
          </div>
        )}

        <p className={styles.chips}>
          {CHIPS.map((chip, index) => (
            <span
              key={chip.key}
              className={`${styles.chip} ${styles[chip.tone]}`}
              style={{ ['--i' as string]: index }}
            >
              <T fr={chip.fr} en={chip.en} />
            </span>
          ))}
        </p>
      </div>

      <a href="#about" className={styles.scroll} aria-label="À propos · About">
        <span className={styles.marquee} aria-hidden="true">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className={styles.marqueeItem}>
              <T fr="défiler pour voir" en="scroll for more" />
            </span>
          ))}
        </span>
      </a>
    </section>
  );
}
