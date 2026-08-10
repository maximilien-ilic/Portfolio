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

Below the horizon the descent passes through zones rather than holding one
navy for every screen. Each is a flat step with a hard ink edge — never a
fade. Cards keep `--plate` on every zone, the way a game's textbox stays put
while the route around it changes, so every measured card ratio above still
holds wherever a card lands.

| Token                | Hex       | Role                                                        |
|----------------------|-----------|-------------------------------------------------------------|
| `--zone-kelp`        | `#06382E` | First zone below open water. Foam 11.90:1, mist 7.03:1, gold 8.01:1. |
| `--zone-abyss`       | `#171A47` | The deep, last zone before the trench. Foam 15.05:1, mist 8.90:1, gold 10.13:1. |
| `--zone-kelp-crest`  | `#0D5A42` | The lit ledge behind the kelp floor. **Fill only**, like `--sea`. |
| `--zone-abyss-crest` | `#2A2D6B` | The lit ledge behind the abyss floor. **Fill only**. |

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

## The arrival

The screen starts black and fills in cell by cell, holds for a beat, then
empties the same way — the same cells, the same order, switching off instead
of on. One mechanism run twice, so the exit is the entrance played out rather
than a second effect bolted on.

It has **no skip control and cannot be dismissed**. That is the site owner's
call, made against advice, and it moves the entire safety margin onto length:
the whole thing runs in a little over a second, it plays once per visitor, and
reduced motion never sees a frame of it. The head script in `layout.tsx` marks
that run and every returning visit before first paint. The page's own
`Skip to projects` link is untouched and is not related to this.

It is not a loading bar and never claims to measure anything — the site is
prerendered and there is nothing to wait for.

**One matrix does both jobs.** A 4×4 Bayer threshold map (`loadGrid` in
`lib/pixel.ts`) is read two ways at once. Across a row it decides which of two
neighbouring tones a cell takes, which is how the gradient is built out of
flat colours and nothing else — five sky steps top to bottom, `--sky-low`,
`--sky-step-2`, `--sky`, `--sky-step-4`, `--sky-high`, with no fade anywhere.
Read as a sequence, the same sixteen positions decide which cells land first,
which is how an image used to appear over a slow connection. The ramp and the
loading are therefore the same structure seen twice, not two effects stacked
on each other.

Every change is a cut. A cell is `--ink`, or it is its tone, or it is gone;
the two keyframe stops sit a hundredth of the run apart so the change reads as
a step rather than a blend.

The grid is drawn at half the render resolution — 32×18 cells of two viewBox
units each — because a loading cell wants to be seen arriving. The viewBox is
**sliced, not stretched**, which is what keeps a cell square at any window
shape; a stretched cell is a dead pixel grid, and at full-viewport scale it is
the first thing that would give the whole thing away.

**It fills differently every launch.** Bayer decides *which tone* a cell
settles on and nothing else; the *order* cells arrive in is a fresh shuffle
each time, and the order they leave in is a second, unrelated one — so the
exit is never a replay of the entrance. Measured across two seeds, 575 of 576
cells take a different turn, and the correlation between a cell's arrival and
its departure is 0.02.

Timing is split rather than woven: every cell has landed by `FILL`, the
picture holds for `HOLD`, and every cell has gone by `CLEAR`. Each cell
therefore carries two independent `animation-delay` values, one per animation,
and no cell can leave before it has arrived.

The seed is drawn after mount, not at module scope, because this page is
prerendered once at build time: anything random decided during render would be
baked into the HTML and then disagree with what the client produced. For one
frame there is therefore no grid, and the container's flat `--ink` stands in —
exactly what the first frame would have shown anyway.

Discrete stages are the reason this borrowing works at all: a crack that grows
by stepping is the same grammar as an ocean that changes by stepping. Each
stage appears whole or not at all — never a fade.

The viewBox is **sliced, not stretched** (`preserveAspectRatio="xMidYMid
slice"`). That is what keeps a cell square at any window shape; a stretched
cell is a dead pixel grid, and at full-viewport scale it is the first thing
that would give the whole thing away.

The hero's cascade keys off the wall shattering, not off a fixed delay, so
dismissing it at 300ms starts the copy at 300ms. Nothing in the hero is hidden
by default — with no animation applied at all, every line computes to full
opacity, so a visitor whose JavaScript never runs reads a complete hero that
simply never moved.

## The descent

Second reference, kept as strictly apart as the first two: **Pokémon Black and
White on DS** — a route that changes biome as you walk it, and a camera that
pulls the layers apart as it travels.

It lands in three places and nowhere else.

**Zones.** Projects are dealt into zones a pair at a time (`page.tsx`), so
scrolling the work section reads as going deeper instead of as one long navy
field. Tones cycle, so a fifth project opens the next zone with nobody
touching a list. The zone grounds stay disciplined — four flat steps, ink
edges — because the colour belongs to what is *drawn*, not to what is behind
it. That is how the DS worked too: a limited background palette, colourful
sprites.

**The seabed.** Each zone opens on a floor (`Seabed.tsx`), generated the same
way the sea is: a seeded walk that holds a heading for several cells at a time,
so the silhouette comes out as ledges and slopes rather than as noise, and the
tail is steered back to its starting height so the tile repeats without a
seam (`terrain` in `lib/pixel.ts`). Two ridges — a lit crest sitting back, the
zone's own floor in front. The front ridge is the zone colour, so it merges
into the body of the zone and the descent has no seam; only the crest reads as
a separate ledge.

**The camera.** Depth is read as differential motion: crossing a zone lifts
the crest while the floor settles. It is scroll-driven CSS
(`animation-timeline: view()`), so it costs no JavaScript and stays on the
compositor. The floor paints over the crest, so the crest can never open a
gap — it only slides behind the ledge in front of it.

Each ridge is two nested elements, and that is not incidental: the wind and
the camera both animate `transform`, and one element cannot run two of them
without the later one winning. `.layer` carries the camera, `.ridge` inside it
carries the wind. Both keep the one wind direction the rest of the page
obeys — left to right, crest slower than floor because it is further away.

Browsers without `view()` timelines get the floor standing still, which is a
complete picture rather than a broken one. Reduced motion stops the wind and
never starts the camera.
