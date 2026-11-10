import SvgT from '@/components/i18n/SvgT';
import Sketch from './Sketch';
import styles from './minis.module.css';

/* Keyboard navigator for Blender: four key presses, no mouse. ² browses to
   a theme, Enter opens it, Enter runs the operator (the cube extrudes), Esc
   goes back. The status line shows what the add-on prints. 8 s loop. */

const MESSAGES = [
  'THEME [2/25]: Modeling',
  '>>> IN: Modeling [1/12]: Extrude',
  '✓ Extrude',
  '<<< BACK · THEME [2/25]: Modeling'
];

const MESSAGES_FR = [
  'THÈME [2/25] : Modélisation',
  '>>> DANS : Modélisation [1/12] : Extrusion',
  '✓ Extrusion',
  '<<< RETOUR · THÈME [2/25] : Modélisation'
];

const KEYS = [
  { label: '²', x: 96, w: 26, cls: styles.keyBrowse },
  { label: 'Enter', x: 128, w: 46, cls: styles.keyEnter },
  { label: 'Esc', x: 180, w: 34, cls: styles.keyEsc }
];

/* Isometric cube: top face, and the three visible edges below it. */
const CX = 160;
const TOP = 52;
const S = 30;
const H = 30;
const face = (y: number) => `M${CX} ${y} L${CX + S} ${y + S / 2} L${CX} ${y + S} L${CX - S} ${y + S / 2} Z`;
const top = face(TOP);
const RAISE = 22;
const sides = `M${CX - S} ${TOP + S / 2} V${TOP + S / 2 + H} L${CX} ${TOP + S + H} L${CX + S} ${TOP + S / 2 + H} V${TOP + S / 2} M${CX} ${TOP + S} V${TOP + S + H}`;

export default function BlenderNav() {
  return (
    <Sketch label="Blender driven from the keyboard: a cube is extruded without touching the mouse">
      {/* Viewport */}
      <g className={styles.ink}>
        <rect x="18" y="14" width="284" height="118" rx="6" className={styles.thin} />
        {/* floor grid */}
        {[-2, -1, 0, 1, 2].map((i) => (
          <path key={i} d={`M${CX + i * 34 - 70} 126 L${CX + i * 34 + 10} 96`} className={styles.faint} />
        ))}
      </g>

      {/* The extrusion: a second block rising out of the top face */}
      <g className={styles.extrude}>
        <g className={styles.ink}>
          <path d={face(TOP - RAISE)} />
          <path d={`M${CX - S} ${TOP + S / 2 - RAISE} V${TOP + S / 2} M${CX + S} ${TOP + S / 2 - RAISE} V${TOP + S / 2} M${CX} ${TOP + S - RAISE} V${TOP + S}`} />
        </g>
      </g>
      <g className={styles.ink}>
        <path d={top} className={styles.cubeTop} />
        <path d={sides} />
      </g>

      {/* No mouse */}
      <g transform="translate(266 24)" className={styles.ink}>
        <rect width="14" height="20" rx="7" className={styles.thin} />
        <path d="M7 3 V8" className={styles.thin} />
        <path d="M-3 22 L17 -2" className={styles.strike} />
      </g>

      {/* Status line */}
      {MESSAGES.map((m, i) => (
        <text key={m} x="24" y="150" className={`${styles.status} ${styles[`msg${i}`]}`}>
          <SvgT fr={MESSAGES_FR[i]} en={m} />
        </text>
      ))}

      {/* Keys */}
      {KEYS.map((k) => (
        <g key={k.label} transform={`translate(${k.x} 162)`} className={k.cls}>
          <rect width={k.w} height="22" rx="4" className={styles.key} />
          <text x={k.w / 2} y="14.5" textAnchor="middle" className={styles.keyLabel}>
            {k.label}
          </text>
        </g>
      ))}
    </Sketch>
  );
}
