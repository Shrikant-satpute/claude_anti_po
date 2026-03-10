import Hero from '@/components/Hero';
import About from '@/components/About';
import SkillsConstellation from '@/components/SkillsConstellation';
import Timeline from '@/components/Timeline';
import Projects from '@/components/Projects';
import CurrentProject from '@/components/CurrentProject';
import Education from '@/components/Education';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="min-h-screen text-foreground selection:bg-primary/30 selection:text-white">
      {/* 
        The top-level components construct the single page application.
        All animations are handled individually inside section components via framer-motion or gsap.
      */}
      <Hero />
      <About />
      <SkillsConstellation />
      <Timeline />
      <Projects />
      <CurrentProject />
      <Education />
      <Contact />
    </main>
  );
}
