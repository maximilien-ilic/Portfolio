import Sketch from './Sketch';
import styles from './minis.module.css';

/* Deck Royale: a random 8-card deck being dealt — each card flips over to
   show its elixir cost, then the deck's average appears. */

const COSTS = [3, 4, 2, 5, 3, 6, 4, 2]; // average 3.6
const W = 44;
const H = 58;
const X = [52, 106, 160, 214];
const Y = [24, 94];

/* An elixir drop, centred on the origin. */
const DROP = 'M0 -9 C5 -3 7 1 7 4 A7 7 0 0 1 -7 4 C-7 1 -5 -3 0 -9 Z';

export default function DeckRoyale() {
  return (
    <Sketch label="Eight cards flipping over to reveal their elixir cost">
      {COSTS.map((cost, i) => {
        const x = X[i % 4];
        const y = Y[Math.floor(i / 4)];
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {/* Back */}
            <g className={`${styles.cardBack}`} style={{ ['--k' as string]: i }}>
              <rect width={W} height={H} rx="5" className={styles.cardFill} />
              <g className={styles.ink}>
                <rect width={W} height={H} rx="5" />
                <path d={`M8 ${H - 8} L${W - 8} 8 M8 ${H / 2} L${W / 2} 8 M${W / 2} ${H - 8} L${W - 8} ${H / 2}`} className={styles.thin} />
              </g>
            </g>
            {/* Face */}
            <g className={styles.cardFace} style={{ ['--k' as string]: i }}>
              <rect width={W} height={H} rx="5" className={styles.cardFill} />
              <g className={styles.ink}>
                <rect width={W} height={H} rx="5" />
                <circle cx={W / 2} cy={H / 2 - 4} r="11" className={styles.thin} />
              </g>
              <g transform="translate(11 13)">
                <path d={DROP} className={styles.elixir} />
                <text y="5" textAnchor="middle" className={styles.cost}>
                  {cost}
                </text>
              </g>
            </g>
          </g>
        );
      })}

      <g transform="translate(106 166)" className={styles.average}>
        <rect width="108" height="18" rx="9" />
        <text x="54" y="12.5" textAnchor="middle">
          avg elixir 3.6
        </text>
      </g>
    </Sketch>
  );
}
