"""Generates the hand-drawn hero lettering (components/lettering/glyphs.ts).

Each letter starts from the outline of a heavy grotesque (Archivo Black, OFL)
and is turned into what a person tracing that outline with a pen would draw:

  1. The contours are resampled and smoothed, so corners round off the way a
     hand rounds them.
  2. The line is pushed in and out along its normal by low-frequency noise —
     wobble, not jitter.
  3. Each loop is drawn as one open stroke that starts somewhere arbitrary and
     overshoots its own start, so the end misses the beginning slightly.
  4. Every letter gets its own small rotation, scale and baseline shift.

Three "boil" variants are generated per stroke: the same drawing with a little
extra noise each, cycled on screen like hand-drawn animation frames.

Run:  python3 scripts/lettering/generate.py path/to/font.ttf [x-scale] [tracking] [seed] [options]

Options:
  --words=Maximilien,Ilic   the words to draw (default MAXIMILIEN,ILIC)
  --no-slash                leave out the pen stroke through the first A
  --export=NAME             name of the exported constant (default WORDS);
                            any other name imports the types from ./glyphs
  --exact                   keep the font's own outlines (no wobble, no boil):
                            one closed path per contour to draw, plus a fill
                            path per letter, and stars placed around the
                            letters instead of inside them

Current titles:
  Anton (OFL), hand-drawn:
    generate.py Anton-Regular.ttf 1.05 30 > components/lettering/glyphs.ts
  Estrella (Uncarving), hand-drawn:
    generate.py Estrella-Early.otf 1.0 10 --words=Maximilien,Ilic --no-slash \
      --export=ESTRELLA_DRAWN > components/lettering/estrella-drawn.ts
  Estrella, exact, drawn then filled:
    generate.py Estrella-Early.otf 1.0 10 --words=Maximilien,Ilic --exact \
      --export=ESTRELLA_FILLED > components/lettering/estrella-filled.ts
"""

import json
import math
import os
import random
import sys

from fontTools.pens.basePen import BasePen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

WORDS = ["MAXIMILIEN", "ILIC"]
SEED = 11
X_SCALE = 0.84        # narrow the face a little: taller letters for the width
STEP = 5.0            # resampling step, font units
SMOOTH = 7            # moving-average half window, in samples
WOBBLE = 16.0         # base hand wobble amplitude, font units
BOIL = 4.5            # extra per-frame wobble for the boil variants
VARIANTS = 3
OUT_SCALE = 0.1       # font units -> output units
TRACKING = -40        # letters overlap slightly, like quick handwriting
CAP_SCALE = 1.0       # set from the font's cap height in main()


class FlattenPen(BasePen):
    """Collects each contour as a polyline (curves sampled finely)."""

    def __init__(self, glyphset):
        super().__init__(glyphset)
        self.contours = []
        self.current = []

    def _moveTo(self, p):
        self.current = [p]

    def _lineTo(self, p):
        self.current.append(p)

    def _curveToOne(self, p1, p2, p3):
        p0 = self.current[-1]
        for i in range(1, 13):
            t = i / 12
            mt = 1 - t
            self.current.append((
                mt**3 * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t**3 * p3[0],
                mt**3 * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t**3 * p3[1],
            ))

    def _qCurveToOne(self, p1, p2):
        p0 = self.current[-1]
        for i in range(1, 9):
            t = i / 8
            mt = 1 - t
            self.current.append((
                mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
                mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1],
            ))

    def _closePath(self):
        if len(self.current) > 2:
            self.contours.append(self.current)
        self.current = []

    _endPath = _closePath


def resample(points, step):
    """Uniformly spaced points along a closed polyline."""
    pts = points + [points[0]]
    out = [pts[0]]
    carry = 0.0
    for a, b in zip(pts, pts[1:]):
        seg = math.dist(a, b)
        if seg == 0:
            continue
        d = step - carry
        while d <= seg:
            t = d / seg
            out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
            d += step
        carry = seg - (d - step)
    return out[:-1] if math.dist(out[0], out[-1]) < step / 2 else out


def smooth(points, half):
    n = len(points)
    out = []
    for i in range(n):
        sx = sy = 0.0
        for k in range(-half, half + 1):
            x, y = points[(i + k) % n]
            sx += x
            sy += y
        out.append((sx / (2 * half + 1), sy / (2 * half + 1)))
    return out


def normals(points):
    n = len(points)
    out = []
    for i in range(n):
        ax, ay = points[(i - 1) % n]
        bx, by = points[(i + 1) % n]
        dx, dy = bx - ax, by - ay
        length = math.hypot(dx, dy) or 1
        out.append((dy / length, -dx / length))
    return out


