'use client';

import { useEffect, useRef } from 'react';
import { FRAGMENT, VERTEX } from './shader';
import styles from './ColorField.module.css';

/* Renders the shader at a fraction of the screen resolution and lets the
   browser scale it up: the field is meant to be soft, so the upscale blur is
   free anti-aliasing and the GPU does a tenth of the work.

   uMix follows the scroll position of `#about`: 0 while the hero fills the
   screen, 1 once the about section has scrolled in.

   `?t=12` freezes the clock at 12 s (and `?mix=1` pins uMix) — used to take
   reproducible screenshots. */

// Starting resolution on desktop: high enough for the fine reed lines of
// the about section to stay lines.
const RESOLUTION = 0.5;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

export default function ColorField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) {
      canvas.dataset.fallback = 'true';
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    gl.useProgram(program);

    // One triangle that covers the whole clip space.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'uTime');
    const uRes = gl.getUniformLocation(program, 'uRes');
    const uMix = gl.getUniformLocation(program, 'uMix');
    const uMouse = gl.getUniformLocation(program, 'uMouse');

    const params = new URLSearchParams(window.location.search);
    const frozenTime = params.get('t');
    const pinnedMix = params.get('mix');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Resolution adapts to the device: phones start lower, and if frames
       take too long the canvas steps down until they don't. The field is
       soft on purpose, so the upscale costs nothing visible. */
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let scale = coarse ? 0.42 : RESOLUTION;
    const MIN_SCALE = 0.28;

    /* Mobile browsers change innerHeight every time the address bar slides
       in or out. Re-sizing the canvas then would flash it mid-scroll, so
       the height only ever grows for a given width (the CSS box is sized
       to the large viewport, see the module). */
    let cssWidth = 0;
    let cssHeight = 0;
    const resize = (force = false) => {
      const w = window.innerWidth;
      const h = Math.max(window.innerHeight, w === cssWidth ? cssHeight : 0);
      if (!force && w === cssWidth && h === cssHeight) return false;
      cssWidth = w;
      cssHeight = h;
      const width = Math.max(1, Math.round(w * scale));
      const height = Math.max(1, Math.round(h * scale));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
      return true;
    };
    resize(true);

    // Mouse, eased so the field leans rather than jumps. Touch screens skip
    // it: a finger dragging the page shouldn't drag the colours too.
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = 0.5 - e.clientY / window.innerHeight;
    };

    // The mix only changes when the page scrolls, so it is measured then,
    // not read back from the layout on every frame.
    let mix = 0;
    let mixDirty = true;
    const measureMix = () => {
      if (pinnedMix !== null) return Number(pinnedMix);
      const about = document.getElementById('about');
      if (!about) return 0;
      const top = about.getBoundingClientRect().top;
      const raw = 1 - top / cssHeight;
      const clamped = Math.min(1, Math.max(0, raw));
      return clamped * clamped * (3 - 2 * clamped); // smoothstep
    };
    const onScroll = () => {
      mixDirty = true;
    };

    const start = performance.now();
    // Start part-way round the wheel so the first frame is already colourful.
    const offset = 20;
    let frame = 0;
    let visible = !document.hidden;

    const draw = (now: number) => {
      const time = frozenTime !== null ? Number(frozenTime) : offset + (now - start) / 1000;
      if (mixDirty) {
        mix = measureMix();
        mixDirty = false;
      }
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(uTime, time);
      gl.uniform1f(uMix, mix);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Frame-time watch: averaged over 40 frames, ignoring the first second
    // (fonts, hydration) and any frame after a pause (tab switch).
    let last = 0;
    let sum = 0;
    let count = 0;
    const loop = (now: number) => {
      if (visible) {
        draw(now);
        const dt = now - last;
        if (last && now - start > 1000 && dt < 250) {
          sum += dt;
          count += 1;
          if (count === 40) {
            if (sum / count > 21 && scale > MIN_SCALE) {
              scale = Math.max(MIN_SCALE, scale - 0.07);
              resize(true);
            }
            sum = 0;
            count = 0;
          }
        }
        last = now;
      } else {
        last = 0;
      }
      frame = requestAnimationFrame(loop);
    };

    // Frozen or reduced motion: draw once, and again only when the scroll
    // position changes the mix.
    const still = frozenTime !== null || reduce;
    const redraw = () => {
      mixDirty = true;
      draw(performance.now());
    };

    if (still) {
      redraw();
      window.addEventListener('scroll', redraw, { passive: true });
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
      if (!coarse) window.addEventListener('pointermove', onPointer, { passive: true });
      frame = requestAnimationFrame(loop);
    }

    const onResize = () => {
      mixDirty = true;
      if (resize() && still) redraw();
    };
    const onVisibility = () => {
      visible = !document.hidden;
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    canvas.dataset.ready = 'true';

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', redraw);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div className={styles.field} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.grain} />
    </div>
  );
}
