'use client';

import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { loadGrid, rng } from '@/lib/pixel';
import styles from './Opening.module.css';

/* The first arrival, and only the first.

   The screen starts black and fills in, cell by cell, in the order an ordered
   dither walks its matrix — the way an image used to appear over a slow
   connection. When the picture is complete it holds for a beat, then leaves
   the same way it came: the same cells, the same order, switching off instead
   of on. One mechanism, run twice, so the exit is the entrance played out.

   There is no skip control and no dismissing it. That is a deliberate choice
   by the site's owner, and it puts the whole weight of the thing on its
   length, so this runs in a little over a second and never plays twice for
   the same visitor. Reduced motion never sees it: the head script in
   layout.tsx marks that run before first paint, along with anyone returning.

   Everything random is drawn after mount rather than at module scope. This
   page is prerendered once at build time, so a value decided during render
   would be baked into the HTML and then disagree with whatever the client
   produced. Until the draw lands the container is flat --ink, which is
   exactly what the first frame would have shown anyway. */

/** Cells across and down. 16:9, so the slice crops rather than distorts. */
const COLS = 32;
const ROWS = 18;

/** Viewbox units per cell — the grid is drawn at half the wall's resolution,
    because a loading cell wants to be seen arriving. */
const CELL = 2;

/** Every cell has arrived by the end of this. */
const FILL = 420;

/** The picture complete, before it starts clearing. */
const HOLD = 180;

/** Every cell has gone by the end of this. */
const CLEAR = 420;

/** Light at the top, deep at the bottom. */
const TONES = [
  'var(--sky-low)',
  'var(--sky-step-2)',
  'var(--sky)',
  'var(--sky-step-4)',
  'var(--sky-high)'
];

const GRID = loadGrid({ cols: COLS, rows: ROWS, tones: TONES.length });

const TOTAL = FILL + HOLD + CLEAR;

/** A seeded shuffle. Returns each cell's place in a fresh random order, so
    reading `order[i]` gives the turn cell `i` takes. */
function turns(random: () => number, count: number): number[] {
  const sequence = Array.from({ length: count }, (_, index) => index);

  for (let i = count - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
  }

  const place = new Array<number>(count);
  sequence.forEach((cell, position) => {
    place[cell] = position;
  });

  return place;
}

export default function Opening() {
  const [visible, setVisible] = useState(true);
  const [seed, setSeed] = useState<number | null>(null);

  /* Two independent shuffles per launch: one for the order cells arrive in,
     one for the order they leave in. Bayer still decides which tone a cell
     settles on — that is what makes the ramp a ramp — but nothing decides
     the sequence except the draw, so no two launches fill the same way and
     the exit is never a replay of the entrance. */
  const delays = useMemo(() => {
    if (seed === null) return null;

    const random = rng(seed);
    const count = GRID.length;
    const arriving = turns(random, count);
    const leaving = turns(random, count);
    const last = Math.max(1, count - 1);

    return GRID.map((_, index) => ({
      fill: Math.round((arriving[index] / last) * FILL),
      clear: Math.round(FILL + HOLD + (leaving[index] / last) * CLEAR)
    }));
  }, [seed]);

  useEffect(() => {
    if (document.documentElement.dataset.intro === 'skip') {
      setVisible(false);
      return;
    }

    setSeed(Math.floor(Math.random() * 2 ** 31));

    try {
      localStorage.setItem('greatsea.opening', '1');
    } catch {
      /* Private mode refuses the write; the opening then plays each visit,
         which is a smaller failure than blocking the page on it. */
    }

    /* The hero's cascade starts as the picture begins to clear, so the copy
       is already arriving behind the last cells rather than waiting for an
       empty frame. */
    const cascade = window.setTimeout(() => {
      document.documentElement.dataset.stage = 'ready';
    }, FILL + HOLD);

    const done = window.setTimeout(() => setVisible(false), TOTAL);

    return () => {
      window.clearTimeout(cascade);
      window.clearTimeout(done);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.opening} role="presentation">
      <svg
        className={styles.grid}
        viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
        preserveAspectRatio="xMidYMid slice"
        shapeRendering="crispEdges"
        focusable="false"
        aria-hidden="true"
      >
        {delays &&
          GRID.map((cell, index) => (
            <rect
              key={index}
              className={styles.cell}
              x={cell.x * CELL}
              y={cell.y * CELL}
              width={CELL}
              height={CELL}
              style={
                {
                  '--tone': TONES[cell.tone],
                  /* One delay per animation: when this cell lands, and when
                     it goes. The two orders are unrelated by design. */
                  animationDelay: `${delays[index].fill}ms, ${delays[index].clear}ms`
                } as CSSProperties
              }
            />
          ))}
      </svg>
    </div>
  );
}
