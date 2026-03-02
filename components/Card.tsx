'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Card.module.css';

interface Project {
  slug: string;
  name: string;
  badge: string;
  title: string;
  description: string;
  tags?: string[];
  image?: string | null;
  video?: string | null;
  links?: Array<{ label: string; url: string }>;
}

interface CardProps {
  projects: Project[];
  showTitle?: boolean;
}

export default function Card({ projects, showTitle = true }: CardProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const router = useRouter();

  return (
    <section className={styles.section}>
      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <article
            key={project.slug}
            className={styles.projectCard}
            onClick={() => router.push(`/projects/${project.slug}`)}
            onMouseEnter={() => setHoveredProject(project.slug)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <div className={styles.cardHeader}>
              <h3>{project.name}</h3>
              <span className={styles.badge}>{project.badge}</span>
            </div>

            <div className={styles.cardImage}>
              {project.video ? (
                <video src={project.video} autoPlay loop muted playsInline />
              ) : project.image ? (
                <img src={project.image} alt={project.name} />
              ) : null}
            </div>

            <h4 className={styles.cardTitle}>{project.title}</h4>
            <p className={styles.cardDescription}>{project.description}</p>

            {project.tags && project.tags.length > 0 && (
              <div className={styles.cardTags}>
                {project.tags.map((tag, idx) => (
                  <span key={idx} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}

            {project.links && project.links.length > 0 && (
              <div className={styles.cardLinks}>
                {project.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className={styles.cardLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
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