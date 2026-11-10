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
      fr: 'J’ai repris les fonctionnalités de Diving Log 6, une application Windows dont je n’avais pas le code source, pour en faire ma propre version en C#. Le carnet stocke les plongées dans SQLite et importe les fichiers UDDF. Il affiche les profils, signale les remontées trop rapides et calcule les mélanges Nitrox, la consommation de gaz et la décompression avec Bühlmann ZH-L16C.',
      en: 'I built my own C# version of Diving Log 6 by studying the Windows app without access to its source code. It stores dives in SQLite, imports UDDF files and plots dive profiles with warnings for fast ascents. It also handles Nitrox mixes, gas consumption and decompression planning using Bühlmann ZH-L16C.'
    },
    stack: ['C#', '.NET 10', 'Avalonia', 'SQLite', 'xUnit · 67 tests'],
    featured: true
  },
  {
    repo: 'N8N',
    title: { fr: 'Mes automatisations IA', en: 'My AI workflows' },
    kind: { fr: 'Automatisation · Sécurité', en: 'Automation · Security' },
    tone: 'red',
    summary: {
      fr: 'Deux automatisations avec n8n et des agents IA : à 18 h, la première résume mes emails du jour sur Discord. La seconde examine les changements de chaque pull request avec Claude et ajoute ses remarques de sécurité en commentaire sur GitHub.',
      en: 'Two n8n workflows I use to automate routine tasks. One sends me a daily email digest on Discord at 6 pm. The other asks Claude to review the changes in each GitHub pull request and post a security report in the comments.'
    },
    stack: ['n8n', 'Docker', 'Ollama', 'Claude API', 'DeepL']
  },
  {
    repo: 'Crud-security-formula1',
    title: { fr: 'CRUD Formule 1 sécurisé', en: 'Secure Formula 1 CRUD' },
    kind: { fr: 'Sécurité web', en: 'Web security' },
    tone: 'red',
    summary: {
      fr: 'Un site de Formule 1 pour gérer des données : ajout, consultation, modification et suppression. Je l’ai conçu pour travailler la sécurité en PHP, avec authentification, validation des saisies et protections contre les injections SQL, le XSS et le CSRF.',
      en: 'A Formula 1 site where users can add, view, edit and delete records. I built it to practise secure PHP development, including authentication, input validation and protection against SQL injection, XSS and CSRF.'
    },
    stack: ['PHP', 'MySQL', 'PDO', 'CSS']
  },
  {
    repo: 'Neuron-Boxing',
    title: { fr: 'Neuron Boxing', en: 'Neuron Boxing' },
    kind: { fr: 'Expérimentation IA', en: 'AI experiments' },
    tone: 'grey',
    status: { fr: 'En cours', en: 'In progress' },
    summary: {
      fr: 'Je prépare un jeu de boxe en 1 contre 1 pour observer comment des réseaux de neurones apprennent au fil des générations avec NEAT. Les règles et la simulation sont prêtes et testées : 30 mises à jour par seconde, avec des rounds de 15 secondes. La prochaine étape sera d’ajouter les agents et leur entraînement.',
      en: 'A small one-on-one boxing game where I plan to explore how neural networks evolve with NEAT. The rules and deterministic simulation are implemented and tested, running at 30 ticks per second with 15-second rounds. Next up: adding the agents and training them.'
    },
    stack: ['Python', 'NEAT', 'Gymnasium', 'pygame', 'pytest']
  },
  {
    repo: 'Mineral-Map',
    title: { fr: 'Cartographie minérale EDS', en: 'EDS mineral mapping' },
    kind: { fr: 'Données · Géologie', en: 'Data · Geology' },
    tone: 'grey',
    summary: {
      fr: 'À partir de 11 cartes d’éléments chimiques obtenues par EDS, ce programme produit une carte des minéraux. Il convertit les mesures en proportions atomiques, puis compare chaque pixel à neuf minéraux de référence pour lui attribuer une couleur.',
      en: 'A Python tool that turns 11 EDS chemical element maps into a mineral map. It converts the raw counts to atomic proportions, then uses Euclidean distance to match each pixel to one of nine reference minerals.'
    },
    stack: ['Python', 'NumPy', 'Matplotlib', 'Jupyter']
  },
  {
    repo: 'Deck-Royale',
    title: { fr: 'Deck Royale', en: 'Deck Royale' },
    kind: { fr: 'Appli web · Équipe de 3', en: 'Web app · Team of 3' },
    tone: 'grey',
    summary: {
      fr: 'Une appli pour explorer les cartes de Clash Royale, voir leur rareté et leur coût en élixir, ou générer un deck aléatoire de 8 cartes. On peut aussi retrouver un joueur avec son tag et consulter son clan, son arène et son deck. Projet réalisé à trois avec l’API officielle.',
      en: 'A Clash Royale app we built as a team of three using the official API. Browse cards by rarity and elixir cost, generate a random eight-card deck, or look up a player’s clan, arena and current deck using their tag.'
    },
    stack: ['Next.js', 'TypeScript', 'CSS Modules', 'REST API']
  },
  {
    repo: 'Add-on-Accessibility-Blender',
    title: { fr: 'Navigation clavier pour Blender', en: 'Keyboard navigator for Blender' },
    kind: { fr: 'Accessibilité', en: 'Accessibility' },
    tone: 'grey',
    summary: {
      fr: 'Une extension pour utiliser plus de 200 commandes Blender au clavier. On parcourt 25 catégories, puis on lance la commande voulue en quelques touches. Ctrl + molette permet aussi d’agrandir la partie de l’interface sous le curseur.',
      en: 'A Blender add-on for reaching over 200 commands from the keyboard. Browse 25 categories and run an operator in a few keystrokes. Ctrl + scroll also lets you resize the interface under the cursor.'
    },
    stack: ['Python', 'Blender API']
  },
  {
    repo: 'theme-enfant-Miyazaki-PSG',
    title: { fr: 'Thème WordPress PSG', en: 'PSG WordPress theme' },
    kind: { fr: 'WordPress', en: 'WordPress' },
    tone: 'grey',
    summary: {
      fr: 'J’ai adapté le thème WordPress Miyazaki aux couleurs du PSG. Les styles et les modèles de pages sont regroupés dans un thème enfant pour conserver les personnalisations lors des mises à jour du thème d’origine.',
      en: 'I adapted the Miyazaki WordPress theme for a PSG site, keeping the custom styles and templates in a child theme so parent-theme updates leave them intact.'
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
      fr: 'Une API en Spring Boot pour gérer des golfeurs et des parcours, puis simuler un match entre deux joueurs.',
      en: 'A Spring Boot API for managing golfers and courses and simulating a match between two players.'
    }
  },
  {
    repo: 'Tailwind-mobile-first',
    title: { fr: 'Tailwind mobile-first', en: 'Tailwind mobile-first' },
    summary: {
      fr: 'Une maquette intégrée avec Vue, Nuxt et Tailwind, en commençant par les petits écrans.',
      en: 'A design implemented in Vue, Nuxt and Tailwind, starting with the mobile layout.'
    },
    demo: 'https://tailwind-mobile-first.vercel.app'
  },
  {
    repo: 'Emotions_Birds',
    title: { fr: 'Emotions Birds', en: 'Emotions Birds' },
    summary: {
      fr: 'Un site sur les émotions inspiré d’Angry Birds. On passe d’un écran à l’autre en lançant un oiseau avec le lance-pierre.',
      en: 'An Angry Birds-inspired site about emotions. Pull back the slingshot and launch a bird to move between screens.'
    }
  },
  {
    repo: 'DRAGON-BALL-Z-CARDS',
    title: { fr: 'Cartes Dragon Ball Z', en: 'Dragon Ball Z cards' },
    summary: {
      fr: 'Un site PHP pour collectionner des cartes Dragon Ball Z, avec création de compte, ouverture de boosters et profil personnel.',
      en: 'A PHP site for collecting Dragon Ball Z cards, with user accounts, booster packs to open and a personal profile.'
    }
  },
  {
    repo: 'ACAAE',
    title: { fr: 'Site de l’ACAAE', en: 'ACAAE website' },
    summary: {
      fr: 'J’ai refait le site de l’ACAAE avec un thème WordPress conçu pour l’association.',
      en: 'A rebuild of the ACAAE website with a WordPress theme made for the association.'
    }
  }
];
