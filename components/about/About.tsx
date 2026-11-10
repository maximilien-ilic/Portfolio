import GitHubPanel from './GitHubPanel';
import { GITHUB_HANDLE } from '@/data/site';
import { getProfile, getRepos, getUserContributions } from '@/utils/github';
import T from '@/components/i18n/T';
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
          <T fr="À propos" en="About" />
        </p>

        <h2 id="about-title" className={styles.statement} data-reveal="wipe" style={{ ['--d' as string]: '0.1s' }}>
          <span className={styles.strip}>
            <T
              fr={
                <>
                  Je développe pour le web et j’en teste les <em>limites</em>.
                </>
              }
              en={
                <>
                  I build for the web, then put my work to the <em>test</em>.
                </>
              }
            />
          </span>
        </h2>

        <div className={styles.card} data-reveal="up">
          <div className={styles.bio}>
            <p>
              <T
                fr="Je m’appelle Maximilien et je suis en troisième année à l’IIM Digital School. En dehors des cours, je joue au foot, au golf et au tennis. J’aime aussi visiter des musées et préparer mes builds sur Path of Exile."
                en="I’m Maximilien, a third-year student at IIM Digital School. Away from my desk, I play football, golf and tennis. I also like visiting museums and planning my next Path of Exile build."
              />
            </p>
            <p>
              <T
                fr="J’aime comprendre comment les applications fonctionnent et repérer leurs failles. Je m’exerce sur TryHackMe et Hack The Box pour la cybersécurité, et sur LeetCode pour la programmation."
                en="I like understanding how applications work and finding their weak spots. I practise security on TryHackMe and Hack The Box, and work through coding problems on LeetCode."
              />
            </p>
            <p>
              <T
                fr="Mes projets me donnent l’occasion d’essayer ce que je ne connais pas encore : de l’IoT avec un Raspberry Pi, une extension Blender pour accéder aux commandes au clavier, ou de la rétro-ingénierie en C#."
                en="I use personal projects to try things I haven’t done before: IoT with a Raspberry Pi, a Blender add-on for keyboard navigation, and reverse engineering in C#."
              />
            </p>
          </div>

          <dl className={styles.facts}>
            <div>
              <dt>
                <T fr="École" en="School" />
              </dt>
              <dd>IIM Digital School, B3</dd>
            </div>
            {profile?.location && (
              <div>
                <dt>
                  <T fr="Basé à" en="Based in" />
                </dt>
                <dd className={styles.capitalize}>{profile.location.toLowerCase()}</dd>
              </div>
            )}
            <div>
              <dt>
                <T fr="Spécialité" en="Focus" />
              </dt>
              <dd>
                <T
                  fr="Développement fullstack, sécurité applicative"
                  en="Fullstack development, application security"
                />
              </dd>
            </div>
            <div>
              <dt>
                <T fr="Outils" en="Works with" />
              </dt>
              <dd>PHP, TypeScript, Python, SQL, WordPress</dd>
            </div>
          </dl>
        </div>

        <GitHubPanel profile={profile} repos={repos} contributions={contributions} />
      </div>
    </section>
  );
}