def wave(rnd, count, length):
    """A closed-loop noise: a few sinusoids whose periods divide the loop, so
    the displacement wraps without a kink."""
    terms = []
    for _ in range(3):
        k = rnd.randint(2, max(3, int(length / 260)))
        terms.append((k, rnd.uniform(0, math.tau), rnd.uniform(0.4, 1.0)))
    total = sum(a for _, _, a in terms)
    return [
        sum(a * math.sin(k * math.tau * i / count + ph) for k, ph, a in terms) / total
        for i in range(count)
    ]


def polygon_area(points):
    return 0.5 * sum(
        points[i][0] * points[(i + 1) % len(points)][1] - points[(i + 1) % len(points)][0] * points[i][1]
        for i in range(len(points))
    )


def inside(point, polygon):
    x, y = point
    hit = False
    for i in range(len(polygon)):
        x1, y1 = polygon[i]
        x2, y2 = polygon[(i + 1) % len(polygon)]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            hit = not hit
    return hit


def edge_distance(point, polygons):
    return min(math.dist(point, p) for poly in polygons for p in poly)


def stroke_points(base, start, overshoot, miss, rnd_boil):
    """Opens the loop at `start`, walks all the way round and past it, and
    drifts outward over the overshoot so the end misses the beginning."""
    n = len(base)
    norm = normals(base)
    boil = wave(rnd_boil, n, n * STEP)
    extra = int(n * overshoot)
    pts = []
    for j in range(n + extra):
        i = (start + j) % n
        drift = 0.0
        if j > n - extra:
            drift = miss * (j - (n - extra)) / (2 * extra)
        if j < extra:
            drift -= miss * 0.5 * (1 - j / extra)
        d = BOIL * boil[i] + drift
        pts.append((base[i][0] + norm[i][0] * d, base[i][1] + norm[i][1] * d))
    return pts


