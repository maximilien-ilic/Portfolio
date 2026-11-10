/* The page's single background, as one fragment shader.

   Two moods driven by one uniform, uMix:

   0 — the hero: soft blobs of saturated colour with pools of near-black
       between them (domain-warped fbm). The palette walks slowly round
       red → orange → yellow → pale pink → blue → violet, so the colours on
       screen are always strong but never the same for long.
   1 — the about section: the same field, same colours, seen through fluted
       glass whose reeds run horizontally — smeared sideways and cut into
       fine lines.

   Scrolling moves uMix from 0 to 1. Only the geometry changes, never the
   colours, so the hero turns into the next section without passing through
   any in-between palette. */

export const VERTEX = /* glsl */ `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const FRAGMENT = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uRes;
uniform float uMix;
uniform vec2 uMouse;

// --- noise -----------------------------------------------------------------

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

// 2D simplex noise (Ashima Arts / Stefan Gustavson), range about -1..1.
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Three octaves at low frequency: the field is meant to look out of focus.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 3; i++) {
    v += a * snoise(p);
    p = p * 1.9 + vec2(1.7, 9.2);
    a *= 0.45;
  }
  return v * 0.55 + 0.5; // ~0..1
}

// --- palette ---------------------------------------------------------------

// The six strong colours, in the order the hero walks through them.
vec3 swatch(int i) {
  if (i == 0) return vec3(0.96, 0.10, 0.16); // red
  if (i == 1) return vec3(1.00, 0.42, 0.04); // orange
  if (i == 2) return vec3(1.00, 0.80, 0.06); // yellow
  if (i == 3) return vec3(1.00, 0.70, 0.82); // pale pink
  if (i == 4) return vec3(0.08, 0.30, 1.00); // blue
  return vec3(0.52, 0.16, 0.96);             // violet
}

// Continuous position on the colour wheel; smoothstep between neighbours so
// there is never a visible step from one colour to the next.
vec3 wheel(float t) {
  t = mod(t, 6.0);
  float i = floor(t);
  float f = smoothstep(0.0, 1.0, fract(t));
  int a = int(i);
  int b = int(mod(i + 1.0, 6.0));
  return mix(swatch(a), swatch(b), f);
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv - 0.5;
  p.x *= uRes.x / uRes.y;

  // The cursor leans on the field a little.
  p -= uMouse * 0.06;

  // Fluted glass, reeds running horizontally. Each reed refracts what is
  // behind it: the sample point moves by a noise of y (almost) alone, so the
  // shift holds along a line and jumps from one line to the next. 'fine'
  // varies a little along x so the lines fade and thicken like the
  // reference instead of being ruled.
  // Skipped entirely in the hero (uMix is uniform, so the branch is free).
  float fine = 0.0;
  float reed = 0.0;
  if (uMix > 0.0) {
    fine = snoise(vec2(p.y * 95.0, p.x * 0.7 + uTime * 0.02));
    reed = snoise(vec2(p.y * 26.0, 4.2 + p.x * 0.25));
  }

  // The smear comes first and the reeds after (uMix squared), so the
  // transition reads as motion blur turning into glass, not as a glitch.
  float glass = uMix * uMix;
  vec2 q = p;
  q.x *= mix(1.0, 0.75, uMix);
  q += vec2(fine * 0.012 + reed * 0.03, fine * 0.006 + reed * 0.02) * glass;

  float t = uTime * 0.03;
  // A slow sideways drift, the same in both moods. It must not depend on
  // uMix: time × uMix grows with every second spent on the page, so the
  // field would jump that far while scrolling through the transition.
  vec2 drift = vec2(uTime * 0.012, 0.0);

  // Large, slow, gently warped blobs.
  vec2 w = vec2(fbm(q * 0.55 + vec2(t, -t * 0.7)),
                fbm(q * 0.55 + vec2(5.2, 1.3) - t));
  float n = fbm(q * 0.8 + 1.1 * w + vec2(t * 0.6, 0.0) + drift);
  float n2 = fbm(q * 1.0 - 0.9 * w + vec2(3.1, -t) + drift * 1.3);

  // One trip round the six colours takes 6 × 15 s. The field shows the
  // current colour and its neighbour, so the screen reads as one mood at a
  // time and drifts to the next.
  float hue = uTime / 15.0;
  vec3 c1 = wheel(hue + (n - 0.5) * 0.9);
  vec3 c2 = wheel(hue + 1.0 + (n2 - 0.5) * 0.9);
  vec3 col = mix(c1, c2, smoothstep(0.35, 0.75, n2));

  // Pools of deep shadow between the colours. The shadow keeps the red
  // and blue of the colour and drops most of its green, so yellow goes to
  // maroon and blue to navy — never to olive or grey.
  float pool = smoothstep(0.4, 0.72, fbm(q * 0.6 - w * 0.8 + vec2(7.0, t * 0.8)));
  vec3 shadow = col * vec3(0.11, 0.03, 0.07) + vec3(0.01, 0.006, 0.016);
  col = mix(col, shadow, pool);

  // The reeds catch the light: thin bright and dark lines on top.
  col *= 1.0 + (fine * 0.16 + reed * 0.06) * glass;

  // A touch of dither so the slow gradients never band.
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 160.0;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
