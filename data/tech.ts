/* Each technology's own colour, taken from its logo or from GitHub's
   language colours, so a chip reads as that technology at a glance (PHP
   violet, Jupyter orange…). Anything not listed falls back to neutral
   grey. The text colour is picked per chip for contrast. */

const COLORS: Record<string, string> = {
  // Languages
  PHP: '#777bb4',
  Python: '#3776ab',
  'Jupyter Notebook': '#f37626',
  Jupyter: '#f37626',
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  'C#': '#178600',
  Java: '#e76f00',
  CSS: '#663399',
  SCSS: '#cc6699',
  HTML: '#e34f26',
  Vue: '#41b883',
  SQL: '#4479a1',

  // Frameworks, tools, services
  '.NET 10': '#512bd4',
  Avalonia: '#9b4dca',
  SQLite: '#0f80cc',
  'xUnit · 67 tests': '#2ba84a',
  n8n: '#ea4b71',
  Docker: '#2496ed',
  Ollama: '#ffffff',
  'Claude API': '#d97757',
  DeepL: '#0f2b46',
  MySQL: '#4479a1',
  PDO: '#8892bf',
  NumPy: '#4dabcf',
  Matplotlib: '#11557c',
  'Next.js': '#ffffff',
  'Blender API': '#e87d0d',
  WordPress: '#21759b',
  pytest: '#0a9edc',
  pygame: '#6aa84f',
  Gymnasium: '#0081a7'
};

const FALLBACK = '#3a3a40';

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const INK = '#0b0b0c';
const INK_L = luminance(INK);

/** Background and text colour for a technology chip. */
export function techColors(name: string) {
  const background = COLORS[name] ?? FALLBACK;
  const l = luminance(background);
  const color = contrast(l, 1) >= contrast(l, INK_L) ? '#ffffff' : INK;
  return { background, color };
}

/** Just the technology's colour, for a dot. */
export function techColor(name: string) {
  return COLORS[name] ?? FALLBACK;
}