def to_path(points, every=5):
    """Catmull-Rom through every `every`-th point, as cubic Béziers."""
    pts = points[::every]
    if pts[-1] != points[-1]:
        pts.append(points[-1])
    f = lambda v: f"{v * OUT_SCALE:.1f}".rstrip("0").rstrip(".")
    d = [f"M{f(pts[0][0])} {f(pts[0][1])}"]
    for i in range(len(pts) - 1):
        p0 = pts[max(0, i - 1)]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[min(len(pts) - 1, i + 2)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d.append(f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}")
    return "".join(d)


def polyline_length(points):
    return sum(math.dist(a, b) for a, b in zip(points, points[1:]))


def build_word(font, word, rnd, dot_counter):
    glyphset = font.getGlyphSet()
    cmap = font.getBestCmap()
    ascender = 720  # cap height region we care about
    x = 0.0
    letters = []
    all_y = []
    for index, char in enumerate(word):
        name = cmap[ord(char)]
        pen = FlattenPen(glyphset)
        glyphset[name].draw(pen)
        advance = glyphset[name].width * CAP_SCALE * X_SCALE

        angle = math.radians(rnd.uniform(-5, 5))
        scale = rnd.uniform(0.94, 1.07)
        lift = rnd.uniform(-28, 28)
        cx, cy = advance / 2, ascender / 2

        def place(p):
            px = (p[0] * CAP_SCALE * X_SCALE - cx) * scale
            py = (p[1] * CAP_SCALE - cy) * scale
            rx = px * math.cos(angle) - py * math.sin(angle)
            ry = px * math.sin(angle) + py * math.cos(angle)
            # y flipped: SVG grows downward
            return (x + cx + rx, ascender - (cy + ry) + lift)

        contours = []
        for contour in pen.contours:
            pts = [place(p) for p in contour]
            pts = resample(pts, STEP)
            # Specks (some faces carry tiny decorative contours) can't be
            # traced as a loop; leave them out.
            if len(pts) < 4 * SMOOTH:
                continue
            pts = smooth(smooth(pts, SMOOTH), SMOOTH)
            norm = normals(pts)
            w = wave(rnd, len(pts), len(pts) * STEP)
            pts = [(p[0] + n[0] * WOBBLE * v, p[1] + n[1] * WOBBLE * v) for p, n, v in zip(pts, norm, w)]
            contours.append(pts)

        # Outer contour first (largest area), then counters.
        contours.sort(key=lambda c: -abs(polygon_area(c)))

        strokes = []
        for c in contours:
            start = rnd.randrange(len(c))
            overshoot = rnd.uniform(0.04, 0.09)
            miss = rnd.uniform(-14, 14)
            variants = []
            for v in range(VARIANTS):
                pts = stroke_points(c, start, overshoot, miss, random.Random(rnd.random() + v))
                variants.append(pts)
            strokes.append({
                "d": [to_path(p) for p in variants],
                "length": round(polyline_length(variants[0]) * OUT_SCALE, 1),
            })

        # Connect-the-dots: a couple of points inside the letter's ink area,
        # well clear of the outline.
        dots = []
        outer, holes = contours[0], contours[1:]
        up = char.upper()
        if up in "AEC" or (up == "M" and index == 0) or (up == "N" and index == len(word) - 1):
            xs = [p[0] for p in outer]
            ys = [p[1] for p in outer]
            tries = 0
            while len(dots) < (3 if up in "ME" else 2) and tries < 4000:
                tries += 1
                cand = (rnd.uniform(min(xs), max(xs)), rnd.uniform(min(ys), max(ys)))
                if not inside(cand, outer) or any(inside(cand, h) for h in holes):
                    continue
                if edge_distance(cand, contours) < 34:
                    continue
                if any(math.dist(cand, (d["x"] / OUT_SCALE, d["y"] / OUT_SCALE)) < 70 for d in dots):
                    continue
                dots.append({
                    "x": round(cand[0] * OUT_SCALE, 1),
                    "y": round(cand[1] * OUT_SCALE, 1),
                })
            # Numbered left to right, continuing from the previous letter.
            for dot in sorted(dots, key=lambda d: d["x"]):
                dot_counter[0] += 1
                dot["n"] = dot_counter[0]

        for c in contours:
            all_y.extend(p[1] for p in c)
        letters.append({"char": char, "strokes": strokes, "dots": dots})
        x += advance + TRACKING

    return letters, x - TRACKING, (min(all_y), max(all_y))


def word_entry(word, letters, width, top, bottom):
    pad = 30
    return {
        "word": word,
        "viewBox": [round(-pad * OUT_SCALE, 1), round((top - pad) * OUT_SCALE, 1),
                    round((width + 2 * pad) * OUT_SCALE, 1), round((bottom - top + 2 * pad) * OUT_SCALE, 1)],
        "letters": letters,
    }


def build_exact_word(font, word, rnd):
    """The font's own outlines, placed on a baseline. Returns letters with a
    fill path and one closed path per contour, the word's bounds, and the
    flattened contours (for placing stars)."""
    glyphset = font.getGlyphSet()
    cmap = font.getBestCmap()
    k = CAP_SCALE * OUT_SCALE
    baseline = 72.0
    x = 0.0
    letters, polys = [], []
    bounds = [math.inf, math.inf, -math.inf, -math.inf]
    for char in word:
        glyph = glyphset[cmap[ord(char)]]
        transform = (k * X_SCALE, 0, 0, -k, x, baseline)

        svg = SVGPathPen(glyphset, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
        glyph.draw(TransformPen(svg, transform))
        d = svg.getCommands()
        strokes = ["M" + part for part in d.split("M") if part.strip()]

        flat = FlattenPen(glyphset)
        glyph.draw(TransformPen(flat, transform))
        polys.extend(flat.contours)

        bp = BoundsPen(glyphset)
        glyph.draw(TransformPen(bp, transform))
        if bp.bounds:
            bounds = [min(bounds[0], bp.bounds[0]), min(bounds[1], bp.bounds[1]),
                      max(bounds[2], bp.bounds[2]), max(bounds[3], bp.bounds[3])]

        letters.append({"char": char, "fill": d, "strokes": strokes})
        x += glyph.width * k * X_SCALE + TRACKING * OUT_SCALE
    return letters, bounds, polys


def stars_around(polys, bounds, count, rnd, counter):
    """Points just outside the letters: clear of the ink, but close enough
    to belong to the word."""
    def inside_any(p):
        crossings = sum(inside(p, poly) for poly in polys)
        return crossings % 2 == 1

    def distance(p):
        return min(math.dist(p, q) for poly in polys for q in poly[::3])

    x0, y0, x1, y1 = bounds
    stars, tries = [], 0
    while len(stars) < count and tries < 6000:
        tries += 1
        p = (rnd.uniform(x0 - 4, x1 + 4), rnd.uniform(y0 - 6, y1 + 6))
        if inside_any(p):
            continue
        d = distance(p)
        if not 3.2 < d < 11:
            continue
        if any(math.dist(p, (s["x"], s["y"])) < 22 for s in stars):
            continue
        stars.append({"x": round(p[0], 1), "y": round(p[1], 1)})
    for star in sorted(stars, key=lambda s: s["x"]):
        counter[0] += 1
        star["n"] = counter[0]
    return stars


def main():
    global X_SCALE, SEED, CAP_SCALE, TRACKING, WORDS
    flags = [a for a in sys.argv[1:] if a.startswith("--")]
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    option = lambda name: next((f.split("=", 1)[1] for f in flags if f.startswith(f"--{name}=")), None)
    if option("words"):
        WORDS = option("words").split(",")
    export = option("export") or "WORDS"
    font = TTFont(args[0])
    if len(args) > 1:
        X_SCALE = float(args[1])
    if len(args) > 2:
        TRACKING = float(args[2])
    if len(args) > 3:
        SEED = int(args[3])
    # Every font is brought to the same cap height (720 units), so the
    # wobble and step sizes mean the same thing whatever the face.
    cap = getattr(font["OS/2"], "sCapHeight", 0) or font["head"].unitsPerEm * 0.7
    CAP_SCALE = 720 / cap
    rnd = random.Random(SEED)

    if "--exact" in flags:
        counter = [0]
        out = []
        for word in WORDS:
            letters, b, polys = build_exact_word(font, word, rnd)
            stars = stars_around(polys, b, max(2, round(len(word) * 0.6)), rnd, counter)
            pad = 4
            out.append({
                "word": word,
                "viewBox": [round(b[0] - pad, 1), round(b[1] - pad, 1),
                            round(b[2] - b[0] + 2 * pad, 1), round(b[3] - b[1] + 2 * pad, 1)],
                "letters": letters,
                "stars": stars,
            })
        print(
            "/* Generated by scripts/lettering/generate.py --exact — do not edit by\n"
            "   hand. The font's own outlines: `fill` per letter, one closed path per\n"
            "   contour to draw, and stars placed around the letters. */\n\n"
            "import type { FilledWord } from './glyphs';\n\n"
            f"export const {export}: FilledWord[] = " + json.dumps(out, separators=(",", ":")) + ";\n",
            end="",
        )
        return

    dot_counter = [0]
    words = []
    for word in WORDS:
        letters, width, (top, bottom) = build_word(font, word, rnd, dot_counter)
        words.append(word_entry(word, letters, width, top, bottom))

    # The one deliberate slip, as in the reference: a pen stroke straight
    # through the A's counter, starting below the baseline.
    a = None if "--no-slash" in flags else words[0]["letters"][1]
    if a:
        vb = words[0]["viewBox"]
        xs = [float(v) for v in a["strokes"][1]["d"][0].replace("M", " ").replace("C", " ").split()[0::2]]
        ys = [float(v) for v in a["strokes"][1]["d"][0].replace("M", " ").replace("C", " ").split()[1::2]]
        cx, top = sum(xs) / len(xs), min(ys)
        bottom = vb[1] + vb[3] - 2
        slash = [(cx - 9, bottom), (cx - 4, bottom - 20), (cx + 1, top + 4), (cx + 3, top - 4)]
        a["strokes"].append({
            "d": [f"M{slash[0][0]:.1f} {slash[0][1]:.1f}C{slash[1][0]:.1f} {slash[1][1]:.1f} "
                  f"{slash[2][0] + v * 0.6:.1f} {slash[2][1]:.1f} {slash[3][0] + v * 0.4:.1f} {slash[3][1]:.1f}"
                  for v in range(VARIANTS)],
            "length": round(math.dist(slash[0], slash[3]), 1),
        })

    note = (
        "/* Generated by scripts/lettering/generate.py — do not edit by hand.\n"
        "   Each stroke has three boil variants (`d[0..2]`); `length` is in\n"
        "   viewBox units and paces the drawing. */\n\n"
    )
    if export == "WORDS":
        header = note + (
            "export interface Stroke { d: string[]; length: number }\n"
            "export interface Dot { x: number; y: number; n: number }\n"
            "export interface Letter { char: string; strokes: Stroke[]; dots: Dot[] }\n"
            "export interface Word { word: string; viewBox: [number, number, number, number]; letters: Letter[] }\n"
            "export interface FilledLetter { char: string; fill: string; strokes: string[] }\n"
            "export interface FilledWord { word: string; viewBox: [number, number, number, number]; letters: FilledLetter[]; stars: Dot[] }\n\n"
        )
    else:
        header = note + "import type { Word } from './glyphs';\n\n"
    body = f"export const {export}: Word[] = " + json.dumps(words, separators=(",", ":")) + ";\n"
    print(header + body, end="")


if __name__ == "__main__":
    main()
