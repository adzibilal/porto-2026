"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll(".contact-reveal");
      if (!els) return;
      gsap.fromTo(
        els,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="px-[clamp(24px,6vw,56px)] pt-[clamp(64px,10vh,120px)] pb-10 text-center max-w-[900px] mx-auto"
    >
      <div className="contact-reveal">
        <div className="inline-flex items-center gap-2 bg-accent-yellow text-[#101010] font-sans font-bold text-[12px] lowercase tracking-[0.02em] px-4 py-[7px] rounded-full mb-6">
          got a project?
        </div>
      </div>

      <div className="contact-reveal">
        <h2 className="font-heading font-bold text-[clamp(32px,5.5vw,56px)] leading-[1.05] text-white lowercase mb-6">
          let&apos;s build something<br />
          <span className="text-accent">people click.</span>
        </h2>
      </div>

      <div className="contact-reveal">
        <a
          href="https://wa.me/6287778100941"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-sans font-semibold lowercase px-[30px] py-[14px] rounded-full bg-accent text-[#101010] text-[15px] no-underline mb-9 hover:opacity-85 transition-opacity"
        >
          say hi on whatsapp
        </a>
      </div>

      <div className="flex justify-center gap-6 mb-12">
        <a
          href="https://github.com/adzibilal"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-muted lowercase no-underline hover:text-white transition-colors"
        >
          github
        </a>
        <a
          href="https://www.linkedin.com/in/adzibilal/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-muted lowercase no-underline hover:text-white transition-colors"
        >
          linkedin
        </a>
        <a
          href="https://www.threads.com/@adzibilal_"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-muted lowercase no-underline hover:text-white transition-colors"
        >
          threads
        </a>
      </div>

      <div className="border-t border-border pt-6 text-[12px] text-subtle lowercase">
        © 2026 adzi bilal. built with next.js &amp; a lot of coffee.
      </div>
    </section>
  );
}
