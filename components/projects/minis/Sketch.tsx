import type { ReactNode } from 'react';
import styles from './minis.module.css';

/* Frame shared by every miniature: a 320 × 200 stage (the cover's 16:10)
   and a displacement filter that makes straight SVG lines wobble a little,
   so the drawings read as hand-drawn like the lettering in the hero. The
   filter id is per miniature because several live on the same page. */
export default function Sketch({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <svg
      className={styles.stage}
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={label}
      style={{ ['--sketch' as string]: `url(#${id})` }}
    >
      <defs>
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="2.4" />
        </filter>
      </defs>
      {children}
    </svg>
  );
}
