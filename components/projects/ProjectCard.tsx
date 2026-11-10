import type { Work } from '@/data/work';
import { GITHUB_URL } from '@/data/site';
import { techColor, techColors } from '@/data/tech';
import T, { DateT } from '@/components/i18n/T';
import Cover from './Cover';
import styles from './ProjectCard.module.css';

interface Props {
  work: Work;
  /** Position in the grid: staggers the card's entrance within its row. */
  index?: number;
  language?: string | null;
  pushedAt?: string;
}

/* The title links to the repository and stretches over the whole card, so
   the card is one target; the demo link sits above it as its own. */
export default function ProjectCard({ work, index = 0, language, pushedAt }: Props) {
  const url = `${GITHUB_URL}/${work.repo}`;

  return (
    <article
      className={`project-card ${styles.card} ${work.featured ? styles.featured : ''}`}
      data-reveal="up"
      style={{ ['--d' as string]: `${work.featured ? 0 : ((index + 1) % 2) * 0.08}s` }}
    >
      <Cover work={work} />

      <div className={styles.body}>
        <div className={styles.chips}>
          <span className={`${styles.chip} ${styles[work.tone]}`}>
            <T {...work.kind} />
          </span>
          {work.status && (
            <span className={`${styles.chip} ${styles.status}`}>
              <T {...work.status} />
            </span>
          )}
        </div>

        <h3 className={styles.title}>
          <a href={url} target="_blank" rel="noopener noreferrer" className={styles.stretched}>
            <T {...work.title} />
          </a>
        </h3>

        <p className={styles.summary}>
          <T {...work.summary} />
        </p>

        <ul className={styles.stack} aria-label="Stack">
          {work.stack.map((item) => (
            <li key={item} style={techColors(item)}>
              {item}
            </li>
          ))}
        </ul>

        <footer className={styles.footer}>
          <span className={styles.meta}>
            {language && (
              <span className={styles.language}>
                <span className={styles.dot} style={{ background: techColor(language) }} />
                {language}
              </span>
            )}
            {pushedAt && (
              <span>
                <T fr="mis à jour le " en="updated " />
                <DateT iso={pushedAt} />
              </span>
            )}
          </span>
          <span className={styles.links}>
            {work.demo && (
              <a href={work.demo} target="_blank" rel="noopener noreferrer" className={styles.demo}>
                <T fr="Démo ↗" en="Live ↗" />
              </a>
            )}
            <span className={styles.code} aria-hidden="true">
              Code ↗
            </span>
          </span>
        </footer>
      </div>
    </article>
  );
}
