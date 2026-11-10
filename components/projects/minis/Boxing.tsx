import SvgT from '@/components/i18n/SvgT';
import Sketch from './Sketch';
import styles from './minis.module.css';

/* Neuron Boxing: two boxers seen from above, trading jabs in the square
   8 × 8 ring, and the small network that drives one of them lighting up as
   it decides. */

const INPUTS = [58, 86, 114, 142];
const HIDDEN = [72, 100, 128];
const OUTPUTS = [86, 114];

export default function Boxing() {
  const edges: Array<[number, number, number, number]> = [];
  INPUTS.forEach((a) => HIDDEN.forEach((b) => edges.push([196, a, 244, b])));
  HIDDEN.forEach((a) => OUTPUTS.forEach((b) => edges.push([244, a, 292, b])));

  return (
    <Sketch label="Two boxers sparring in a ring, driven by a small neural network">
      {/* The ring: ropes and corner posts */}
      <g className={styles.ink}>
        <rect x="22" y="36" width="132" height="132" rx="3" />
        <rect x="30" y="44" width="116" height="116" rx="2" className={styles.thin} />
        {[
          [22, 36],
          [154, 36],
          [22, 168],
          [154, 168]
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3" className={styles.dotFill} />
        ))}
      </g>

      {/* Seen from above: shoulders, head, two gloves. A (yellow gloves)
          sways and jabs; B (red gloves) leans away, then counters. */}
      <g className={styles.boxerA}>
        <g className={styles.ink}>
          <ellipse cx="62" cy="102" rx="9" ry="19" className={styles.body} />
          <circle cx="64" cy="102" r="7.5" className={styles.body} />
        </g>
        <circle cx="80" cy="91" r="6" className={`${styles.glove} ${styles.gloveA} ${styles.jab}`} />
        <circle cx="78" cy="115" r="6" className={`${styles.glove} ${styles.gloveA}`} />
      </g>
      <g className={styles.boxerB}>
        <g className={styles.ink}>
          <ellipse cx="116" cy="102" rx="9" ry="19" className={styles.body} />
          <circle cx="114" cy="102" r="7.5" className={styles.body} />
        </g>
        <circle cx="99" cy="91" r="6" className={`${styles.glove} ${styles.gloveB}`} />
        <circle cx="101" cy="115" r="6" className={`${styles.glove} ${styles.gloveB} ${styles.counter}`} />
      </g>

      {/* The network deciding A's moves */}
      <g className={styles.net}>
        {edges.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={styles.edge}
            style={{ ['--e' as string]: (i * 7) % 11 }}
          />
        ))}
        {INPUTS.map((y) => (
          <circle key={`i${y}`} cx="196" cy={y} r="4.5" className={styles.neuron} />
        ))}
        {HIDDEN.map((y, i) => (
          <circle key={`h${y}`} cx="244" cy={y} r="4.5" className={`${styles.neuron} ${styles.fire}`} style={{ ['--e' as string]: i * 3 }} />
        ))}
        {OUTPUTS.map((y, i) => (
          <circle key={`o${y}`} cx="292" cy={y} r="4.5" className={`${styles.neuron} ${styles.fire}`} style={{ ['--e' as string]: 6 + i * 3 }} />
        ))}
      </g>
      <text x="292" y="150" textAnchor="end" className={styles.label}>
        <SvgT fr="jab · esquive" en="jab · move" />
      </text>
      <text x="196" y="40" className={styles.label}>
        <SvgT fr="NEAT · gén. 42" en="NEAT · gen 42" />
      </text>
    </Sketch>
  );
}
