import Clouds from '@/components/Clouds';
import Opening from '@/components/Opening';
import Ocean from '@/components/Ocean';
import ProjectCard from '@/components/ProjectCard';
import Seabed from '@/components/Seabed';
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

/* The descent. Projects are dealt into zones a pair at a time, so scrolling
   the work section reads as going deeper instead of as one long navy field.
   The tones cycle, so a fifth project opens the next zone without anyone
   having to touch this list. */
const ZONE_TONES = ['kelp', 'abyss'] as const;
const PER_ZONE = 2;

function inPairs<T>(items: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export default function Home() {
  const zones = inPairs(projects, PER_ZONE);

  return (
    <>
      <Opening />
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
          </div>

          {zones.map((zone, index) => {
            const tone = ZONE_TONES[index % ZONE_TONES.length];

            return (
              <div key={zone[0].id} className={`${styles.zone} ${styles[tone]}`}>
                <Seabed tone={tone} />

                <div className={`shell ${styles.zoneInner}`}>
                  <div className={styles.grid}>
                    {zone.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
