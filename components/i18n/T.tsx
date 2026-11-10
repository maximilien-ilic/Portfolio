import type { ReactNode } from 'react';

/* Both languages live in the HTML; one CSS rule (globals.css, "Languages")
   shows the one set on <html data-lang>. Switching is instant, costs no
   JavaScript per string, and works in server components. */

export type Lang = 'fr' | 'en';

/** A string (or bit of markup) in both languages. */
export interface Text {
  fr: ReactNode;
  en: ReactNode;
}

export default function T({ fr, en }: Text) {
  return (
    <>
      <span lang="fr" data-l="fr">
        {fr}
      </span>
      <span lang="en" data-l="en">
        {en}
      </span>
    </>
  );
}

/** Short date in each language, e.g. « 4 nov. 2026 » / « 4 Nov 2026 ». */
export function DateT({ iso, year = true }: { iso: string; year?: boolean }) {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', ...(year ? { year: 'numeric' } : {}) };
  return <T fr={d.toLocaleDateString('fr-FR', opts)} en={d.toLocaleDateString('en-GB', opts)} />;
}
