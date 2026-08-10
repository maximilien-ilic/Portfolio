/* Pixel-art primitives.

   Everything on this page that is "drawn" is built from 1×1 cells on an
   integer grid, then scaled by a whole number of CSS pixels — that is the
   only way the pixels stay square. Sprites are authored as text so they can
   be read and edited in place; the sea is generated from a seeded walk so a
   stair-step never lands on a curve.

   Nothing here touches the DOM, so it runs identically on the server and in
   the browser — the sea is the same sea on both. */

/** A horizontal run of identical cells: x, y, width. Height is always 1. */
export type Run = [x: number, y: number, w: number];

/** Runs grouped by the character that produced them, so a whole colour can
    be painted with one fill on one group. */
export type RunsByChar = Record<string, Run[]>;

/** mulberry32 — small, fast, and deterministic from a seed. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Builds one sprite row from `[character, count]` segments.

    Authoring rows as segments instead of literal strings means a row can
    never be one cell too short — a mistake that is invisible in a string of
    dots and ruins the sprite. */
export function row(...segments: Array<[string, number]>): string {
  return segments.map(([char, count]) => char.repeat(count)).join('');
}

/** Turns text rows into runs, merging each stretch of identical characters.
    `.` is transparent and is never emitted. */
export function spriteRuns(rows: string[]): RunsByChar {
  const out: RunsByChar = {};

  rows.forEach((line, y) => {
    let x = 0;
    while (x < line.length) {
      const char = line[x];
      let width = 1;
      while (line[x + width] === char) width += 1;

      if (char !== '.') {
        (out[char] ??= []).push([x, y, width]);
      }

      x += width;
    }
  });

  return out;
}

interface FoamOptions {
  /** Tile width in cells. Lines start and end at the same height so the tile
      repeats without a seam. */
  width: number;
  /** How many horizontal lines to lay down. */
  lines: number;
  /** Vertical span the lines are spread across. */
  height: number;
  /** Cell thickness of each line. */
  weight?: number;
  /** Diagonal connectors drawn between neighbouring lines. These are what
      turn a set of parallel waves into the net the reference frame shows. */
  connectors?: number;
}

/** The sea's foam: horizontal lines that wander a cell or two up and down,
    tied together by short diagonals.

    Every line is forced back to its starting height before the tile ends,
    which is what lets one tile repeat forever without a visible seam. */
export function foamNet(seed: number, options: FoamOptions): Run[] {
  const { width, lines, height, weight = 1, connectors = 2 } = options;
  const random = rng(seed);
  const runs: Run[] = [];

  const spacing = height / lines;
  const baselines: number[] = [];

  for (let line = 0; line < lines; line += 1) {
    const baseline = Math.round(spacing * (line + 0.5));
    baselines.push(baseline);

    let x = 0;
    let y = baseline;

    const emit = (at: number, top: number, span: number) => {
      for (let w = 0; w < weight; w += 1) {
        runs.push([at, top + w, span]);
      }
    };

    /* A line holds a heading for a while instead of wobbling cell by cell:
       long flats, then long diagonals. That is the difference between a net
       and a set of parallel stripes — the reference's cells have slanted
       walls, and a walk that only ever drifts one cell can't draw them. */
    while (x < width) {
      const remaining = width - x;

      // Near the end, steer back to the baseline so the tile joins cleanly.
      if (remaining <= Math.abs(y - baseline) * 3 + 8) {
        const back = Math.sign(baseline - y);

        if (back === 0) {
          emit(x, y, remaining);
          break;
        }

        const span = Math.min(remaining, 3);
        emit(x, y, span);
        x += span;
        y += back;
        continue;
      }

      const roll = random();
      const slope = roll < 0.45 ? 0 : roll < 0.72 ? 1 : -1;

      if (slope === 0) {
        const span = Math.min(remaining, 8 + Math.floor(random() * 16));
        emit(x, y, span);
        x += span;
        continue;
      }

      const steps = 3 + Math.floor(random() * 5);

      for (let step = 0; step < steps && x < width; step += 1) {
        const span = Math.min(width - x, 2 + Math.floor(random() * 2));
        emit(x, y, span);
        x += span;

        const next = y + slope;
        if (next < 0 || next > height - weight) break;
        y = next;
      }
    }
  }

  // Connectors run from one line down to the next. They advance two or three
  // cells per row rather than one, so the cell walls lean the way the
  // reference's do instead of cutting straight down at 45°.
  for (let line = 0; line < baselines.length - 1; line += 1) {
    for (let n = 0; n < connectors; n += 1) {
      const from = baselines[line];
      const to = baselines[line + 1];
      const direction = random() < 0.5 ? -1 : 1;
      let x = Math.floor(random() * width);

      for (let y = from; y < to; y += 1) {
        const span = 2 + Math.floor(random() * 2);
        const start = direction > 0 ? x : x - span;

        if (start + span > 0 && start < width) {
          runs.push([Math.max(0, start), y, span]);
        }

        x += direction * span;
      }
    }
  }

  return runs;
}

