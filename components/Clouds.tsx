import PixelSprite from './PixelSprite';
import {
  CLOUD_BIG,
  CLOUD_MID,
  CLOUD_PALETTE,
  CLOUD_SMALL
} from '@/lib/sprites';
import styles from './Clouds.module.css';

/* One wind, blowing left to right. The clouds share it with the boat below,
   which is why nothing on the page ever drifts the other way.

   Depth is speed: the low bank crosses in four minutes, the small high ones
   in half that. Negative delays scatter them so the sky is already occupied
   on the first frame rather than filling up over the next minute. */
const SKY = [
  { rows: CLOUD_BIG, top: '14%', duration: 240, delay: -30, opacity: 1 },
  { rows: CLOUD_MID, top: '4%', duration: 160, delay: -120, opacity: 0.9 },
  { rows: CLOUD_SMALL, top: '38%', duration: 120, delay: -70, opacity: 0.75 },
  { rows: CLOUD_MID, top: '58%', duration: 200, delay: -175, opacity: 0.6 },
  { rows: CLOUD_SMALL, top: '26%', duration: 145, delay: -20, opacity: 0.85 }
];

export default function Clouds() {
  return (
    <div className={styles.sky} aria-hidden="true">
      {SKY.map((cloud, index) => (
        <PixelSprite
          key={index}
          rows={cloud.rows}
          palette={CLOUD_PALETTE}
          className={styles.cloud}
          style={{
            top: cloud.top,
            opacity: cloud.opacity,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`
          }}
        />
      ))}
    </div>
  );
}
