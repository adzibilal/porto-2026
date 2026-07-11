"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  title: string;
  desc: string;
  tags: string[];
  image: string;
  url: string;
};

function SkeletonCard() {
  return (
    <div className="project-card border border-border rounded-[14px] overflow-hidden animate-pulse">
      <div className="h-[200px] bg-[#1c1c1c]" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-[#1c1c1c] rounded w-3/4" />
        <div className="h-3 bg-[#1c1c1c] rounded w-full" />
        <div className="flex gap-2">
          <div className="h-5 bg-[#1c1c1c] rounded-full w-16" />
          <div className="h-5 bg-[#1c1c1c] rounded-full w-20" />
          <div className="h-5 bg-[#1c1c1c] rounded-full w-14" />
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : []))
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
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
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : projects.map((p) => (
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
      </div>
    </section>
  );
}
