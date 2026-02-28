'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  icon?: string | null;
  links?: Array<{ label: string; url: string }>;
}

interface CardProps {
  projects: Project[];
  showTitle?: boolean;
}

export default function Card({ projects, showTitle = true }: CardProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <section className={styles.section}>
      {showTitle && (
        <div className={styles.titleWrapper}>
          <h2 className={styles.mainTitle}>Projects</h2>
          <p className={styles.subtitle}>A collection of my work</p>
        </div>
      )}

      <div className={styles.projectsGrid}>
        {projects.map((project) => {
          return (
            <article
              key={project.slug}
              className={styles.projectCard}
              onMouseEnter={() => setHoveredProject(project.slug)}
              onMouseLeave={() => setHoveredProject(null)}
            >

            {/* Header */}
              <div className={styles.cardHeader}>
                <h3>{project.name}</h3>
                <span className={styles.badge}>{project.badge}</span>
              </div>

              {/* Image/Video/Icon */}
              <div className={styles.cardImage}>
                {project.video ? (
                  <video 
                    src={project.video} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                  />
                ) : project.image ? (
                  <img src={project.image} alt={project.name} />
                ) : project.icon ? (
                  <div className={styles.cardIcon}>{project.icon}</div>
                ) : null}
              </div>
              
              {/* Content */}
              <h4 className={styles.cardTitle}>{project.title}</h4>
              <p className={styles.cardDescription}>{project.description}</p>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className={styles.cardTags}>
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}

              {/* Links */}
              {project.links && project.links.length > 0 && (
                <div className={styles.cardLinks}>
                  {project.links.map((link, idx) => (
                    <Link key={idx} href={link.url} className={styles.cardLink}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}