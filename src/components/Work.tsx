"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

const fallback = [
  {
    title: "bara enterprise · landing page",
    desc: "html · css · javascript · agency landing page",
    tags: ["frontend", "marketing"],
    image: "",
    url: "",
  },
  {
    title: "saas analytics dashboard",
    desc: "react · typescript · data viz",
    tags: ["product", "dashboard"],
    image: "",
    url: "",
  },
  {
    title: "mobile app landing page",
    desc: "next.js · tailwind · marketing site",
    tags: ["frontend", "marketing"],
    image: "",
    url: "",
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState(fallback);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => { if (data.length > 0) setProjects(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards.querySelectorAll(".project-card"),
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, [projects]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="px-[clamp(24px,6vw,56px)] py-[clamp(48px,8vh,88px)] border-b border-border max-w-[1200px] mx-auto"
    >
      <TextReveal>
        <div className="flex items-baseline justify-between mb-9 flex-wrap gap-[10px]">
          <h2 className="font-heading font-semibold text-[clamp(24px,3vw,28px)] text-white lowercase">
            selected work
          </h2>
          <span className="text-[13px] text-muted lowercase">{String(projects.length).padStart(2, "0")} projects</span>
        </div>
      </TextReveal>

      <div ref={cardsRef} className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
        {projects.map((p, i) => (
          <a
            key={p.title}
            href={p.url || undefined}
            target={p.url ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`project-card block border border-border rounded-[14px] overflow-hidden transition-colors duration-200 group ${p.url ? "hover:border-accent cursor-pointer" : "cursor-default"}`}
          >
            <div className="relative h-[200px] bg-[repeating-linear-gradient(45deg,#1c1c1c,#1c1c1c_10px,#181818_10px,#181818_20px)] flex items-center justify-center font-mono text-[11px] text-subtle overflow-hidden">
              {p.image ? (
                <Image src={p.image} alt={p.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
              ) : (
                "project screenshot"
              )}
              {p.url && (
                <div className="absolute inset-0 bg-[rgba(198,255,74,0.9)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                  <span className="font-sans font-bold text-[#101010] text-[14px] lowercase">
                    view project →
                  </span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-heading font-semibold text-[19px] text-white lowercase mb-[6px]">
                {p.title}
              </h3>
              <p className="text-[13px] text-muted mb-3">{p.desc}</p>
              <div className="flex gap-2">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-[10px] py-[4px] rounded-full bg-card-bg text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}

        <div className="project-card border border-dashed border-[rgba(255,255,255,0.25)] rounded-[14px] flex items-center justify-center min-h-[200px] hover:border-accent transition-colors duration-200">
          <div className="text-center p-5">
            <div className="font-mono text-[12px] text-subtle mb-[6px]">
              + add project
            </div>
            <div className="text-[13px] text-muted">
              drop your 4th case study here
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
