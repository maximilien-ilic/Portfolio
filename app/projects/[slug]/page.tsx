import T from '@/components/i18n/T';
import LangSwitch from '@/components/i18n/LangSwitch';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { projects } from '@/data/projects';
import styles from './ProjectDetail.module.css';
import { GitHubActivityGrid } from '@/components/GitHubActivityGrid';
import { getRepoActivity, parseRepo } from '@/utils/github';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  const repo = project.links?.map((l) => parseRepo(l.url)).find(Boolean);
  const activity = repo ? await getRepoActivity(repo) : null;

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backButton}>
        ← <T fr="Retour" en="Back" />
      </Link>

      <LangSwitch />
      <div className={styles.content}>
        <div className={styles.hero}>
          {project.video ? (
            <video 
              src={project.video} 
              autoPlay 
              loop 
              muted 
              playsInline
              className={styles.media}
            />
          ) : project.image ? (
            <img src={project.image} alt={project.name} className={styles.media} />
          ) : null}
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>{project.name}</h1>
          <span className={styles.badge}><T fr={project.badgeFr} en={project.badge} /></span>
        </div>

        <h2 className={styles.subtitle}><T fr={project.titleFr} en={project.title} /></h2>

        <p className={styles.description}><T fr={project.descriptionFr} en={project.description} /></p>

        {project.tags && project.tags.length > 0 && (
          <div className={styles.techSection}>
            <h3 className={styles.sectionTitle}>Technologies</h3>
            <div className={styles.tags}>
              {project.tags.map((tag, idx) => (
                <span key={idx} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {project.links && project.links.length > 0 && (
          <div className={styles.links}>
            {project.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <T fr="Voir sur GitHub" en={link.label} />
              </a>
            ))}
          </div>
        )}

        {activity && (
          <div className={styles.activitySection}>
            <h3 className={styles.sectionTitle}><T fr="Activité" en="Activity" /></h3>
            <GitHubActivityGrid
              days={activity}
              label={<T fr="commits sur la dernière année" en="commits in the last year" />}
              unit={{ fr: ['commit', 'commits'], en: ['commit', 'commits'] }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}