import GitHubPanel from './GitHubPanel';
import { GITHUB_HANDLE } from '@/data/site';
import { getProfile, getRepos, getUserContributions } from '@/utils/github';
import styles from './About.module.css';

export default async function About() {
  const [profile, repos, contributions] = await Promise.all([
    getProfile(GITHUB_HANDLE),
    getRepos(GITHUB_HANDLE),
    getUserContributions(GITHUB_HANDLE)
  ]);

  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow} data-reveal="pop">
          About
        </p>

        <h2 id="about-title" className={styles.statement} data-reveal="wipe" style={{ ['--d' as string]: '0.1s' }}>
          <span className={styles.strip}>
            I build for the web, then I try to <em>break</em> what I built.
          </span>
        </h2>

        <div className={styles.card} data-reveal="up">
          <div className={styles.bio}>
            <p>
              I’m Maximilien, a third-year student at IIM Digital School. Outside of my studies, I enjoy staying active through sports like football, golf and tennis. I’m naturally curious and enjoy exploring different interests, whether that means visiting a museum one day or theorycrafting builds in Path of Exile the next.
            </p>
            <p>
              The web and technology are among my biggest passions. I enjoy learning something new every day and constantly challenging myself through platforms like TryHackMe, Hack The Box and LeetCode, where I sharpen my skills in cybersecurity, programming and problem-solving.
            </p>
            <p>
              Beyond the classroom, I love turning ideas into projects. I’ve worked on IoT experiments with Raspberry Pi, developed a Blender add-on featuring over 200 keyboard-accessible commands, and explored reverse engineering through a project in C#.
            </p>
          </div>

          <dl className={styles.facts}>
            <div>
              <dt>School</dt>
              <dd>IIM Digital School, B3</dd>
            </div>
            {profile?.location && (
              <div>
                <dt>Based in</dt>
                <dd className={styles.capitalize}>{profile.location.toLowerCase()}</dd>
              </div>
            )}
            <div>
              <dt>Focus</dt>
              <dd>Fullstack development, application security</dd>
            </div>
            <div>
              <dt>Works with</dt>
              <dd>PHP, TypeScript, Python, SQL, WordPress</dd>
            </div>
          </dl>
        </div>

        <GitHubPanel profile={profile} repos={repos} contributions={contributions} />
      </div>
    </section>
  );
}
