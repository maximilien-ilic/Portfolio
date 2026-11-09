"""Generates the site icon: the M of the hero's lettering (Estrella, by
Uncarving) in white on a blue-to-violet tile from the background's palette,
with a small star — "estrella".

Writes app/icon.svg (the favicon modern browsers use). app/apple-icon.png
(180 px) and app/favicon.ico (16/32/48 px) are renders of that same SVG,
made with a headless browser; re-render them if the SVG changes.

Run:  python3 scripts/icon/generate.py path/to/Estrella-Early.otf
"""

import sys

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

SIZE = 64
PAD = 6  # space around the letter inside the tile

font = TTFont(sys.argv[1])
glyphset = font.getGlyphSet()
glyph = glyphset[font.getBestCmap()[ord("M")]]

bounds = BoundsPen(glyphset)
glyph.draw(bounds)
x0, y0, x1, y1 = bounds.bounds

# Scale the letter to fit the tile, centred on its real ink (the M starts
# with a long swash to the left, so the advance width would off-centre it).
box = SIZE - 2 * PAD
k = min(box / (x1 - x0), box / (y1 - y0))
dx = (SIZE - (x1 - x0) * k) / 2 - x0 * k
dy = (SIZE - (y1 - y0) * k) / 2 + y1 * k  # y flipped

pen = SVGPathPen(glyphset, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
glyph.draw(TransformPen(pen, (k, 0, 0, -k, dx, dy)))
letter = pen.getCommands()


def star(cx, cy, r):
    c = r * 0.16
    return (f"M{cx} {cy - r}C{cx + c} {cy - c} {cx + c} {cy - c} {cx + r} {cy}"
            f"C{cx + c} {cy + c} {cx + c} {cy + c} {cx} {cy + r}"
            f"C{cx - c} {cy + c} {cx - c} {cy + c} {cx - r} {cy}"
            f"C{cx - c} {cy - c} {cx - c} {cy - c} {cx} {cy - r}Z")


svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}">
  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#144dff"/>
      <stop offset="1" stop-color="#8429f5"/>
    </linearGradient>
  </defs>
  <rect width="{SIZE}" height="{SIZE}" rx="14" fill="url(#tile)"/>
  <path d="{letter}" fill="#fff"/>
  <path d="{star(55, 9, 5)}" fill="#ffd43b"/>
</svg>
"""
open("app/icon.svg", "w").write(svg)
print("app/icon.svg")
