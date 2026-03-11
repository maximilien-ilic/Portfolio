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
    image: null,
    video: 'videos/0.mp4',
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
    tags: ['WordPress', 'PHP', 'CSS','CMS'],
    image: null,
    video: '/videos/theme enfant miyazaki psg.mp4',
    links: [
      { label: 'View on GitHub', url: 'https://github.com/maximilien-ilic/theme-enfant-Miyazaki-PSG' }
    ]
  },
  {
    slug: 'themed-button-navigator-blender',
    name: 'Themed Button Navigator for Blender',
    badge: 'Add-On',
    title: 'Blender Addon — Keyboard Navigator',
    description: 'A Blender addon that lets you navigate and execute operators using keyboard shortcuts. Browse through organized themes and quickly access 200+ Blender commands without touching your mouse.',
    tags: ['Python', 'Blender', 'Plugin'],
    image: null,
    video: 'videos/addonmp4.mp4',
    links: [
      { label: 'View on GitHub', url: 'https://github.com/maximilien-ilic/Add-on-Accessibility-Blender' }
    ]
  },
  {
    slug: 'MVC-amusement-park',
    name: 'MVC project for an amusement park booking website ',
    badge: 'POO',
    title: 'amusement park booking website',
    description: 'The website lets users create an account, browse available activities in the amusement park, and reserve time slots. Each user can view and manage their bookings in a personal dashboard, while admins configure activities, schedules, and capacities.',
    tags: ['PHP', 'CSS', 'MVC','PDO'],
    image: null,
    video: 'videos/0310(1).mp4',
    links: [
      { label: 'View on GitHub', url: 'https://github.com/Raphael-Vaxelaire/Exercice-PO' }
    ]
  }  
];