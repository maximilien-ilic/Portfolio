"""Outline the language names in the hero's Estrella Early font.

Usage: python3 scripts/lettering/languages.py /path/to/Estrella-Early.otf
Requires fontTools, as does generate.py. Run from the repository root.
"""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

font = TTFont(sys.argv[1])
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
output = Path('public/lettering')
output.mkdir(exist_ok=True)
for language, word in [('fr', 'Français'), ('en', 'English')]:
    x, paths, bounds = 0, [], []
    for char in word:
        glyph = glyphs[cmap[ord(char)]]
        transform = (1, 0, 0, -1, x, 0)
        pen = SVGPathPen(glyphs)
        glyph.draw(TransformPen(pen, transform))
        paths.append(pen.getCommands())
        box = BoundsPen(glyphs)
        glyph.draw(TransformPen(box, transform))
        bounds.append(box.bounds)
        x += glyph.width + 10
    left = min(b[0] for b in bounds) - 40
    top = min(b[1] for b in bounds) - 40
    right = max(b[2] for b in bounds) + 40
    bottom = max(b[3] for b in bounds) + 40
    (output / f'{language}.svg').write_text(
        '<!-- Estrella Early by Uncarving; outlines from the same font as the hero. -->\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{left} {top} {right-left} {bottom-top}">'
        '<path fill="#f5f3ee" d="' + ''.join(paths) + '"/></svg>\n'
    )
