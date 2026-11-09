'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ESTRELLA_DRAWN } from './estrella-drawn';
import { ESTRELLA_FILLED } from './estrella-filled';
import { WORDS, type Dot, type FilledWord, type Word } from './glyphs';
import styles from './HandLettering.module.css';

/* The name, drawn in front of the visitor.

   A pencil travels each outline at a constant speed (long strokes take
   longer, as they would) and lifts between strokes. Two ways to finish:

   - "drawn" titles (Anton, Estrella traced by hand): the outline is the
     drawing. Small stars pop in inside the letters and the line starts to
     "boil": three slightly different tracings shown in turn, the way
     hand-drawn animation never quite holds still.
   - "filled" titles (Estrella as designed): the pencil traces the font's own
     outline, each letter fills in white as soon as it is closed, and stars
     come out around the word.

   The geometry comes from scripts/lettering/generate.py. */

export const TITLES = ['estrella', 'estrella-drawn', 'anton'] as const;
export type TitleId = (typeof TITLES)[number];

type Title = { mode: 'drawn'; words: Word[] } | { mode: 'filled'; words: FilledWord[] };

const DATA: Record<TitleId, Title> = {
  estrella: { mode: 'filled', words: ESTRELLA_FILLED },
  'estrella-drawn': { mode: 'drawn', words: ESTRELLA_DRAWN },
  anton: { mode: 'drawn', words: WORDS }
};

const SPEED = 4200; // viewBox units per second — the whole name in about 1.2 s
const LIFT = 0.02; // seconds between two strokes

interface Props {
  title?: TitleId;
  /** Called once the last stroke is down. */
  onDrawn?: () => void;
}

type Phase = 'idle' | 'drawing' | 'drawn';

/** A four-pointed sparkle of radius r: four points joined by curves that
    pinch towards the centre. */
function star(r: number) {
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

function Stars({ stars, first }: { stars: Dot[]; first: number }) {
  // Translate on the outer group (attribute), pop-in and twinkle on the
  // inner ones (CSS): a CSS transform would replace the attribute.
  return (
    <g>
      {stars.map((dot, i) => (
        <g key={dot.n} transform={`translate(${dot.x} ${dot.y})`}>
          <g className={styles.star} style={{ ['--i' as string]: first + i }}>
            <path d={star(STAR_SIZES[dot.n % STAR_SIZES.length])} className={styles.twinkle} />
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

export default function HandLettering({ title = 'estrella', onDrawn }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const run = useRef(0);
  const data = DATA[title];

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

    paths.forEach((p) => {
      p.style.strokeDashoffset = '1';
      p.style.opacity = '0';
    });
    fills.forEach((f) => (f.style.opacity = '0'));
    setPhase('drawing');

    // A timeline: when each stroke starts and how long it lasts.
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
        letter: path.dataset.letter
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
        step.path.style.strokeDashoffset = String(1 - progress);
        // A zero-length dash still paints its round cap, so a stroke that
        // hasn't started is hidden outright.
        step.path.style.opacity = progress > 0 ? '1' : '0';
        if (elapsed >= step.start) current = step;
        if (step.letter && progress < 1) open.add(step.letter);
      }

      // A letter fills once all of its contours are closed.
      fills.forEach((fill, key) => {
        if (!open.has(key)) fill.style.opacity = '1';
      });

      pencils.forEach((pencil, index) => {
        const mine = current !== undefined && current.word === index;
        pencil.style.opacity = mine ? '1' : '0';
        if (mine && current) {
          const progress = Math.min(1, (elapsed - current.start) / current.duration);
          const point = current.path.getPointAtLength(current.length * progress);
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

  // Both words share one scale: --total sizes the name on one line, --widest
  // on two (see the CSS).
  const boxes = data.words.map((w) => w.viewBox);
  const sizing = {
    ['--total' as string]: boxes.reduce((sum, b) => sum + b[2], 0) + 14,
    ['--widest' as string]: Math.max(...boxes.map((b) => b[2])) + 4
  };

  let starIndex = 0;

  return (
    <div
      ref={rootRef}
      className={`${styles.lettering} ${data.mode === 'filled' ? styles.filled : ''}`}
      data-phase={phase}
      style={sizing}
    >
      {data.mode === 'filled'
        ? data.words.map((word, wordIndex) => {
            const [x, y, w, h] = word.viewBox;
            const first = starIndex;
            starIndex += word.stars.length;
            return (
              <svg
                key={word.word}
                className={styles.word}
                viewBox={`${x} ${y} ${w} ${h}`}
                style={{ ['--vbw' as string]: w }}
                aria-hidden="true"
                focusable="false"
              >
                <g className={styles.fills}>
                  {word.letters.map((letter, li) => (
                    <path key={li} d={letter.fill} data-fill={`${wordIndex}-${li}`} style={{ opacity: 0 }} />
                  ))}
                </g>
                <g className={`${styles.frame} ${styles.outline}`}>
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
                <Stars stars={word.stars} first={first} />
                <Pencil />
              </svg>
            );
          })
        : data.words.map((word, wordIndex) => {
            const [x, y, w, h] = word.viewBox;
            const dots = word.letters.flatMap((letter) => letter.dots);
            const first = starIndex;
            starIndex += dots.length;
            return (
              <svg
                key={word.word}
                className={styles.word}
                viewBox={`${x} ${y} ${w} ${h}`}
                style={{ ['--vbw' as string]: w }}
                aria-hidden="true"
                focusable="false"
              >
                {/* Boil frames 1 and 2: shown only once drawing is over. */}
                {[1, 2].map((variant) => (
                  <g key={variant} className={`${styles.frame} ${styles[`frame${variant}`]}`}>
                    {word.letters.flatMap((letter, li) =>
                      letter.strokes.map((stroke, i) => <path key={`${li}-${i}`} d={stroke.d[variant]} />)
                    )}
                  </g>
                ))}

                {/* Frame 0: the one that gets drawn. */}
                <g className={`${styles.frame} ${styles.frame0}`}>
                  {word.letters.flatMap((letter, li) =>
                    letter.strokes.map((stroke, i) => (
                      <path
                        key={`${li}-${i}`}
                        d={stroke.d[0]}
                        pathLength={1}
                        data-stroke=""
                        data-word={wordIndex}
                        style={HIDDEN}
                      />
                    ))
                  )}
                </g>

                <Stars stars={dots} first={first} />
                <Pencil />
              </svg>
            );
          })}
    </div>
  );
}
