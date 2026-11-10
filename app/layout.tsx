import type { Metadata, Viewport } from 'next';
import { Geist, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin']
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument',
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin']
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Maximilien Ilic',
  description:
    'Portfolio of Maximilien Ilic, fullstack developer and cybersecurity student at IIM Digital School.'
};

/* The phone's browser bar takes the page's darkest colour instead of
   flashing white above the hero. */
export const viewport: Viewport = {
  themeColor: '#050507'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Turns the scroll reveals on before first paint, unless the visitor
            asked for reduced motion. Without it, nothing is ever hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reveal-on')"
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
