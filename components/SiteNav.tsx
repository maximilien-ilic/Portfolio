import Link from 'next/link';
import { CONTACT_EMAIL, GITHUB_URL, NAME } from '@/data/site';
import styles from './SiteNav.module.css';

export default function SiteNav() {
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <Link href="/" className={styles.wordmark}>
          {NAME}
        </Link>

        <nav className={styles.nav} aria-label="Main">
          <Link className={`readout ${styles.link}`} href="/#projects">
            Projects
          </Link>

          <a
            className={`readout ${styles.link}`}
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>

          <a className={`readout ${styles.link}`} href={`mailto:${CONTACT_EMAIL}`}>
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
