import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.terminal}>
        <p className={styles.error}>$ cd /page-that-exists</p>
        <p className={styles.output}>bash: cd: /page-that-exists: No such file or directory</p>
        <p className={styles.code}>404</p>
        <p className={styles.message}>This page doesn't exist.</p>
        <Link href="/" className={styles.link}>$ cd ~</Link>
      </div>
    </div>
  );
}