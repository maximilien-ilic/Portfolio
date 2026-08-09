# Visual identity — "The Great Sea"

Reference material: `refs/ui/` (Wind Waker: open ocean, island landfall, forest
interior) plus one arcade racing HUD. Two visual languages, kept strictly apart:

- **The world** (refs 1, 3, 4) → the page itself: flat colour steps, hard ink
  edges, white foam lines, no gradients, no blur.
- **The HUD** (ref 2) → project data only: dark plate, gold numerals, tiny
  wide-tracked mono labels.

Structure follows thavlik.dev: one text-forward page — nav, hero, a grid of
project cards, footer — with a detail page per project.

## The one structural idea

**The page crosses the horizon.** Nav and hero sit in the sky. The ocean runs
across the middle. Everything after it — projects, footer, project detail pages
— is underwater. That single move is why the page is mostly deep blue: the sky
is the short part of a crossing, not the setting.

It also decides the accents. Above the horizon the ink is dark and the sky
carries the colour. Below it, gold does the interactive work, because gold is
the only warm thing that survives at 7.5:1 on a card.

## Colour

Sampled from the reference frames, not invented.

| Token         | Hex       | Role                                                    |
|---------------|-----------|---------------------------------------------------------|
| `--sky-high`  | `#4FB0E4` | The nav band, the deepest part of the sky.               |
| `--sky`       | `#6CC4EC` | The hero. Ink reads at 9.29:1 on it.                     |
| `--sky-low`   | `#8FD8F2` | The sky at the horizon, and the pale strip at the top of the water. |
| `--shallow`   | `#56C4E8` | The water nearest the horizon.                           |
| `--sea`       | `#0F7CC8` | Cel shadows, borders, rules — **never text**. It reaches 2.77:1 on a card. |
| `--ground`    | `#04203F` | Everything below the horizon. The ocean's last band is this exact colour, so the water has no bottom edge. |
| `--plate`     | `#0B3564` | Card ground.                                             |
| `--trench`    | `#03152C` | Footer and HUD plates, the deepest step.                 |
| `--ink`       | `#04162C` | Every cel outline, and all text in the sky. 9.29:1 on `--sky`. |
| `--foam`      | `#EAF7FB` | Primary text underwater. 11.24:1 on a card.              |
| `--mist`      | `#9FC3DF` | Muted text underwater. 6.64:1 on a card.                 |
| `--haze`      | `#0D3A63` | Muted text in the sky. 5.96:1 on `--sky`.                |
| `--gold`      | `#F4C542` | The interactive accent underwater — hover, focus, the stack count, the email button. |
| `--sail`      | `#E4573C` | Appears **once**, in the sail of the boat. Never in chrome. |

Tag chips are toned by what kind of technology they are, so the same colour
always means the same category: `--t-lang` gold, `--t-data` cyan,
`--t-platform` grass, `--t-craft` sand.

The focus ring is two rings — a gold outline with an ink ring hugging the
element. Neither colour works on both grounds, but one of the two is always
visible.

## Type

| Role     | Face                 | Why                                                        |
|----------|----------------------|------------------------------------------------------------|
| Display  | Bricolage Grotesque  | Irregular, hand-cut contours — chunky like the game's own UI, and not the grotesk everyone reaches for. |
| Body     | Instrument Sans      | Quiet, slightly warm, holds a 60ch measure without going corporate. |
| Utility  | Martian Mono         | Tiny, uppercase, wide-tracked. Instrument readouts, taglines, tags, buttons. |

## Signature

A **pixel-art horizon**: flat bands split by hard ink edges, a white foam net
drifting at three speeds, a boat crossing with the wind, and a sky of clouds
crossing the same way. Every drawn thing shares one wind direction, left to
right — nothing on the page ever drifts against it.

### How the pixels work

`--px` is one art pixel in CSS pixels (4, or 5 above 1024px). It only ever
takes whole values, because a fractional cell is a blurred cell. Everything
drawn is sized off it: band heights, sprite dimensions, even the drift
distance. Two consequences worth knowing before editing:

- Sprites are authored as text in `lib/sprites.ts`, one character per cell,
  built from `[character, count]` segments so a row can never come out one
  cell short. Colour lives with the component, so a sprite can be re-lit
  without being redrawn.
- The sea is **generated**, not drawn, from a fixed seed (`foamNet` in
  `lib/pixel.ts`). A line holds a heading for several steps at a time — long
  flats, then long diagonals — which is what makes a net with slanted cell
  walls instead of a set of parallel stripes. Same seed on the server and in
  the browser, so it is the same sea in both.

One trap: the global `svg { max-width: 100% }` will squeeze the foam track,
which is deliberately several viewports wide, into one viewport and break the
pixel grid. `.foam` sets `max-width: none` for exactly that reason.

Everything else stays quiet. Cards are cel plates: 3px ink outline and a hard
offset shadow in `--sea`, zero blur — that offset *is* the shadow the boat
casts on the water in the reference frame.
