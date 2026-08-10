import { row } from './pixel';

/* Hand-placed sprites. Characters, not colours: the palette lives with the
   component so a sprite can be re-lit without being redrawn.

   `.` transparent  `#` lit  `o` shaded  `:` dither */

export const CLOUD_PALETTE: Record<string, string> = {
  '#': '#ffffff',
  o: '#d8f1fb',
  ':': '#bce7f7'
};

/** Big, low, wide — the bank that sits along the top of the reference frame. */
export const CLOUD_BIG = [
  row(['.', 14], ['#', 8], ['.', 22]),
  row(['.', 10], ['#', 16], ['.', 18]),
  row(['.', 6], ['#', 22], ['.', 4], ['#', 6], ['.', 6]),
  row(['.', 3], ['#', 30], ['.', 1], ['#', 8], ['.', 2]),
  row(['.', 1], ['#', 42], ['.', 1]),
  row(['#', 44]),
  row(['o', 44]),
  row(['.', 1], [':o', 21], ['.', 1]),
  row(['.', 3], [':.', 19], ['.', 3]),
  row(['.', 9], [':.', 13], ['.', 9])
];

export const CLOUD_MID = [
  row(['.', 9], ['#', 6], ['.', 15]),
  row(['.', 6], ['#', 13], ['.', 11]),
  row(['.', 3], ['#', 20], ['.', 2], ['#', 3], ['.', 2]),
  row(['.', 1], ['#', 28], ['.', 1]),
  row(['#', 30]),
  row(['o', 30]),
  row(['.', 2], [':o', 13], ['.', 2]),
  row(['.', 5], [':.', 10], ['.', 5])
];

export const CLOUD_SMALL = [
  row(['.', 6], ['#', 5], ['.', 9]),
  row(['.', 3], ['#', 12], ['.', 5]),
  row(['.', 1], ['#', 18], ['.', 1]),
  row(['#', 20]),
  row(['o', 20]),
  row(['.', 2], [':o', 8], ['.', 2]),
  row(['.', 5], [':.', 5], ['.', 5])
];

/* The boat runs with the wind: hull pointing right, sail trailing off the
   mast behind it. `r` is the sail's red swirl — the one place --sail appears
   anywhere on the site. */

export const BOAT_PALETTE: Record<string, string> = {
  m: '#3fbf7f',
  s: '#e8e4d2',
  r: '#e4573c',
  h: '#d9481f',
  w: '#f5f1e4',
  d: '#0a4e86'
};

export const BOAT = [
  row(['.', 16], ['m', 1], ['.', 9]),
  row(['.', 13], ['s', 3], ['m', 1], ['.', 9]),
  row(['.', 12], ['s', 4], ['m', 1], ['.', 9]),
  row(['.', 11], ['s', 5], ['m', 1], ['.', 9]),
  row(['.', 10], ['s', 6], ['m', 1], ['.', 9]),
  row(['.', 9], ['s', 3], ['r', 1], ['s', 3], ['m', 1], ['.', 9]),
  row(['.', 8], ['s', 3], ['r', 2], ['s', 3], ['m', 1], ['.', 9]),
  row(['.', 7], ['s', 3], ['r', 1], ['s', 1], ['r', 1], ['s', 3], ['m', 1], ['.', 9]),
  row(['.', 6], ['s', 4], ['r', 2], ['s', 4], ['m', 1], ['.', 9]),
  row(['.', 5], ['s', 5], ['r', 1], ['s', 5], ['m', 1], ['.', 9]),
  row(['.', 4], ['s', 12], ['m', 1], ['.', 9]),
  row(['.', 3], ['s', 13], ['m', 1], ['.', 9]),
  row(['.', 3], ['s', 13], ['m', 1], ['.', 9]),
  row(['.', 16], ['m', 1], ['.', 9]),
  row(['.', 16], ['m', 1], ['.', 9]),
  row(['.', 4], ['h', 19], ['.', 3]),
  row(['.', 3], ['h', 1], ['w', 18], ['h', 1], ['.', 3]),
  row(['.', 3], ['h', 20], ['.', 3]),
  row(['.', 4], ['h', 18], ['.', 4]),
  row(['.', 6], ['h', 14], ['.', 6]),
  row(['.', 9], ['h', 8], ['.', 9]),
  row(['.', 9], ['d', 9], ['.', 8])
];

/* A gull, far enough away to be two strokes. It is the only thing on the
   page allowed to be this small — anything smaller stops being a shape and
   starts being noise on the grid. */

export const BIRD_PALETTE: Record<string, string> = {
  b: '#04162c'
};

export const BIRD = [
  row(['.', 1], ['b', 1], ['.', 1], ['b', 1], ['.', 1]),
  row(['b', 1], ['.', 3], ['b', 1])
];
