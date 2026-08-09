import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteFooter from '@/components/SiteFooter';
import SiteNav from '@/components/SiteNav';
import { getProject, projects } from '@/data/projects';
import styles from './ProjectDetail.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: 'Project not found' };

  return {
    title: `${project.title} — Maximilien Ilic`,
    description: project.tagline
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <>
      <SiteNav />

      <main id="top" className={styles.page}>
        <article className={`shell ${styles.inner}`}>
          <Link href="/#projects" className={`readout ${styles.back}`}>
            <span aria-hidden="true">← </span>All projects
          </Link>

          <p className={`readout ${styles.domain}`}>{project.domain}</p>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.tagline}>{project.tagline}</p>

          {project.video && (
            <div className={styles.media}>
              <video
                src={project.video}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={`Screen recording of ${project.title}`}
              />
            </div>
          )}

          <div className={styles.columns}>
            <div className={styles.prose}>
              <h2 className={`readout ${styles.sectionTitle}`}>What it is</h2>
              <p>{project.description}</p>
            </div>

            <aside className={styles.side}>
              <h2 className={`readout ${styles.sectionTitle}`}>Built with</h2>
              <ul className={styles.tags}>
                {project.tags.map((tag) => (
                  <li key={tag} className={`readout ${styles.tag}`}>
                    {tag}
                  </li>
                ))}
              </ul>

              {project.links && project.links.length > 0 && (
                <>
                  <h2 className={`readout ${styles.sectionTitle}`}>Links</h2>
                  <div className={styles.links}>
                    {project.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        className={`readout ${styles.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                        <span aria-hidden="true"> ↗</span>
                        <span className="srOnly"> (opens in a new tab)</span>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </aside>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
