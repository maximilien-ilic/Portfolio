'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ESTRELLA_FILLED as WORDS } from './estrella-filled';
import type { Star } from './types';
import styles from './HandLettering.module.css';

/* The name, drawn in front of the visitor.

   A pencil traces the outline of each letter (Estrella, by Uncarving) at a
   constant speed — long contours take longer, as they would — and lifts
   between them. Each letter fills in white as soon as its last contour is
   closed, then small stars come out around the word.

   The geometry comes from scripts/lettering/generate.py --exact. */

const SPEED = 4200; // viewBox units per second — the whole name in about 1.2 s
const LIFT = 0.02; // seconds between two strokes

interface Props {
  /** Called once the last stroke is down. */
  onDrawn?: () => void;
}

type Phase = 'idle' | 'drawing' | 'drawn';

/** A four-pointed sparkle of radius r: four points joined by curves that
    pinch towards the centre. */
function sparkle(r: number) {
  const k = r * 0.16;
  return (
    `M0 ${-r}C${k} ${-k} ${k} ${-k} ${r} 0` +
    `C${k} ${k} ${k} ${k} 0 ${r}` +
    `C${-k} ${k} ${-k} ${k} ${-r} 0` +
    `C${-k} ${-k} ${-k} ${-k} 0 ${-r}Z`
  );
}

/* A few sizes, picked by star number, so they don't all look stamped. */
const STAR_SIZES = [4.6, 3.3, 5.6, 3.8, 5.1, 3.1];

function Stars({ stars, first }: { stars: Star[]; first: number }) {
  // Translate on the outer group (attribute), pop-in and twinkle on the
  // inner ones (CSS): a CSS transform would replace the attribute.
  return (
    <g>
      {stars.map((star, i) => (
        <g key={star.n} transform={`translate(${star.x} ${star.y})`}>
          <g className={styles.star} style={{ ['--i' as string]: first + i }}>
            <path d={sparkle(STAR_SIZES[star.n % STAR_SIZES.length])} className={styles.twinkle} />
          </g>
        </g>
      ))}
    </g>
  );
}

function Pencil() {
  // Tip at the origin, body up and to the right.
  return (
    <g data-pencil="" className={styles.pencil} style={{ opacity: 0 }}>
      <g transform="rotate(-48) scale(1.25)">
        <path d="M0 0 L4.2 -1.7 L17 -1.7 L17 1.7 L4.2 1.7 Z" />
        <path d="M4.2 -1.7 L4.2 1.7 M14.6 -1.7 L14.6 1.7" />
        <path d="M0 0 L1.6 -0.65 L1.6 0.65 Z" className={styles.lead} />
      </g>
    </g>
  );
}

const HIDDEN = { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 };

// Index of each word's first star, so the pop-in stagger runs across both.
const FIRST_STAR = WORDS.map((_, i) => WORDS.slice(0, i).reduce((n, w) => n + w.stars.length, 0));

// Both words share one scale: --total sizes the name on one line, --widest
// on two (see the CSS).
const SIZING = {
  ['--total' as string]: WORDS.reduce((sum, w) => sum + w.viewBox[2], 0) + 14,
  ['--widest' as string]: Math.max(...WORDS.map((w) => w.viewBox[2])) + 4
};

