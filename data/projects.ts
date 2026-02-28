// data/projects.ts
export interface Project {
  slug: string;
  name: string;
  badge: string;
  title: string;
  description: string;
  tags?: string[];
  image?: string | null;
  video?: string | null;
  icon?: string | null;
  links?: Array<{ label: string; url: string }>;
}

export const projects: Project[] = [
  {
    slug: 'your-project-1',
    name: 'Project Name',
    badge: 'open source',
    title: 'Short project title',
    description: 'A detailed description of your project. Explain what it does, the technologies you used, and why you built it.',
    tags: ['react', 'nextjs', 'typescript'],
    video: '/videos/griddy.mp4',  // Utilisez video au lieu de image
    image: null,
    icon: null,
    links: [
      { label: 'View on GitHub', url: 'https://github.com/maximilien-ilic/...' },
      { label: 'Live Demo', url: '#' }
    ]
  },
  {
    slug: 'your-project-2',
    name: 'Another Project',
    badge: 'cybersecurity',
    title: 'Security-focused application',
    description: 'Another project description highlighting your cybersecurity skills.',
    tags: ['python', 'security', 'networking'],
    image: null,
    video: null,
    icon: '🛡️',
    links: [
      { label: 'View on GitHub', url: 'https://github.com/maximilien-ilic/...' }
    ]
  },
  {
    slug: 'your-project-3',
    name: 'Third Project',
    badge: 'web development',
    title: 'Full-stack application',
    description: 'Description of your third project.',
    tags: ['nodejs', 'express', 'mongodb'],
    image: '/images/project3.jpg',  // Ou utilisez image
    video: null,
    icon: null,
    links: [
      { label: 'View Source', url: '#' }
    ]
  }
];