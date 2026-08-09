import Link from 'next/link';
import Clouds from '@/components/Clouds';
import Ocean from '@/components/Ocean';
import SiteNav from '@/components/SiteNav';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <>
      <SiteNav />

      <main className={styles.page}>
        <Clouds />

        <div className={`shell ${styles.inner}`}>
          <p className={`readout ${styles.code}`}>Error 404</p>
          <h1 className={styles.title}>No chart for this one</h1>

          <p className={styles.message}>
            That page is not here. It may have been renamed, or the link that
            brought you was already out of date.
          </p>

          <Link className={`readout ${styles.link}`} href="/">
            <span aria-hidden="true">← </span>Back to the start
          </Link>
        </div>

        <Ocean />
      </main>
    </>
  );
}
