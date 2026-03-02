'use client';

import ContactForm from './ContactForm';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.terminalLine}>
          <span className={styles.info}>Web Developer | Cybersecurity Student</span>
          <span className={styles.separator}>·</span>
          <span className={styles.linkLabel}>GitHub:</span>
          <a href="https://github.com/maximilien-ilic" className={styles.link} target="_blank" rel="noopener noreferrer">
            @maximilien-ilic
          </a>
          <span className={styles.separator}>·</span>
          <span className={styles.linkLabel}>email:</span>
          <a href="mailto:maximilien.ilic@gmail.com" className={styles.link}>
            maximilien.ilic@gmail.com
          </a>
          <span className={styles.separator}>·</span>
          <span className={styles.linkLabel}>LinkedIn:</span>
          <a href="https://linkedin.com/in/maximilien-ilic" className={styles.link} target="_blank" rel="noopener noreferrer">
            /in/maximilien-ilic
          </a>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.formTitle}>$ contact me</h3>
          <ContactForm />
        </div>

        <div className={styles.backTop}>
          <a href="#" className={styles.backLink}>· Back to top</a>
        </div>
      </div>
    </footer>
  );
}