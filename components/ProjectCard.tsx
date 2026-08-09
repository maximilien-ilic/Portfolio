'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/data/projects';
import styles from './ProjectCard.module.css';

/* Tags are toned by what kind of thing they are, not one colour per name —
   so the same colour always means the same category across every card. */
const TAG_KIND: Record<string, string> = {
  PHP: 'lang',
  Python: 'lang',
  MySQL: 'data',
  PDO: 'data',
  Blender: 'platform',
  WordPress: 'platform',
  Plugin: 'platform',
  CMS: 'platform',
  CSS: 'craft',
  MVC: 'craft'
};

export default function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Without IntersectionObserver, show everything rather than hide it.
    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (entry.isIntersecting) {
          setRevealed(true);
          // play() rejects on a backgrounded tab — not worth surfacing.
          video?.play().catch(() => {});
        } else {
          video?.pause();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const source = project.links?.[0];

  return (
    <article
      ref={cardRef}
      className={`${styles.card} ${revealed ? styles.revealed : ''}`}
      aria-labelledby={`${project.id}-title`}
    >
      <header className={styles.head}>
        <h3 id={`${project.id}-title`} className={styles.title}>
          <Link href={`/projects/${project.slug}`} className={styles.titleLink}>
            {project.title}
          </Link>
        </h3>

        <span className={`readout ${styles.badge}`}>{project.domain}</span>
      </header>

      {project.video && (
        <div className={styles.media}>
          <video
            ref={videoRef}
            src={project.video}
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={`Screen recording of ${project.title}`}
          />

          {/* Instrument plate, straight out of the racing HUD reference. */}
          <div className={styles.plate}>
            <b>{String(project.tags.length).padStart(2, '0')}</b>
            <i>stack</i>
            {source && (
              <>
                <span className={styles.plateRule} aria-hidden="true" />
                <span>Open source</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className={styles.body}>
        <p className={styles.tagline}>{project.tagline}</p>
        <p className={styles.description}>{project.description}</p>

        <ul className={styles.tags}>
          {project.tags.map((tag) => (
            <li
              key={tag}
              className={`readout ${styles.tag} ${
                styles[TAG_KIND[tag] ?? 'craft']
              }`}
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Link
            href={`/projects/${project.slug}`}
            className={`readout ${styles.button}`}
          >
            Read more<span aria-hidden="true"> →</span>
          </Link>

          {project.links?.map((link) => (
            <a
              key={link.url}
              href={link.url}
              className={`readout ${styles.button} ${styles.ghost}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
              <span aria-hidden="true"> ↗</span>
              <span className="srOnly"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
