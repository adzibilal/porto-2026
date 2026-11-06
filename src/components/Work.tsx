"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextReveal";
import ProjectThumb from "./ProjectThumb";
import { projects, type Project } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

/** a project earns a detail page once it has any case-study content */
function hasDetail(p: Project) {
  return !!(p.problem || p.approach || p.result || p.images?.length);
}

function Card({ p }: { p: Project }) {
  const detail = hasDetail(p);
  const href = detail ? `/work/${p.slug}` : p.url;
  const linked = !!href;

  const body = (
    <>
      <div className="relative overflow-hidden">
        <ProjectThumb title={p.title} tags={p.tags} />
        {linked && (
          <div className="absolute inset-0 bg-[rgba(198,255,74,0.9)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
            <span className="font-sans font-bold text-[#101010] text-[14px] lowercase">
              {detail ? "read case study →" : "view project →"}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading font-semibold text-[19px] text-white lowercase mb-[6px]">
          {p.title}
        </h3>
        <p className="text-[13px] text-muted mb-3">{p.desc}</p>
        <div className="flex flex-wrap gap-2">
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
    </>
  );

  const cls = `project-card block border border-border rounded-[14px] overflow-hidden transition-colors duration-200 group ${
    linked ? "hover:border-accent cursor-pointer" : "cursor-default"
  }`;

  if (detail) {
    return (
      <Link href={href} className={cls}>
        {body}
      </Link>
    );
  }

  return (
    <a
      href={href || undefined}
      target={href ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={cls}
    >
      {body}
    </a>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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
  }, []);

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
          <span className="text-[13px] text-muted lowercase">
            {String(projects.length).padStart(2, "0")} projects
          </span>
        </div>
      </TextReveal>

      <div ref={cardsRef} className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
        {projects.map((p) => (
          <Card key={p.slug} p={p} />
        ))}
      </div>
    </section>
  );
}
