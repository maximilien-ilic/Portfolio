import ContactForm from './ContactForm';
import {
  CONTACT_EMAIL,
  GITHUB_HANDLE,
  GITHUB_URL,
  LINKEDIN_HANDLE,
  LINKEDIN_URL,
} from '@/data/site';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.terminalLine}>
          <span className={styles.info}>Web Developer | Cybersecurity Student</span>
          <span className={styles.separator}>·</span>
          <span className={styles.linkLabel}>GitHub:</span>
          <a href={GITHUB_URL} className={styles.link} target="_blank" rel="noopener noreferrer">
            {GITHUB_HANDLE}
          </a>
          <span className={styles.separator}>·</span>
          <span className={styles.linkLabel}>email:</span>
          <a href={`mailto:${CONTACT_EMAIL}`} className={styles.link}>
            {CONTACT_EMAIL}
          </a>
          <span className={styles.separator}>·</span>
          <span className={styles.linkLabel}>LinkedIn:</span>
          <a href={LINKEDIN_URL} className={styles.link} target="_blank" rel="noopener noreferrer">
            {LINKEDIN_HANDLE}
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
