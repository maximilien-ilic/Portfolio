/* Shapes of the generated lettering data (scripts/lettering/generate.py). */

export interface Star {
  x: number;
  y: number;
  n: number;
}

/** One letter in its exact outline: `fill` is the whole letter, `strokes`
    are its closed contours, drawn one after the other. */
export interface FilledLetter {
  char: string;
  fill: string;
  strokes: string[];
}

export interface FilledWord {
  word: string;
  viewBox: [number, number, number, number];
  letters: FilledLetter[];
  stars: Star[];
}
