import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.links}>
        <li><a href="#projects" className={styles.link}>Projects</a></li>
        <li><a href="https://github.com/maximilien-ilic" target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub</a></li>
        <li><a href="#contact" className={styles.link}>Contact</a></li>
      </ul>
    </nav>
  );
}