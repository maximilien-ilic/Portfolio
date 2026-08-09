import Clouds from '@/components/Clouds';
import Ocean from '@/components/Ocean';
import ProjectCard from '@/components/ProjectCard';
import SiteFooter from '@/components/SiteFooter';
import SiteNav from '@/components/SiteNav';
import { projects } from '@/data/projects';
import {
  CONTACT_EMAIL,
  COORDINATES,
  GITHUB_HANDLE,
  GITHUB_URL,
  INTRO,
  NAME,
  ROLE
} from '@/data/site';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <SiteNav />

      <main id="top">
        <section className={styles.hero}>
          <Clouds />

          <div className={`shell ${styles.heroInner}`}>
            <p className={`readout ${styles.coords}`}>{COORDINATES}</p>

            <h1 className={styles.name}>{NAME}</h1>
            <p className={styles.role}>{ROLE}</p>

            <div className={styles.intro}>
              {INTRO.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <dl className={styles.contact}>
              <div className={styles.contactRow}>
                <dt className={`readout ${styles.contactKey}`}>github</dt>
                <dd className={styles.contactValue}>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {GITHUB_HANDLE}
                  </a>
                </dd>
              </div>

              <div className={styles.contactRow}>
                <dt className={`readout ${styles.contactKey}`}>email</dt>
                <dd className={styles.contactValue}>
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <Ocean />

        <section id="projects" className={styles.work}>
          <div className={`shell ${styles.workInner}`}>
            <div className={styles.workHead}>
              <h2 className={styles.workTitle}>Projects</h2>
              <p className={`readout ${styles.workCount}`}>
                {String(projects.length).padStart(2, '0')} charted
              </p>
            </div>

            <div className={styles.grid}>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
