import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Sans, Martian_Mono } from 'next/font/google';
import { NAME, ROLE, SUMMARY } from '@/data/site';
import './globals.css';

/* Display has hand-cut, slightly irregular contours — the chunky character
   the reference frames carry. Body stays quiet. Mono is the instrument
   readout and never appears above 13px. */
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap'
});

const body = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap'
});

const mono = Martian_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata: Metadata = {
  title: `${NAME} — ${ROLE}`,
  description: SUMMARY,
  openGraph: {
    title: `${NAME} — ${ROLE}`,
    description: SUMMARY,
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      /* The head script writes data-intro and data-stage onto this element
         before React hydrates, so the server's markup and the live DOM
         legitimately differ here. Suppression reaches one level only, which
         is exactly the depth of that difference. */
      suppressHydrationWarning
    >
      <head>
        {/* Decides the dawn before first paint. A returning visitor, or
            anyone who asked for less motion, must never catch a frame of a
            title card that is about to remove itself — which is a call only
            the client can make, and only before the first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('greatsea.opening')||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.intro='skip';document.documentElement.dataset.stage='ready'}}catch(e){document.documentElement.dataset.stage='ready'}`
          }}
        />
      </head>
      <body>
        <a className="skipLink" href="#projects">
          Skip to projects
        </a>
        {children}
      </body>
    </html>
  );
}
