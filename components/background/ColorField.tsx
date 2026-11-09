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

// High enough for the fine reed lines of the about section to stay lines.
const RESOLUTION = 0.55;

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

    const resize = () => {
      const width = Math.max(1, Math.round(window.innerWidth * RESOLUTION));
      const height = Math.max(1, Math.round(window.innerHeight * RESOLUTION));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
    };
    resize();

    // Mouse, eased so the field leans rather than jumps.
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = 0.5 - e.clientY / window.innerHeight;
    };

    const mixFromScroll = () => {
      if (pinnedMix !== null) return Number(pinnedMix);
      const about = document.getElementById('about');
      if (!about) return 0;
      const top = about.getBoundingClientRect().top;
      const raw = 1 - top / window.innerHeight;
      const clamped = Math.min(1, Math.max(0, raw));
      return clamped * clamped * (3 - 2 * clamped); // smoothstep
    };

    const start = performance.now();
    // Start part-way round the wheel so the first frame is already colourful.
    const offset = 20;
    let frame = 0;
    let visible = !document.hidden;

    const draw = (now: number) => {
      const time = frozenTime !== null ? Number(frozenTime) : offset + (now - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(uTime, time);
      gl.uniform1f(uMix, mixFromScroll());
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      if (visible) draw(now);
      frame = requestAnimationFrame(loop);
    };

    // Frozen or reduced motion: draw once, and again only when the scroll
    // position changes the mix.
    const still = frozenTime !== null || reduce;
    const redraw = () => draw(performance.now());

    if (still) {
      redraw();
      window.addEventListener('scroll', redraw, { passive: true });
    } else {
      window.addEventListener('pointermove', onPointer, { passive: true });
      frame = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      if (still) redraw();
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
