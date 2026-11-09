/* Projects shown on the home page, picked from github.com/maximilien-ilic.
   Copy is written from each repository's README and code; the language and
   last-push date are read live from the GitHub API at render time. */

export type Tone = 'red' | 'grey';

export interface Work {
  /** Repository name under github.com/maximilien-ilic. */
  repo: string;
  title: string;
  /** What kind of project it is, shown as the card's chip. Red marks the
      security work, the same red as "secure-minded" in the hero. */
  kind: string;
  tone: Tone;
  summary: string;
  stack: string[];
  /** Shown in a yellow chip, e.g. a project still being built. */
  status?: string;
  demo?: string;
  featured?: boolean;
}

export const WORK: Work[] = [
  {
    repo: 'reverse-engineering-scuba-diving',
    title: 'Mini Diving Log',
    kind: 'Reverse engineering',
    tone: 'red',
    summary:
      'I studied a closed Windows app, Diving Log 6, without its source code, then rebuilt my own version from scratch, step by step and under test. It keeps a dive log in SQLite, imports UDDF files, draws each dive’s profile and flags fast ascents, computes Nitrox and gas consumption, and plans decompression with the Bühlmann ZH-L16C algorithm.',
    stack: ['C#', '.NET 10', 'Avalonia', 'SQLite', 'xUnit · 67 tests'],
    featured: true
  },
  {
    repo: 'N8N',
    title: 'Local AI automations',
    kind: 'Automation · Security',
    tone: 'red',
    summary:
      'Two n8n workflows driven by AI agents. One reads the day’s emails at 6 pm and sends me a summary on Discord; the other audits the diff of every GitHub pull request with Claude and posts a security report as a comment.',
    stack: ['n8n', 'Docker', 'Ollama', 'Claude API', 'DeepL'],
  },
  {
    repo: 'Crud-security-formula1',
    title: 'Secure Formula 1 CRUD',
    kind: 'Web security',
    tone: 'red',
    summary:
      'A small Formula 1 site with full create, read, update and delete, written to practise secure coding: input validation, authentication, and protection against SQL injection, XSS and CSRF.',
    stack: ['PHP', 'MySQL', 'PDO', 'CSS'],
  },
  {
    repo: 'Neuron-Boxing',
    title: 'Neuron Boxing',
    kind: 'AI research',
    tone: 'grey',
    status: 'In progress',
    summary:
      'A minimal 1v1 boxing game built as a test bed for NEAT neuroevolution: the point is to watch the networks develop over generations. The ruleset is frozen and the deterministic simulation (30 ticks a second, 15-second rounds) is written and tested; agents and training come next.',
    stack: ['Python', 'NEAT', 'Gymnasium', 'pygame', 'pytest'],
  },
  {
    repo: 'Mineral-Map',
    title: 'EDS mineral mapping',
    kind: 'Data · Geology',
    tone: 'grey',
    summary:
      'Turns 11 EDS element maps (Si, Ti, Al, Fe…) into a colour-coded mineral map: raw counts are normalised to atomic proportions and each pixel is matched to the closest of nine minerals by Euclidean distance.',
    stack: ['Python', 'NumPy', 'Matplotlib', 'Jupyter'],
  },
  {
    repo: 'Deck-Royale',
    title: 'Deck Royale',
    kind: 'Web app · Team of 3',
    tone: 'grey',
    summary:
      'A Clash Royale companion built on the official API: browse every card with its rarity and elixir cost, draw a random 8-card deck, or look up a player by tag to see their clan, arena and current deck.',
    stack: ['Next.js', 'TypeScript', 'CSS Modules', 'REST API'],
  },
  {
    repo: 'Add-on-Accessibility-Blender',
    title: 'Keyboard navigator for Blender',
    kind: 'Accessibility',
    tone: 'grey',
    summary:
      'A Blender add-on that puts 200+ operators behind the keyboard: browse 25 themed groups, open one and run a command in a few keystrokes, no mouse needed. Bonus: Ctrl + wheel scales the interface under the cursor.',
    stack: ['Python', 'Blender API'],
  },
  {
    repo: 'theme-enfant-Miyazaki-PSG',
    title: 'PSG WordPress theme',
    kind: 'WordPress',
    tone: 'grey',
    summary:
      'A child theme of Miyazaki restyled for Paris Saint-Germain, with style overrides and template changes on top of the parent theme.',
    stack: ['WordPress', 'PHP', 'CSS'],
  }
];

/* Smaller projects, listed under the cards. */
export const MORE_WORK: Array<{ repo: string; title: string; summary: string; demo?: string }> = [
  {
    repo: 'Java-Golf',
    title: 'Java Golf',
    summary: 'Spring Boot REST API: create golfers and courses, then simulate a match between two players.'
  },
  {
    repo: 'Tailwind-mobile-first',
    title: 'Tailwind mobile-first',
    summary: 'A mock-up rebuilt mobile-first with Vue, Nuxt and Tailwind CSS.',
    demo: 'https://tailwind-mobile-first.vercel.app'
  },
  {
    repo: 'Emotions_Birds',
    title: 'Emotions Birds',
    summary: 'An interactive Angry Birds-themed site about emotions: drag a bird onto the slingshot to travel between screens.'
  },
  {
    repo: 'DRAGON-BALL-Z-CARDS',
    title: 'Dragon Ball Z cards',
    summary: 'A card-collecting site in PHP with accounts, booster packs and a profile page.'
  },
  {
    repo: 'ACAAE',
    title: 'ACAAE website',
    summary: 'Redesign of the ACAAE website as a custom WordPress theme.'
  }
];
