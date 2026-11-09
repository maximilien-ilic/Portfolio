import type { ReactNode } from 'react';
import styles from './minis.module.css';

/* Frame shared by every miniature: a 320 × 200 stage (the cover's 16:10),
   scaled to fit the cover whatever its proportions. */
export default function Sketch({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg className={styles.stage} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" role="img" aria-label={label}>
      {children}
    </svg>
  );
}
