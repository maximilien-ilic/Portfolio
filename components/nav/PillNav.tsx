'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import styles from './PillNav.module.css';

const ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' }
];

/* Three pills, fixed at the top. The lit one follows the scroll position;
   clicking scrolls to the section smoothly. */
export default function PillNav() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    // The lit pill is the last section whose top has passed the middle of
    // the screen. Projects belong to About: they have no pill of their own.
    const owners: Array<[string, string]> = [
      ['home', 'home'],
      ['about', 'about'],
      ['projects', 'about'],
      ['contact', 'contact']
    ];
    const update = () => {
      const middle = window.innerHeight * 0.5;
      let current = 'home';
      for (const [id, pill] of owners) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= middle) current = pill;
      }
      // The contact section is short: at the very bottom of the page it may
      // never reach the middle, so the end of the page counts as contact.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = 'contact';
      }
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <nav className={styles.nav} aria-label="Sections">
      <ul className={styles.pills}>
        {ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={styles.pill}
              aria-current={active === item.id ? 'true' : undefined}
            >
              {active === item.id && (
                <motion.span
                  layoutId="pill"
                  className={styles.lit}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className={styles.label}>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