export default function HandLettering({ onDrawn }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const run = useRef(0);

  const draw = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const paths = Array.from(root.querySelectorAll<SVGPathElement>('[data-stroke]'));
    const pencils = Array.from(root.querySelectorAll<SVGGElement>('[data-pencil]'));
    const fills = new Map(
      Array.from(root.querySelectorAll<SVGPathElement>('[data-fill]')).map((el) => [el.dataset.fill!, el])
    );
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const token = ++run.current;

    if (reduce) {
      paths.forEach((p) => {
        p.style.strokeDashoffset = '0';
        p.style.opacity = '1';
      });
      fills.forEach((f) => (f.style.opacity = '1'));
      setPhase('drawn');
      onDrawn?.();
      return;
    }

    setPhase('drawing');

    // A timeline: when each stroke starts and how long it lasts. Lengths
    // are measured once, here, not on every frame.
    let clock = 0;
    const plan = paths.map((path) => {
      const length = path.getTotalLength();
      const duration = length / SPEED;
      const step = {
        path,
        length,
        start: clock,
        duration,
        word: Number(path.dataset.word),
        letter: path.dataset.letter!,
        progress: 0
      };
      clock += duration + LIFT;
      return step;
    });
    const total = clock;
    const started = performance.now();

    const frame = (now: number) => {
      if (token !== run.current) return;
      const elapsed = (now - started) / 1000;

      // The most recent stroke to have started: the pencil is on it, or
      // resting where it lifted off it.
      let current: (typeof plan)[number] | undefined;
      const open = new Set<string>();
      for (const step of plan) {
        const progress = Math.min(1, Math.max(0, (elapsed - step.start) / step.duration));
        // Only touch the DOM when something actually changes.
        if (progress !== step.progress) {
          step.path.style.strokeDashoffset = String(1 - progress);
          // A zero-length dash still paints its round cap, so a stroke
          // that hasn't started stays hidden outright.
          if (step.progress === 0) step.path.style.opacity = '1';
          step.progress = progress;
        }
        if (elapsed >= step.start) current = step;
        if (progress < 1) open.add(step.letter);
      }

      // A letter fills once all of its contours are closed.
      fills.forEach((fill, key) => {
        if (!open.has(key) && fill.style.opacity !== '1') fill.style.opacity = '1';
      });

      pencils.forEach((pencil, index) => {
        const mine = current !== undefined && current.word === index;
        pencil.style.opacity = mine ? '1' : '0';
        if (mine && current) {
          const point = current.path.getPointAtLength(current.length * current.progress);
          pencil.setAttribute('transform', `translate(${point.x} ${point.y})`);
        }
      });

      if (elapsed < total) {
        requestAnimationFrame(frame);
      } else {
        pencils.forEach((p) => (p.style.opacity = '0'));
        fills.forEach((f) => (f.style.opacity = '1'));
        setPhase('drawn');
        onDrawn?.();
      }
    };
    requestAnimationFrame(frame);
  }, [onDrawn]);

  useEffect(() => {
    // Let the first frame of the page paint before the pencil starts.
    const id = window.setTimeout(draw, 200);
    return () => {
      window.clearTimeout(id);
      run.current += 1;
    };
  }, [draw]);

  return (
    <div ref={rootRef} className={styles.lettering} data-phase={phase} style={SIZING}>
      {WORDS.map((word, wordIndex) => {
        const [x, y, w, h] = word.viewBox;
        return (
          <svg
            key={word.word}
            className={styles.word}
            viewBox={`${x} ${y} ${w} ${h}`}
            style={{ ['--vbw' as string]: w }}
            aria-hidden="true"
            focusable="false"
          >
            <g className={styles.letters}>
              <g className={styles.fills}>
                {word.letters.map((letter, li) => (
                  <path key={li} d={letter.fill} data-fill={`${wordIndex}-${li}`} style={{ opacity: 0 }} />
                ))}
              </g>
              <g className={styles.outline}>
                {word.letters.flatMap((letter, li) =>
                  letter.strokes.map((d, i) => (
                    <path
                      key={`${li}-${i}`}
                      d={d}
                      pathLength={1}
                      data-stroke=""
                      data-word={wordIndex}
                      data-letter={`${wordIndex}-${li}`}
                      style={HIDDEN}
                    />
                  ))
                )}
              </g>
            </g>
            <Stars stars={word.stars} first={FIRST_STAR[wordIndex]} />
            <Pencil />
          </svg>
        );
      })}
    </div>
  );
}
