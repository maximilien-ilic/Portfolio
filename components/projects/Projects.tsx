import { MORE_WORK, WORK } from '@/data/work';
import { GITHUB_HANDLE, GITHUB_URL } from '@/data/site';
import { techColor } from '@/data/tech';
import { getProfile, getRepos } from '@/utils/github';
import T from '@/components/i18n/T';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.css';

export default async function Projects() {
  const [repos, profile] = await Promise.all([getRepos(GITHUB_HANDLE), getProfile(GITHUB_HANDLE)]);
  const live = new Map((repos ?? []).map((repo) => [repo.name, repo]));

  return (
    <section id="projects" className={styles.projects} aria-labelledby="projects-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow} data-reveal="pop">
          <T fr="Projets" en="Projects" />
        </p>
        <h2 id="projects-title" className={styles.statement} data-reveal="wipe" style={{ ['--d' as string]: '0.1s' }}>
          <span className={styles.strip}>
            <T fr="Mes projets et ce que j’y apprends." en="What I’ve been building and learning." />
          </span>
        </h2>

        <div className={styles.grid}>
          {WORK.map((work, index) => (
            <ProjectCard
              key={work.repo}
              work={work}
              index={index}
              language={live.get(work.repo)?.language}
              pushedAt={live.get(work.repo)?.pushedAt}
            />
          ))}
        </div>

        <div className={styles.more} data-reveal="up">
          <h3 className={styles.moreTitle}>
            <T fr="Aussi sur GitHub" en="Also on GitHub" />
          </h3>
          <ul className={styles.list}>
            {MORE_WORK.map((item, i) => (
              <li key={item.repo} data-reveal="up" style={{ ['--d' as string]: `${0.05 + i * 0.045}s` }}>
                <a href={`${GITHUB_URL}/${item.repo}`} target="_blank" rel="noopener noreferrer">
                  <span className={styles.name}>
                    <T {...item.title} />
                  </span>
                  <span className={styles.desc}>
                    <T {...item.summary} />
                  </span>
                  <span className={styles.lang}>
                    {live.get(item.repo)?.language && (
                      <>
                        <i style={{ background: techColor(live.get(item.repo)!.language!) }} />
                        {live.get(item.repo)!.language}
                      </>
                    )}
                  </span>
                  <span className={styles.arrow} aria-hidden="true">
                    ↗
                  </span>
                </a>
                {item.demo && (
                  <a href={item.demo} target="_blank" rel="noopener noreferrer" className={styles.live}>
                    <T fr="Démo ↗" en="Live ↗" />
                  </a>
                )}
              </li>
            ))}
          </ul>

          <a
            href={`${GITHUB_URL}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.all}
            data-reveal="pop"
            style={{ ['--d' as string]: '0.3s' }}
          >
            {profile ? (
              <T
                fr={`Les ${profile.publicRepos} dépôts sur GitHub ↗`}
                en={`All ${profile.publicRepos} repositories on GitHub ↗`}
              />
            ) : (
              <T fr="Tous les dépôts sur GitHub ↗" en="All repositories on GitHub ↗" />
            )}
          </a>
        </div>
      </div>
    </section>
  );
}
