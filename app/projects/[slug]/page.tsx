import { notFound } from 'next/navigation';
import Link from 'next/link';
import { projects } from '@/data/projects';
import styles from './ProjectDetail.module.css';

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

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backButton}>
        ← Back
      </Link>

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
          <span className={styles.badge}>{project.badge}</span>
        </div>

        <h2 className={styles.subtitle}>{project.title}</h2>

        <p className={styles.description}>{project.description}</p>

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
                {link.label}
              </a>
            ))}
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