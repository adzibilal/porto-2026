"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const links = [
  { href: "#work", label: "work" },
  { href: "#about", label: "about" },
  { href: "#contact", label: "contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[clamp(24px,5vw,56px)] py-5 transition-all duration-300 ${scrolled ? "bg-[rgba(16,16,16,0.75)] backdrop-blur-md border-b border-border" : "bg-transparent border-transparent"}`}
    >
      <a
        href="#"
        className="font-heading font-bold text-[19px] text-white lowercase tracking-[-0.02em]"
      >
        adzi bilal
      </a>

      <div className="hidden md:flex items-center gap-[clamp(16px,3vw,32px)]">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-[13px] text-muted lowercase tracking-[0.02em] no-underline hover:text-white transition-colors"
          >
            {l.label}
          </a>
        ))}
        <a
          href="https://wa.me/6287778100941"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans font-semibold lowercase px-5 py-[9px] rounded-full border border-white text-white text-[13px] no-underline hover:bg-white hover:text-[#101010] transition-all"
        >
          resume
        </a>
      </div>

      <button
        className="md:hidden text-white text-xl"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#101010] border-b border-border flex flex-col items-center gap-4 py-6 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[13px] text-muted lowercase no-underline hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/6287778100941"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans font-semibold lowercase px-5 py-[9px] rounded-full border border-white text-white text-[13px] no-underline hover:bg-white hover:text-[#101010] transition-all"
          >
            resume
          </a>
        </div>
      )}
    </nav>
  );
}
