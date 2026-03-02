export interface Project {
  slug: string;
  name: string;
  badge: string;
  title: string;
  description: string;
  tags?: string[];
  image?: string | null;
  video?: string | null;
  links?: Array<{ label: string; url: string }>;
}

export const projects: Project[] = [
  {
    slug: 'crud-security-formula1',
    name: 'Crud-security-formula1',
    badge: 'cybersecurity',
    title: 'Secure Formula 1 CRUD Website',
    description: 'Mini Formula 1 website with full CRUD functionality, built following best practices in web development and secure coding (input validation, authentication, and protection against common web vulnerabilities: SQL injection, XSS, CSRF).',
    tags: ['PHP', 'MySQL', 'PDO', 'CSS'],
    image: 'images/formule1.png',
    video: null,
    links: [
      { label: 'View on GitHub', url: 'https://github.com/maximilien-ilic/Crud-security-formula1' }
    ]
  },
  {
    slug: 'theme-enfant-miyazaki-psg',
    name: 'theme-enfant-Miyazaki-PSG',
    badge: 'web development',
    title: 'WordPress Child Theme — PSG x Miyazaki',
    description: 'A WordPress child theme based on the Miyazaki theme, customized for Paris Saint-Germain. Includes style overrides and template modifications tailored to the PSG branding.',
    tags: ['WordPress', 'PHP', 'CSS'],
    image: null,
    video: '/videos/theme enfant miyazaki psg.mp4',
    links: [
      { label: 'View on GitHub', url: 'https://github.com/maximilien-ilic/theme-enfant-Miyazaki-PSG' }
    ]
  },
  {
    slug: 'themed-button-navigator-blender',
    name: 'Themed Button Navigator for Blender',
    badge: 'open source',
    title: 'Blender Addon — Keyboard Navigator',
    description: 'A Blender addon that lets you navigate and execute operators using keyboard shortcuts. Browse through organized themes and quickly access 200+ Blender commands without touching your mouse.',
    tags: ['Python', 'Blender', 'Add-on'],
    image: null,
    video: 'videos/addonmp4.mp4',
    links: [
      { label: 'View on GitHub', url: 'https://github.com/maximilien-ilic/Add-on-Accessibility-Blender' }
    ]
  }
];