interface TerrainOptions {
  /** Tile width in cells. The walk is steered back to its starting height
      before the tile ends, so the tile repeats without a seam. */
  width: number;
  /** Strip height in cells. The floor fills from its top edge downwards. */
  height: number;
  /** How far the surface may climb above its base. */
  relief?: number;
  /** How many cells a step keeps its heading. Long holds read as ledges,
      short ones as gravel. */
  hold?: number;
}

/** The seabed: a seeded walk along the top edge, filled to the bottom.

    Same construction as the foam — a heading held for several cells at a
    time, so the silhouette comes out as ledges and slopes rather than as
    noise. Deterministic from the seed, so it is the same floor on the
    server and in the browser. */
export function terrain(seed: number, options: TerrainOptions): Run[] {
  const { width, height, relief = 4, hold = 6 } = options;
  const random = rng(seed);
  const runs: Run[] = [];

  const base = height - 1;
  const ceiling = Math.max(0, base - relief);
  const tops: number[] = [];

  let top = base;
  let steps = 0;
  let heading = 0;

  for (let x = 0; x < width; x += 1) {
    if (steps <= 0) {
      heading = Math.floor(random() * 3) - 1;
      steps = 1 + Math.floor(random() * hold);
    }

    top = Math.min(base, Math.max(ceiling, top + heading));
    steps -= 1;
    tops.push(top);
  }

  /* Ease the tail back to the height the tile started at. Without this the
     seam between two copies is a cliff. */
  const tail = Math.min(width, relief * 4);
  for (let i = 0; i < tail; i += 1) {
    const x = width - tail + i;
    tops[x] = Math.round(tops[x] + ((base - tops[x]) * (i + 1)) / tail);
  }

  /* One run per horizontal span, not one per cell: a filled row is a single
     rect instead of a few hundred. */
  for (let y = 0; y < height; y += 1) {
    let x = 0;

    while (x < width) {
      if (tops[x] > y) {
        x += 1;
        continue;
      }

      let span = 1;
      while (x + span < width && tops[x + span] <= y) span += 1;

      runs.push([x, y, span]);
      x += span;
    }
  }

  return runs;
}
/* Ordered dither, 4x4. The standard Bayer threshold map: it spreads a choice
   between two neighbouring tones over a repeating grid rather than deciding
   it at random, which is why the result reads as a gradient instead of as
   noise — and why walking it in order reads as an image decoding rather than
   as cells switching on at random. */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

/** One cell of the opening's grid: where it sits, which tone it settles on,
    and which pass of the dither brings it in. */
export interface LoadCell {
  x: number;
  y: number;
  /** Index into the caller's tone ramp, light at the top. */
  tone: number;
  /** 0–15. Its place in the Bayer order, and so its turn. */
  level: number;
}

interface LoadGridOptions {
  cols: number;
  rows: number;
  /** How many tones the gradient steps through, top to bottom. */
  tones: number;
}

/** The opening's grid: a dithered vertical ramp, plus the order it arrives in.

    One matrix does both jobs. Read across a row it decides which of two
    neighbouring tones a cell takes, which is how a gradient is built out of
    flat colours and nothing else. Read as a sequence it decides which cells
    land first, which is how an image used to appear on a slow connection.
    The ramp and the loading are therefore the same structure seen twice, not
    two effects stacked on each other. */
export function loadGrid({ cols, rows, tones }: LoadGridOptions): LoadCell[] {
  const cells: LoadCell[] = [];

  for (let y = 0; y < rows; y += 1) {
    const position = (y / Math.max(1, rows - 1)) * (tones - 1);
    const base = Math.min(tones - 2, Math.floor(position));
    const frac = position - base;

    for (let x = 0; x < cols; x += 1) {
      const level = BAYER[y % 4][x % 4];
      const threshold = (level + 0.5) / 16;

      cells.push({
        x,
        y,
        tone: base + (frac > threshold ? 1 : 0),
        level
      });
    }
  }

  return cells;
}
