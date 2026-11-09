import Sketch from './Sketch';
import styles from './minis.module.css';

/* PSG WordPress theme: the child theme's stylesheet is written line by
   line on the left while, on the right, the grey parent-theme page takes on
   Paris Saint-Germain's navy and red, section by section. 7 s loop. */

const CODE = [
  '/* Theme Name: PSG */',
  'Template: miyazaki',
  '--blue: #004170;',
  '--red: #da291c;',
  '.site-header {',
  '  background: var(--blue);',
  '}'
];

const NAVY = '#004170';
const RED = '#da291c';

export default function ChildTheme() {
  return (
    <Sketch id="sketch-theme" label="A child theme's stylesheet repainting a grey page in PSG colours">
      {/* style.css */}
      <text x="18" y="26" className={styles.label}>
        style.css
      </text>
      {CODE.map((line, i) => (
        <text
          key={line}
          x="18"
          y={44 + i * 14}
          className={`${styles.code} ${styles.codeLine}`}
          style={{ ['--p' as string]: i }}
        >
          {line}
        </text>
      ))}

      {/* The page */}
      <g transform="translate(150 18)">
        <rect width="154" height="166" rx="6" className={styles.page} />
        <g className={styles.ink}>
          <rect width="154" height="166" rx="6" />
          <path d="M0 14 H154" className={styles.thin} />
        </g>
        {[8, 16, 24].map((x) => (
          <circle key={x} cx={x} cy="7" r="2.2" className={styles.dotFill} />
        ))}

        {/* Parent theme: grey wireframe */}
        <rect x="8" y="20" width="138" height="16" rx="2" className={styles.wire} />
        <rect x="8" y="42" width="138" height="50" rx="3" className={styles.wire} />
        {[8, 55, 102].map((x) => (
          <rect key={x} x={x} y="100" width="44" height="40" rx="3" className={styles.wire} />
        ))}
        <rect x="8" y="148" width="138" height="10" rx="2" className={styles.wire} />

        {/* Child theme: paint, layer by layer */}
        <g className={styles.paint} style={{ ['--p' as string]: 0 }}>
          <rect x="8" y="20" width="138" height="16" rx="2" fill={NAVY} />
          <rect x="8" y="36" width="138" height="3" fill={RED} />
        </g>
        <g className={styles.paint} style={{ ['--p' as string]: 1 }}>
          <rect x="8" y="42" width="138" height="50" rx="3" fill={NAVY} />
          <circle cx="40" cy="67" r="15" fill="none" stroke="#fff" strokeWidth="2" />
          <circle cx="40" cy="67" r="9" fill={RED} />
          <rect x="66" y="58" width="66" height="7" rx="2" fill="#fff" />
          <rect x="66" y="70" width="44" height="5" rx="2" fill="#fff" fillOpacity="0.6" />
        </g>
        {[8, 55, 102].map((x, i) => (
          <g key={x} className={styles.paint} style={{ ['--p' as string]: 2 + i * 0.4 }}>
            <rect x={x} y="100" width="44" height="40" rx="3" fill="#fff" stroke={NAVY} strokeWidth="1.5" />
            <rect x={x} y="100" width="44" height="18" rx="3" fill={i === 1 ? RED : NAVY} />
          </g>
        ))}
        <g className={styles.paint} style={{ ['--p' as string]: 3.4 }}>
          <rect x="8" y="148" width="138" height="10" rx="2" fill={NAVY} />
        </g>
      </g>

      <g transform="translate(18 166)" className={styles.themeDone}>
        <rect width="104" height="18" rx="9" />
        <text x="52" y="12.5" textAnchor="middle">
          child theme active ✓
        </text>
      </g>
    </Sketch>
  );
}
