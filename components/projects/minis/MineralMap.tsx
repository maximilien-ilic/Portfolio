import Sketch from './Sketch';
import styles from './minis.module.css';

/* EDS mineral mapping: a scan sweeps across a grid of grey element-count
   pixels and leaves each one coloured by the mineral it matched. Colours
   follow the minerals themselves (blue glaucophane, green omphacite, red
   garnet…). */

const MINERALS = [
  { name: 'Gln', color: '#3b5bdb' },
  { name: 'Omp', color: '#2f9e44' },
  { name: 'Ep', color: '#a9e34b' },
  { name: 'Grt', color: '#e03131' },
  { name: 'Qz', color: '#f1f3f5' },
  { name: 'Ms', color: '#adb5bd' },
  { name: 'Rt', color: '#e8590c' },
  { name: 'Spn', color: '#ffd43b' },
  { name: 'Hem', color: '#862e2e' }
];

const COLS = 18;
const ROWS = 10;
const CELL = 12;
const GAP = 1;
const X0 = 22;
const Y0 = 36;

/* Smooth, deterministic "geology": a few overlapping waves, so neighbouring
   pixels tend to share a mineral and the map has veins and patches. */
function field(c: number, r: number) {
  return (
    Math.sin(c * 0.55 + r * 0.25) +
    Math.sin(r * 0.7 - c * 0.2 + 1.3) * 0.8 +
    Math.sin((c + r) * 0.33 + 2.1) * 0.6
  );
}

export default function MineralMap() {
  const cells = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const v = field(c, r); // about -2.4 … 2.4
      const mineral = MINERALS[Math.min(8, Math.max(0, Math.floor(((v + 2.4) / 4.8) * 9)))];
      const grey = 40 + Math.round(((Math.sin(c * 1.7 + r * 2.3) + 1) / 2) * 70);
      cells.push({ c, r, mineral, grey });
    }
  }

  return (
    <Sketch label="A grid of element counts being classified into a colour-coded mineral map">
      <text x={X0} y={Y0 - 10} className={styles.label}>
        Si Ti Al Fe Mn Mg Ca Na K O P → phase
      </text>

      {cells.map(({ c, r, mineral, grey }) => {
        const x = X0 + c * (CELL + GAP);
        const y = Y0 + r * (CELL + GAP);
        return (
          <g key={`${c}-${r}`}>
            <rect x={x} y={y} width={CELL} height={CELL} fill={`rgb(${grey} ${grey} ${grey + 4})`} />
            <rect
              x={x}
              y={y}
              width={CELL}
              height={CELL}
              fill={mineral.color}
              className={styles.classified}
              style={{ ['--c' as string]: c }}
            />
          </g>
        );
      })}

      {/* The scan line */}
      <rect x={X0 - 2} y={Y0 - 3} width="2.5" height={ROWS * (CELL + GAP) + 5} className={styles.scan} />

      {/* Legend */}
      {MINERALS.map((m, i) => (
        <g key={m.name} transform={`translate(262 ${Y0 + i * 14})`}>
          <rect width="10" height="10" rx="2" fill={m.color} />
          <text x="15" y="8.5" className={styles.label}>
            {m.name}
          </text>
        </g>
      ))}
    </Sketch>
  );
}
