import Sketch from './Sketch';
import styles from './minis.module.css';

/* Mini Diving Log: a dive profile being drawn, the diver following it with
   bubbles trailing, and the fast ascent flagged in red — what the app does
   with every dive it imports. Depth scale: 30 m over 130 units. */

const PROFILE = 'M40 38 L78 150 L120 156 L160 150 L192 155 L214 115 L224 60 L256 60 L270 38';
const FAST = 'M214 115 L224 60';

const SURFACE = Array(17).fill('q8 -4 16 0').join(' ');

export default function DiveLog() {
  return (
    <Sketch label="A dive profile being drawn, with a fast ascent flagged">
      {/* Surface and depth scale */}
      <g className={styles.ink}>
        <path d={`M34 38 ${SURFACE}`} className={styles.thin} />
        <path d="M34 38 V170" className={styles.thin} />
        {[38, 81, 124, 167].map((y) => (
          <path key={y} d={`M30 ${y} H34`} className={styles.thin} />
        ))}
      </g>
      {['0', '10', '20', '30 m'].map((t, i) => (
        <text key={t} x={28} y={40 + i * 43} className={styles.label} textAnchor="end">
          {t}
        </text>
      ))}

      {/* The profile, drawn over the first 62% of the loop */}
      <g className={`${styles.ink} ${styles.loop7}`}>
        <path d={PROFILE} pathLength={1} className={styles.diveLine} />
      </g>
      <path d={FAST} className={`${styles.warnLine} ${styles.loop7}`} />

      {/* The diver, on the same clock as the line */}
      <g className={styles.diver}>
        <circle r="4" className={styles.dot} />
        <circle r="1.6" cx="3" className={`${styles.bubble} ${styles.b1}`} />
        <circle r="1.2" cx="1" className={`${styles.bubble} ${styles.b2}`} />
        <circle r="1" cx="4" className={`${styles.bubble} ${styles.b3}`} />
      </g>

      {/* What the log works out */}
      <g className={styles.readouts}>
        <g transform="translate(238 92)" className={styles.warnTag}>
          <rect width="64" height="14" rx="3" />
          <text x="32" y="10" textAnchor="middle">
            ⚠ too fast
          </text>
        </g>
        <text x="300" y="16" textAnchor="end" className={styles.label}>
          max 27 m · nitrox 32%
        </text>
        <text x="300" y="28" textAnchor="end" className={styles.label}>
          Bühlmann ZH-L16C ✓
        </text>
      </g>
    </Sketch>
  );
}
