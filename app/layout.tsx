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
    'Portfolio de Maximilien Ilic, développeur fullstack et étudiant en cybersécurité à l’IIM Digital School.'
};

/* The phone's browser bar takes the page's darkest colour instead of
   flashing white above the hero. */
export const viewport: Viewport = {
  themeColor: '#050507'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      data-lang="fr"
      className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: turns the scroll reveals on (unless the
            visitor asked for reduced motion — without it nothing is ever
            hidden), and restores the language chosen on a previous visit
            (French by default). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var h=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches)h.classList.add('reveal-on');try{if(localStorage.getItem('lang')==='en'){h.dataset.lang='en';h.lang='en'}}catch(e){}"
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
