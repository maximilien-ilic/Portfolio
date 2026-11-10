import { GitHubActivityGrid, type ActivityDay } from '@/components/GitHubActivityGrid';
import { GITHUB_HANDLE, GITHUB_URL } from '@/data/site';
import {
  activityStats,
  languageShare,
  type GitHubProfile,
  type RepoSummary
} from '@/utils/github';
import CountUp from '@/components/reveal/CountUp';
import T, { DateT, type Text } from '@/components/i18n/T';
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

export default function GitHubPanel({ profile, repos, contributions }: Props) {
  const stats = contributions ? activityStats(contributions) : null;
  const languages = repos ? languageShare(repos) : [];
  const languageTotal = languages.reduce((sum, l) => sum + l.count, 0);
  const recent = repos?.slice(0, 3) ?? [];

  const tiles = [
    stats && {
      key: 'total',
      value: stats.total,
      label: { fr: 'contributions sur la dernière année', en: 'contributions in the last year' }
    },
    stats && {
      key: 'active',
      value: stats.activeDays,
      label: { fr: 'jours d’activité', en: 'active days' }
    },
    stats && {
      key: 'streak',
      value: stats.longestStreak,
      label: { fr: 'jours d’activité consécutifs, mon record', en: 'days in a row, longest streak' }
    },
    profile && { key: 'repos', value: profile.publicRepos, label: { fr: 'dépôts publics', en: 'public repositories' } }
  ].filter(Boolean) as { key: string; value: number; label: Text }[];

  if (tiles.length === 0 && !contributions && recent.length === 0) return null;

  return (
    <div className={styles.panel} data-reveal="up">
      <header className={styles.header}>
        <h3 className={styles.title}>
          <T fr="Sur GitHub" en="On GitHub" />
        </h3>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={styles.handle}>
          @{GITHUB_HANDLE} ↗
        </a>
      </header>

      {tiles.length > 0 && (
        <dl className={styles.tiles}>
          {tiles.map((tile, i) => (
            <div
              key={tile.key}
              className={styles.tile}
              data-reveal="up"
              style={{ ['--d' as string]: `${0.08 + i * 0.06}s` }}
            >
              <dt className={styles.label}>
                <T {...tile.label} />
              </dt>
              <dd className={styles.value}>
                <CountUp value={tile.value} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      {contributions && (
        <div className={styles.block} data-reveal="up">
          <GitHubActivityGrid days={contributions} label={null} cellSize={18} />
        </div>
      )}

      <div className={styles.split}>
        {languages.length > 0 && (
          <section className={styles.block} aria-labelledby="languages-title" data-reveal="up">
            <h4 id="languages-title" className={styles.subtitle}>
              <T fr="Langage principal, par dépôt" en="Main language, by repository" />
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
                  {language.name === 'Other' ? <T fr="Autres" en="Other" /> : language.name}
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
              <T fr="Dernières mises à jour" en="Recently updated" />
            </h4>
            <ul className={styles.recent}>
              {recent.map((repo) => (
                <li key={repo.name}>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                  <span className={styles.meta}>
                    {repo.language ?? '—'} · <DateT iso={repo.pushedAt} year={false} />
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
