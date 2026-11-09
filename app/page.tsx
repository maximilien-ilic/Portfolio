import About from '@/components/about/About';
import ColorField from '@/components/background/ColorField';
import Contact from '@/components/contact/Contact';
import Hero from '@/components/hero/Hero';
import PillNav from '@/components/nav/PillNav';
import Projects from '@/components/projects/Projects';
import RevealObserver from '@/components/reveal/RevealObserver';

export default function Home() {
  return (
    <>
      <ColorField />
      <PillNav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <RevealObserver />
    </>
  );
}
