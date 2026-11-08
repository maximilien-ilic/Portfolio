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
