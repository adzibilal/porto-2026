"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeScene from "./ThreeScene";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(badgeRef.current, { opacity: 0, y: -20, duration: 0.6 })
      .from(
        headlineRef.current?.querySelectorAll("span") || [],
        { opacity: 0, y: 40, stagger: 0.15, duration: 0.8 },
        "-=0.3"
      )
      .from(descRef.current, { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
      .from(
        ctaRef.current?.querySelectorAll("a") || [],
        { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 },
        "-=0.3"
      )
      .from(indicatorRef.current, { opacity: 0, duration: 0.4 }, "-=0.2");

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        const p = self.progress;
        if (badgeRef.current) {
          badgeRef.current.style.opacity = `${1 - p}`;
          badgeRef.current.style.transform = `scale(${1 - p * 0.3})`;
        }
        if (indicatorRef.current) {
          indicatorRef.current.style.opacity = `${1 - p * 2}`;
        }
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden flex flex-col items-center justify-center px-[clamp(24px,6vw,56px)] pt-[clamp(56px,12vh,120px)] pb-[72px]"
    >
      <ThreeScene />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(16,16,16,0) 0%, #101010 72%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 bg-accent text-[#101010] font-sans font-bold text-[12px] lowercase tracking-[0.02em] px-4 py-[7px] rounded-full mb-7"
        >
          <span>ticket #001</span>
          <span className="opacity-50">·</span>
          <span>available for hire</span>
        </div>

        <h1
          ref={headlineRef}
          className="font-heading font-bold text-[clamp(40px,7.5vw,84px)] leading-[0.98] text-white lowercase tracking-[-0.02em] max-w-[960px]"
        >
          <span className="block">pixel-pushing,</span>
          <span className="block">bug-squashing</span>
          <span className="block text-accent">frontend engineer</span>
        </h1>

        <p
          ref={descRef}
          className="mt-7 max-w-[520px] text-[16px] leading-[1.6] text-muted"
        >
          i build fast, expressive interfaces — from landing pages that convert
          to product UIs that don&apos;t fall apart on mobile.
        </p>

        <div ref={ctaRef} className="flex justify-center gap-[14px] mt-9 flex-wrap">
          <a
            href="#work"
            className="font-sans font-semibold lowercase px-[26px] py-[13px] rounded-full bg-accent text-[#101010] text-[14px] no-underline hover:opacity-85 transition-opacity"
          >
            see my work
          </a>
          <a
            href="#contact"
            className="font-sans font-semibold lowercase px-[26px] py-[13px] rounded-full border border-white text-white text-[14px] no-underline hover:bg-white hover:text-[#101010] transition-all"
          >
            say hi
          </a>
        </div>
      </div>

      <div
        ref={indicatorRef}
        className="absolute bottom-8 flex justify-center"
      >
        <div className="w-[22px] h-[36px] border-2 border-[rgba(255,255,255,0.3)] rounded-[12px] flex justify-center pt-[6px]">
          <div className="w-[4px] h-2 bg-accent rounded-[2px] animate-[bounce_1.6s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
