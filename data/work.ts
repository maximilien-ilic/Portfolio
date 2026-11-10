/* Projects shown on the home page, picked from github.com/maximilien-ilic.
   Copy is written from each repository's README and code, in French and
   English; the language and last-push date are read live from the GitHub
   API at render time. */

import type { Text } from '@/components/i18n/T';

export type Tone = 'red' | 'grey';

export interface Work {
  /** Repository name under github.com/maximilien-ilic. */
  repo: string;
  title: Text;
  /** What kind of project it is, shown as the card's chip. Red marks the
      security work, the same red as "secure-minded" in the hero. */
  kind: Text;
  tone: Tone;
  summary: Text;
  stack: string[];
  /** Shown in a yellow chip, e.g. a project still being built. */
  status?: Text;
  demo?: string;
  featured?: boolean;
}

export const WORK: Work[] = [
  {
    repo: 'reverse-engineering-scuba-diving',
    title: { fr: 'Mini Diving Log', en: 'Mini Diving Log' },
    kind: { fr: 'Rétro-ingénierie', en: 'Reverse engineering' },
    tone: 'red',
    summary: {
      fr: 'J’ai étudié une application Windows fermée, Diving Log 6, sans son code source, puis j’ai recodé ma propre version de zéro, étape par étape et sous tests. Elle tient un carnet de plongée en SQLite, importe les fichiers UDDF, trace le profil de chaque plongée en signalant les remontées trop rapides, calcule le Nitrox et la consommation, et planifie la décompression avec l’algorithme Bühlmann ZH-L16C.',
      en: 'I studied a closed Windows app, Diving Log 6, without its source code, then rebuilt my own version from scratch, step by step and under test. It keeps a dive log in SQLite, imports UDDF files, draws each dive’s profile and flags fast ascents, computes Nitrox and gas consumption, and plans decompression with the Bühlmann ZH-L16C algorithm.'
    },
    stack: ['C#', '.NET 10', 'Avalonia', 'SQLite', 'xUnit · 67 tests'],
    featured: true
  },
  {
    repo: 'N8N',
    title: { fr: 'Automatisations IA en local', en: 'Local AI automations' },
    kind: { fr: 'Automatisation · Sécurité', en: 'Automation · Security' },
    tone: 'red',
    summary: {
      fr: 'Deux workflows n8n pilotés par des agents IA. L’un lit mes emails du jour à 18 h et m’envoie un résumé sur Discord ; l’autre audite le diff de chaque pull request GitHub avec Claude et publie un rapport de sécurité en commentaire.',
      en: 'Two n8n workflows driven by AI agents. One reads the day’s emails at 6 pm and sends me a summary on Discord; the other audits the diff of every GitHub pull request with Claude and posts a security report as a comment.'
    },
    stack: ['n8n', 'Docker', 'Ollama', 'Claude API', 'DeepL']
  },
  {
    repo: 'Crud-security-formula1',
    title: { fr: 'CRUD Formule 1 sécurisé', en: 'Secure Formula 1 CRUD' },
    kind: { fr: 'Sécurité web', en: 'Web security' },
    tone: 'red',
    summary: {
      fr: 'Un petit site de Formule 1 avec création, lecture, modification et suppression, écrit pour pratiquer le code sécurisé : validation des entrées, authentification et protection contre l’injection SQL, le XSS et le CSRF.',
      en: 'A small Formula 1 site with full create, read, update and delete, written to practise secure coding: input validation, authentication, and protection against SQL injection, XSS and CSRF.'
    },
    stack: ['PHP', 'MySQL', 'PDO', 'CSS']
  },
  {
    repo: 'Neuron-Boxing',
    title: { fr: 'Neuron Boxing', en: 'Neuron Boxing' },
    kind: { fr: 'Recherche IA', en: 'AI research' },
    tone: 'grey',
    status: { fr: 'En cours', en: 'In progress' },
    summary: {
      fr: 'Un jeu de boxe 1v1 minimaliste conçu comme terrain d’expérience pour la neuroévolution NEAT : le but est d’observer les réseaux évoluer au fil des générations. Les règles sont figées et la simulation déterministe (30 ticks par seconde, rounds de 15 secondes) est écrite et testée ; les agents et l’entraînement arrivent ensuite.',
      en: 'A minimal 1v1 boxing game built as a test bed for NEAT neuroevolution: the point is to watch the networks develop over generations. The ruleset is frozen and the deterministic simulation (30 ticks a second, 15-second rounds) is written and tested; agents and training come next.'
    },
    stack: ['Python', 'NEAT', 'Gymnasium', 'pygame', 'pytest']
  },
  {
    repo: 'Mineral-Map',
    title: { fr: 'Cartographie minérale EDS', en: 'EDS mineral mapping' },
    kind: { fr: 'Données · Géologie', en: 'Data · Geology' },
    tone: 'grey',
    summary: {
      fr: 'Transforme 11 cartes d’éléments EDS (Si, Ti, Al, Fe…) en une carte minéralogique en couleurs : les comptages bruts sont normalisés en proportions atomiques, puis chaque pixel est rattaché au plus proche de neuf minéraux par distance euclidienne.',
      en: 'Turns 11 EDS element maps (Si, Ti, Al, Fe…) into a colour-coded mineral map: raw counts are normalised to atomic proportions and each pixel is matched to the closest of nine minerals by Euclidean distance.'
    },
    stack: ['Python', 'NumPy', 'Matplotlib', 'Jupyter']
  },
  {
    repo: 'Deck-Royale',
    title: { fr: 'Deck Royale', en: 'Deck Royale' },
    kind: { fr: 'Appli web · Équipe de 3', en: 'Web app · Team of 3' },
    tone: 'grey',
    summary: {
      fr: 'Un compagnon Clash Royale construit sur l’API officielle : parcourir toutes les cartes avec leur rareté et leur coût en élixir, tirer un deck aléatoire de 8 cartes, ou chercher un joueur par son tag pour voir son clan, son arène et son deck actuel.',
      en: 'A Clash Royale companion built on the official API: browse every card with its rarity and elixir cost, draw a random 8-card deck, or look up a player by tag to see their clan, arena and current deck.'
    },
    stack: ['Next.js', 'TypeScript', 'CSS Modules', 'REST API']
  },
  {
    repo: 'Add-on-Accessibility-Blender',
    title: { fr: 'Navigation clavier pour Blender', en: 'Keyboard navigator for Blender' },
    kind: { fr: 'Accessibilité', en: 'Accessibility' },
    tone: 'grey',
    summary: {
      fr: 'Un add-on Blender qui met plus de 200 opérations au clavier : parcourir 25 groupes thématiques, en ouvrir un et lancer une commande en quelques touches, sans souris. En bonus : Ctrl + molette agrandit l’interface sous le curseur.',
      en: 'A Blender add-on that puts 200+ operators behind the keyboard: browse 25 themed groups, open one and run a command in a few keystrokes, no mouse needed. Bonus: Ctrl + wheel scales the interface under the cursor.'
    },
    stack: ['Python', 'Blender API']
  },
  {
    repo: 'theme-enfant-Miyazaki-PSG',
    title: { fr: 'Thème WordPress PSG', en: 'PSG WordPress theme' },
    kind: { fr: 'WordPress', en: 'WordPress' },
    tone: 'grey',
    summary: {
      fr: 'Un thème enfant de Miyazaki aux couleurs du Paris Saint-Germain, avec des surcharges de styles et des modifications de templates par-dessus le thème parent.',
      en: 'A child theme of Miyazaki restyled for Paris Saint-Germain, with style overrides and template changes on top of the parent theme.'
    },
    stack: ['WordPress', 'PHP', 'CSS']
  }
];

