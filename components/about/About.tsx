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
                  Je construis pour le web, puis j’essaie de <em>casser</em> ce que j’ai construit.
                </>
              }
              en={
                <>
                  I build for the web, then I try to <em>break</em> what I built.
                </>
              }
            />
          </span>
        </h2>

        <div className={styles.card} data-reveal="up">
          <div className={styles.bio}>
            <p>
              <T
                fr="Je suis Maximilien, étudiant en troisième année à l’IIM Digital School. En dehors des cours, je reste actif avec le foot, le golf et le tennis. Curieux de nature, j’aime explorer des centres d’intérêt très différents : visiter un musée un jour, théoriser des builds sur Path of Exile le lendemain."
                en="I’m Maximilien, a third-year student at IIM Digital School. Outside of my studies, I enjoy staying active through sports like football, golf and tennis. I’m naturally curious and enjoy exploring different interests, whether that means visiting a museum one day or theorycrafting builds in Path of Exile the next."
              />
            </p>
            <p>
              <T
                fr="Le web et la technologie font partie de mes plus grandes passions. J’aime apprendre quelque chose de nouveau chaque jour et me challenger en permanence sur des plateformes comme TryHackMe, Hack The Box et LeetCode, où j’affûte mes compétences en cybersécurité, en programmation et en résolution de problèmes."
                en="The web and technology are among my biggest passions. I enjoy learning something new every day and constantly challenging myself through platforms like TryHackMe, Hack The Box and LeetCode, where I sharpen my skills in cybersecurity, programming and problem-solving."
              />
            </p>
            <p>
              <T
                fr="Au-delà des cours, j’adore transformer des idées en projets. J’ai mené des expériences IoT avec un Raspberry Pi, développé un add-on Blender qui rend plus de 200 commandes accessibles au clavier, et exploré la rétro-ingénierie à travers un projet en C#."
                en="Beyond the classroom, I love turning ideas into projects. I’ve worked on IoT experiments with Raspberry Pi, developed a Blender add-on featuring over 200 keyboard-accessible commands, and explored reverse engineering through a project in C#."
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
