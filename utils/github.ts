import type { ActivityDay } from '@/components/GitHubActivityGrid';

const DAY_COUNT = 371; // 53 full weeks
const REVALIDATE = 60 * 60 * 24; // refresh once a day

function lastDays(): string[] {
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  return Array.from({ length: DAY_COUNT }, (_, i) => {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - (DAY_COUNT - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

function toDays(counts: Map<string, number>): ActivityDay[] {
  return lastDays().map((date) => ({ date, count: counts.get(date) ?? 0 }));
}

/** Public contribution calendar of a GitHub user (no token needed). */
export async function getUserContributions(username: string): Promise<ActivityDay[] | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: REVALIDATE } }
    );
    if (!res.ok) return null;
    const data: { contributions: { date: string; count: number }[] } = await res.json();
    return toDays(new Map(data.contributions.map((c) => [c.date, c.count])));
  } catch {
    return null;
  }
}

/** Extracts "owner/repo" from a github.com URL. */
export function parseRepo(url: string): string | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  return match ? `${match[1]}/${match[2].replace(/\.git$/, '')}` : null;
}

/** Commits per day on a repository's default branch over the last year. */
export async function getRepoActivity(repo: string): Promise<ActivityDay[] | null> {
  const since = new Date(lastDays()[0] + 'T00:00:00Z').toISOString();
  const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const counts = new Map<string, number>();
  try {
    for (let page = 1; page <= 10; page++) {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/commits?since=${since}&per_page=100&page=${page}`,
        { headers, next: { revalidate: REVALIDATE } }
      );
      if (!res.ok) return page === 1 ? null : toDays(counts);
      const commits: { commit: { author: { date: string } | null } }[] = await res.json();
      for (const c of commits) {
        const date = c.commit.author?.date.slice(0, 10);
        if (date) counts.set(date, (counts.get(date) ?? 0) + 1);
      }
      if (commits.length < 100) break;
    }
    return toDays(counts);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------------ */
/*  Profile, repositories and derived stats for the about section            */
/* ------------------------------------------------------------------------ */

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

export interface GitHubProfile {
  bio: string | null;
  location: string | null;
  publicRepos: number;
  createdAt: string;
}

export async function getProfile(username: string): Promise<GitHubProfile | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      bio: data.bio,
      location: data.location,
      publicRepos: data.public_repos,
      createdAt: data.created_at
    };
  } catch {
    return null;
  }
}

export interface RepoSummary {
  name: string;
  url: string;
  language: string | null;
  pushedAt: string;
}

/** Public, non-fork repositories, most recently pushed first. The profile
    README repository (named after the user) is left out. */
export async function getRepos(username: string): Promise<RepoSummary[] | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
      { headers: githubHeaders(), next: { revalidate: REVALIDATE } }
    );
    if (!res.ok) return null;
    const repos: Array<{
      name: string;
      html_url: string;
      language: string | null;
      pushed_at: string;
      fork: boolean;
    }> = await res.json();
    return repos
      .filter((r) => !r.fork && r.name.toLowerCase() !== username.toLowerCase())
      .map((r) => ({ name: r.name, url: r.html_url, language: r.language, pushedAt: r.pushed_at }));
  } catch {
    return null;
  }
}

export interface ActivityStats {
  total: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
}

export function activityStats(days: ActivityDay[]): ActivityStats {
  let longest = 0;
  let run = 0;
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  // Today may simply not have started yet, so the current streak may end
  // yesterday.
  let current = 0;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    if (days[i].count > 0) current += 1;
    else if (i === days.length - 1) continue;
    else break;
  }

  return {
    total: days.reduce((sum, d) => sum + d.count, 0),
    activeDays: days.filter((d) => d.count > 0).length,
    longestStreak: longest,
    currentStreak: current
  };
}

/** Repositories per main language, largest first; anything past `keep`
    folds into "Other" so the bar never needs a generated colour. */
export function languageShare(repos: RepoSummary[], keep = 4) {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const top = sorted.slice(0, keep).map(([name, count]) => ({ name, count }));
  const rest = sorted.slice(keep).reduce((sum, [, count]) => sum + count, 0);
  if (rest > 0) top.push({ name: 'Other', count: rest });
  return top;
}
