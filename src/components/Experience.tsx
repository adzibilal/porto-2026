"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

const entries = [
  {
    period: "Jan 2025 — Present",
    title: "Acclime",
    subtitle: "Frontend Developer · Full-time · Hybrid · South Jakarta",
    dot: "bg-accent",
  },
  {
    period: "Oct 2023 — Jan 2025",
    title: "PT Motiolabs Digital Indonesia",
    subtitle: "Frontend Developer · Contract · On-site · Bandung",
    desc: "JavaScript · Vue.js",
    dot: "bg-accent",
  },
  {
    period: "Jul 2022 — Oct 2023",
    title: "PT Jumpa Daring Indonesia",
    subtitle: "Frontend Developer · Contract",
    dot: "bg-accent-yellow",
  },
  {
    period: "Oct 2019 — Dec 2022",
    title: "Bara Enterprise",
    subtitle: "Frontend Developer · Contract · Bandung",
    dot: "bg-accent",
  },
];

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = timelineRef.current?.querySelectorAll(".timeline-item");
      if (!items) return;

      gsap.fromTo(
        items,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      className="px-[clamp(24px,6vw,56px)] py-[clamp(48px,8vh,88px)] border-b border-border max-w-[900px] mx-auto"
    >
      <TextReveal>
        <h2 className="font-heading font-semibold text-[clamp(24px,3vw,28px)] text-white lowercase mb-10">
          experience
        </h2>
      </TextReveal>

      <div ref={timelineRef} className="flex flex-col">
        {entries.map((e, i) => (
          <div
            key={i}
            className="timeline-item grid grid-cols-[140px_20px_1fr] gap-0 pb-10 relative"
          >
            <div className="text-[13px] text-muted pt-[2px]">{e.period}</div>
            <div className="flex flex-col items-center">
              <div
                className={`w-[10px] h-[10px] rounded-full ${e.dot} flex-none`}
              />
              {i < entries.length - 1 && (
                <div className="w-[1px] flex-1 bg-border mt-1" />
              )}
            </div>
            <div className="pl-4">
              <div className="font-heading font-semibold text-[19px] text-white mb-[6px]">
                {e.title}
              </div>
              {e.subtitle && (
                <div className="text-[14px] leading-[1.6] text-muted">
                  {e.subtitle}
                </div>
              )}
              {(e as any).desc && (
                <div className="text-[14px] leading-[1.6] text-muted mt-1">
                  {(e as any).desc}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
