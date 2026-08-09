export interface Project {
  id: string;
  /** Route segment for /projects/[slug]. */
  slug: string;
  title: string;
  /** One line, italic, sits directly under the title. */
  tagline: string;
  description: string;
  /** Domain label, shown as the card's badge. */
  domain: string;
  tags: string[];
  video?: string | null;
  links?: Array<{ label: string; url: string }>;
}

/** Order here is the order on the page: the two strongest lead. */
export const projects: Project[] = [
  {
    id: 'crud-security-formula1',
    slug: 'crud-security-formula1',
    title: 'Secure Formula 1 CRUD',
    tagline: 'A full CRUD app built to be attacked — and to hold.',
    description:
      'Mini Formula 1 website with full CRUD functionality, built following best practices in web development and secure coding: input validation, authentication, and protection against common web vulnerabilities (SQL injection, XSS, CSRF).',
    domain: 'Application security',
    tags: ['PHP', 'MySQL', 'PDO', 'CSS'],
    video: '/videos/crud-security-formula1.mp4',
    links: [
      {
        label: 'View source',
        url: 'https://github.com/maximilien-ilic/Crud-security-formula1'
      }
    ]
  },
  {
    id: 'themed-button-navigator-blender',
    slug: 'blender-keyboard-navigator',
    title: 'Keyboard Navigator for Blender',
    tagline: '200+ Blender operators, reachable without the mouse.',
    description:
      'A Blender addon that lets you navigate and execute operators using keyboard shortcuts. Browse through organized themes and quickly access 200+ Blender commands without touching your mouse.',
    domain: 'Developer tooling',
    tags: ['Python', 'Blender', 'Plugin'],
    video: '/videos/blender-addon.mp4',
    links: [
      {
        label: 'View source',
        url: 'https://github.com/maximilien-ilic/Add-on-Accessibility-Blender'
      }
    ]
  },
  {
    id: 'mvc-amusement-park',
    slug: 'amusement-park-booking',
    title: 'Amusement Park Booking',
    tagline: 'Bookings, schedules and capacity, on a hand-rolled MVC.',
    description:
      'Users create an account, browse available activities and reserve time slots, then manage their bookings from a personal dashboard. Admins configure activities, schedules and capacities.',
    domain: 'OOP architecture',
    tags: ['PHP', 'CSS', 'MVC', 'PDO'],
    video: '/videos/mvc-amusement-park.mp4',
    links: [
      {
        label: 'View source',
        url: 'https://github.com/Raphael-Vaxelaire/Exercice-PO'
      }
    ]
  },
  {
    id: 'theme-enfant-miyazaki-psg',
    slug: 'miyazaki-psg-child-theme',
    title: 'PSG × Miyazaki Child Theme',
    tagline: "A WordPress child theme rebuilt around a club's identity.",
    description:
      'A WordPress child theme based on the Miyazaki theme, customized for Paris Saint-Germain. Includes style overrides and template modifications tailored to the PSG branding.',
    domain: 'Web development',
    tags: ['WordPress', 'PHP', 'CSS', 'CMS'],
    video: '/videos/theme-enfant-miyazaki-psg.mp4',
    links: [
      {
        label: 'View source',
        url: 'https://github.com/maximilien-ilic/theme-enfant-Miyazaki-PSG'
      }
    ]
  }
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
