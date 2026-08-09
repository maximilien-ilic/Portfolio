import {
  CONTACT_EMAIL,
  CTA_LINE,
  GITHUB_HANDLE,
  GITHUB_URL,
  LINKEDIN_HANDLE,
  LINKEDIN_URL,
  LOCATION,
  NAME,
  ROLE
} from '@/data/site';
import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <div className={styles.pitch}>
          <p className={`readout ${styles.eyebrow}`}>Contact</p>
          <p className={styles.line}>{CTA_LINE}</p>

          <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </div>

        <dl className={styles.details}>
          <div className={styles.row}>
            <dt className={`readout ${styles.key}`}>Who</dt>
            <dd className={styles.value}>
              {NAME} — {ROLE}
            </dd>
          </div>

          <div className={styles.row}>
            <dt className={`readout ${styles.key}`}>Where</dt>
            <dd className={styles.value}>{LOCATION}</dd>
          </div>

          <div className={styles.row}>
            <dt className={`readout ${styles.key}`}>GitHub</dt>
            <dd className={styles.value}>
              <a
                className={styles.valueLink}
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {GITHUB_HANDLE}
              </a>
            </dd>
          </div>

          <div className={styles.row}>
            <dt className={`readout ${styles.key}`}>LinkedIn</dt>
            <dd className={styles.value}>
              <a
                className={styles.valueLink}
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {LINKEDIN_HANDLE}
              </a>
            </dd>
          </div>
        </dl>

        <a className={`readout ${styles.top}`} href="#top">
          <span aria-hidden="true">↑ </span>Back to top
        </a>
      </div>
    </footer>
  );
}
