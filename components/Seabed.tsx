import { terrain, type Run } from '@/lib/pixel';
import styles from './Seabed.module.css';

/* The floor each zone opens on.

   Two ridges on the same grid as everything else: a lit crest sitting back,
   and the zone's own floor in front of it. The front ridge is the zone
   colour, so it merges into the body of the zone and the descent has no
   seam — only the crest behind it reads as a separate ledge.

   Both are generated from fixed seeds, so it is the same floor on the
   server and in the browser. */

/** Cells across one tile. Both ridges use the same width so they can drift
    the same distance and stay in register. */
const TILE = 160;

/** Enough tiles to cross a very wide viewport. */
const TILES = 8;

const RIDGES = [
  { key: 'crest', height: 15, seed: 4271, relief: 7, hold: 9 },
  { key: 'floor', height: 10, seed: 5388, relief: 4, hold: 5 }
] as const;

export type SeabedTone = 'kelp' | 'abyss';

function Ridge({
  id,
  runs,
  height,
  className
}: {
  id: string;
  runs: Run[];
  height: number;
  className: string;
}) {
  return (
    /* The layer carries the camera, the svg inside carries the wind. They
       are split because both animate transform, and one element cannot run
       two transforms without the later one winning. */
    <div className={className}>
      <svg
        className={styles.ridge}
        viewBox={`0 0 ${TILE * TILES} ${height}`}
        shapeRendering="crispEdges"
        focusable="false"
        aria-hidden="true"
        style={{
          width: `calc(var(--px) * ${TILE * TILES})`,
          height: `calc(var(--px) * ${height})`
        }}
      >
        <defs>
          {/* One tile, stamped out — the same trick the foam track uses. */}
          <g id={id}>
            {runs.map(([x, y, w], index) => (
              <rect key={index} x={x} y={y} width={w} height={1} />
            ))}
          </g>
        </defs>

        {Array.from({ length: TILES }, (_, index) => (
          <use key={index} href={`#${id}`} x={index * TILE} />
        ))}
      </svg>
    </div>
  );
}

export default function Seabed({ tone }: { tone: SeabedTone }) {
  return (
    <div className={`${styles.seabed} ${styles[tone]}`} aria-hidden="true">
      {RIDGES.map((ridge) => (
        <Ridge
          key={ridge.key}
          id={`seabed-${tone}-${ridge.key}`}
          height={ridge.height}
          className={`${styles.layer} ${styles[ridge.key]}`}
          runs={terrain(ridge.seed, {
            width: TILE,
            height: ridge.height,
            relief: ridge.relief,
            hold: ridge.hold
          })}
        />
      ))}
    </div>
  );
}
