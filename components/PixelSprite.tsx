import type { CSSProperties } from 'react';
import { spriteRuns } from '@/lib/pixel';

interface PixelSpriteProps {
  rows: string[];
  palette: Record<string, string>;
  className?: string;
  style?: CSSProperties;
}

/** Draws a text sprite at a whole number of CSS pixels per cell.

    The size comes from --px rather than from a viewport unit, because a
    fractional cell is a blurred cell — pixel art only survives integer
    scaling. Runs of one colour share a single <g fill>, so a cloud is a
    handful of rects rather than several hundred. */
export default function PixelSprite({
  rows,
  palette,
  className,
  style
}: PixelSpriteProps) {
  const runs = spriteRuns(rows);
  const width = rows[0].length;
  const height = rows.length;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      focusable="false"
      aria-hidden="true"
      style={{
        width: `calc(var(--px) * ${width})`,
        height: `calc(var(--px) * ${height})`,
        ...style
      }}
    >
      {Object.entries(runs).map(([char, cells]) => (
        <g key={char} fill={palette[char]}>
          {cells.map(([x, y, w]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} />
          ))}
        </g>
      ))}
    </svg>
  );
}