/* Smaller projects, listed under the cards. */
export const MORE_WORK: Array<{ repo: string; title: Text; summary: Text; demo?: string }> = [
  {
    repo: 'Java-Golf',
    title: { fr: 'Java Golf', en: 'Java Golf' },
    summary: {
      fr: 'API REST Spring Boot : créer des golfeurs et des parcours, puis simuler un match entre deux joueurs.',
      en: 'Spring Boot REST API: create golfers and courses, then simulate a match between two players.'
    }
  },
  {
    repo: 'Tailwind-mobile-first',
    title: { fr: 'Tailwind mobile-first', en: 'Tailwind mobile-first' },
    summary: {
      fr: 'Une maquette refaite en mobile-first avec Vue, Nuxt et Tailwind CSS.',
      en: 'A mock-up rebuilt mobile-first with Vue, Nuxt and Tailwind CSS.'
    },
    demo: 'https://tailwind-mobile-first.vercel.app'
  },
  {
    repo: 'Emotions_Birds',
    title: { fr: 'Emotions Birds', en: 'Emotions Birds' },
    summary: {
      fr: 'Un site interactif sur les émotions façon Angry Birds : glisser un oiseau sur le lance-pierre pour passer d’un écran à l’autre.',
      en: 'An interactive Angry Birds-themed site about emotions: drag a bird onto the slingshot to travel between screens.'
    }
  },
  {
    repo: 'DRAGON-BALL-Z-CARDS',
    title: { fr: 'Cartes Dragon Ball Z', en: 'Dragon Ball Z cards' },
    summary: {
      fr: 'Un site de collection de cartes en PHP, avec comptes, boosters et page de profil.',
      en: 'A card-collecting site in PHP with accounts, booster packs and a profile page.'
    }
  },
  {
    repo: 'ACAAE',
    title: { fr: 'Site de l’ACAAE', en: 'ACAAE website' },
    summary: {
      fr: 'Refonte du site de l’ACAAE en thème WordPress sur mesure.',
      en: 'Redesign of the ACAAE website as a custom WordPress theme.'
    }
  }
];
