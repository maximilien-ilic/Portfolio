import PixelSprite from './PixelSprite';
import { foamNet, type Run } from '@/lib/pixel';
import { BOAT, BOAT_PALETTE } from '@/lib/sprites';
import styles from './Ocean.module.css';

/* The Great Sea, drawn on the same grid as everything else.

   Three flat bands, each with its own foam net drifting at its own speed.
   The nets are generated once from a fixed seed — same sea on the server and
   in the browser, and no stair-step ever lands on a curve. */

/** Cells across one foam tile. Every band uses the same width so the three
    drift animations can all travel exactly one tile. */
const TILE = 240;

/** Enough tiles to cover a very wide viewport twice over. */
const TILES = 5;

const BANDS = [
  { key: 'shoal', height: 30, seed: 1701, lines: 3, weight: 1, connectors: 2 },
  { key: 'open', height: 26, seed: 2842, lines: 3, weight: 2, connectors: 3 },
  { key: 'deep', height: 16, seed: 3913, lines: 2, weight: 1, connectors: 1 }
] as const;

function FoamTrack({
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
    <svg
      className={className}
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
        {/* One tile, drawn once and stamped out — five copies of a few
            hundred rects would be five hundred nodes for nothing. */}
        <g id={id}>
          {/* Keyed by position in the run list, not by cell: a connector may
              legitimately land on a cell a baseline already covers, and two
              rects sharing a coordinate key is a duplicate to React. */}
          {runs.map(([x, y, w], index) => (
            <rect key={index} x={x} y={y} width={w} height={1} />
          ))}
        </g>
      </defs>

      {Array.from({ length: TILES }, (_, index) => (
        <use key={index} href={`#${id}`} x={index * TILE} />
      ))}
    </svg>
  );
}

export default function Ocean() {
  return (
    <div className={styles.ocean} aria-hidden="true">
      {BANDS.map((band) => (
        <div key={band.key} className={`${styles.band} ${styles[band.key]}`}>
          <FoamTrack
            id={`foam-${band.key}`}
            height={band.height}
            className={`${styles.foam} ${styles[`drift-${band.key}`]}`}
            runs={foamNet(band.seed, {
              width: TILE,
              height: band.height,
              lines: band.lines,
              weight: band.weight,
              connectors: band.connectors
            })}
          />

          {band.key === 'shoal' && (
            <PixelSprite
              rows={BOAT}
              palette={BOAT_PALETTE}
              className={styles.boat}
            />
          )}
        </div>
      ))}
    </div>
  );
}
