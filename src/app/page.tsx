import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MarqueeSection from "@/components/MarqueeSection";
import About from "@/components/About";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <MarqueeSection />
      <About />
      <Work />
      <Experience />
      <Testimonials />
      <Contact />
    </>
  );
}
