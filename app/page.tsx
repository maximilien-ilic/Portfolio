import { div, h1, header } from "motion/react-client";
import Image from "next/image";
import Card from '@/components/Card';
import { projects } from '@/data/projects';
import Footer from '@/components/Footer';
import styles from './page.module.css'
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
    <Navbar />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Maximilien Ilic</h1>
          
          <h2 className={styles.subtitle}>
            Web Developer | Cybersecurity Student
          </h2>
          
          <p className={styles.description}>
            I'm a cybersecurity student with a passion for web development. 
            I combine technical expertise with creative problem-solving to build 
            secure, scalable applications and explore the intersection of security 
            and modern web technologies.
          </p>
          
          <p className={styles.cta}>
            Interested in cybersecurity or AI/web development? Let's talk.
          </p>
          
          <div className={styles.contact}>
            <div className={styles.contactItem}>
              <span className={styles.label}>github:</span>
              <a href="https://github.com/maximilien-ilic">@maximilien-ilic</a>
            </div>
            
            <div className={styles.contactItem}>
              <span className={styles.label}>email:</span>
              <a href="mailto:maximilien.ilic@gmail.com">maximilien.ilic@gmail.com</a>
            </div>
          </div>
        </header>
      </div>
      <div id="projects">
        <Card projects={projects} showTitle={true} />
      </div>
      <div id="contact">
        <Footer />
      </div>      
    </>
    
  );
}