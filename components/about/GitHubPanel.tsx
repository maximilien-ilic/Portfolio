import { GitHubActivityGrid, type ActivityDay } from '@/components/GitHubActivityGrid';
import { GITHUB_HANDLE, GITHUB_URL } from '@/data/site';
import {
  activityStats,
  languageShare,
  type GitHubProfile,
  type RepoSummary
} from '@/utils/github';
import CountUp from '@/components/reveal/CountUp';
import styles from './GitHubPanel.module.css';

/* Categorical slots, in fixed order (validated for the dark panel with the
   dataviz palette checker). "Other" is always the neutral grey, never a
   sixth hue. */
const LANGUAGE_COLORS = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181'];
const OTHER = '#6b6b70';

interface Props {
  profile: GitHubProfile | null;
  repos: RepoSummary[] | null;
  contributions: ActivityDay[] | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function GitHubPanel({ profile, repos, contributions }: Props) {
  const stats = contributions ? activityStats(contributions) : null;
  const languages = repos ? languageShare(repos) : [];
  const languageTotal = languages.reduce((sum, l) => sum + l.count, 0);
  const recent = repos?.slice(0, 3) ?? [];

  const tiles = [
    stats && { value: stats.total, label: 'contributions in the last year' },
    stats && { value: stats.activeDays, label: 'days with at least one contribution' },
    stats && { value: stats.longestStreak, label: 'days in a row, longest streak' },
    profile && { value: profile.publicRepos, label: 'public repositories' }
  ].filter(Boolean) as { value: number; label: string }[];

  if (tiles.length === 0 && !contributions && recent.length === 0) return null;

  return (
    <div className={styles.panel} data-reveal="up">
      <header className={styles.header}>
        <h3 className={styles.title}>On GitHub</h3>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={styles.handle}>
          @{GITHUB_HANDLE} ↗
        </a>
      </header>

      {tiles.length > 0 && (
        <dl className={styles.tiles}>
          {tiles.map((tile, i) => (
            <div
              key={tile.label}
              className={styles.tile}
              data-reveal="up"
              style={{ ['--d' as string]: `${0.08 + i * 0.06}s` }}
            >
              <dt className={styles.label}>{tile.label}</dt>
              <dd className={styles.value}>
                <CountUp value={tile.value} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      {contributions && (
        <div className={styles.block} data-reveal="up">
          <GitHubActivityGrid days={contributions} label="" cellSize={18} />
        </div>
      )}

      <div className={styles.split}>
        {languages.length > 0 && (
          <section className={styles.block} aria-labelledby="languages-title" data-reveal="up">
            <h4 id="languages-title" className={styles.subtitle}>
              Main language, by repository
            </h4>
            <div className={styles.bar} role="img" aria-label={languages.map((l) => `${l.name}: ${l.count}`).join(', ')}>
              {languages.map((language, index) => (
                <span
                  key={language.name}
                  style={{
                    flexGrow: language.count,
                    background: language.name === 'Other' ? OTHER : LANGUAGE_COLORS[index]
                  }}
                />
              ))}
            </div>
            <ul className={styles.legend}>
              {languages.map((language, index) => (
                <li key={language.name}>
                  <span
                    className={styles.swatch}
                    style={{ background: language.name === 'Other' ? OTHER : LANGUAGE_COLORS[index] }}
                  />
                  {language.name}
                  <span className={styles.count}>
                    {language.count} / {languageTotal}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {recent.length > 0 && (
          <section
            className={styles.block}
            aria-labelledby="recent-title"
            data-reveal="up"
            style={{ ['--d' as string]: '0.08s' }}
          >
            <h4 id="recent-title" className={styles.subtitle}>
              Recently pushed
            </h4>
            <ul className={styles.recent}>
              {recent.map((repo) => (
                <li key={repo.name}>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                  <span className={styles.meta}>
                    {repo.language ?? '—'} · {formatDate(repo.pushedAt)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
