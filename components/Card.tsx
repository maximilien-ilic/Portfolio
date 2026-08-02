import type { Project } from '@/data/projects';
import styles from './Card.module.css';

interface CardProps {
  projects: Project[];
}

export default function Card({ projects }: CardProps) {
  return (
    <section className={styles.section}>
      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <article key={project.id} className={styles.projectCard}>
            <div className={styles.cardHeader}>
              <h3>{project.name}</h3>
              <span className={styles.badge}>{project.badge}</span>
            </div>

            <div className={styles.cardImage}>
              {project.video && (
                <video src={project.video} autoPlay loop muted playsInline />
              )}
            </div>

            <h4 className={styles.cardTitle}>{project.title}</h4>
            <p className={styles.cardDescription}>{project.description}</p>

            {project.tags && project.tags.length > 0 && (
              <div className={styles.cardTags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}

            {project.links && project.links.length > 0 && (
              <div className={styles.cardLinks}>
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    className={styles.cardLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
