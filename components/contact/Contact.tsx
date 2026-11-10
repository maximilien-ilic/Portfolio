import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, NAME } from '@/data/site';
import T from '@/components/i18n/T';
import styles from './Contact.module.css';

/* Deliberately short for now: the address, two profiles, done. */
export default function Contact() {
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow} data-reveal="pop">
          Contact
        </p>
        <h2 id="contact-title" className={styles.title} data-reveal="wipe" style={{ ['--d' as string]: '0.1s' }}>
          <span className={styles.strip}>
            <T
              fr="Une offre de stage, une idée de projet ?"
              en="Have an internship opening or a project in mind?"
            />
          </span>
        </h2>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className={styles.email}
          data-reveal="pop"
          style={{ ['--d' as string]: '0.2s' }}
        >
          {CONTACT_EMAIL}
        </a>

        <ul className={styles.links} data-reveal="up" style={{ ['--d' as string]: '0.3s' }}>
          <li>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          </li>
          <li>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          </li>
        </ul>

        <p className={styles.footer} data-reveal="up">
          © {new Date().getFullYear()} {NAME}
        </p>
      </div>
    </section>
  );
}
