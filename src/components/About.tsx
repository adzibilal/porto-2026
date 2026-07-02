"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const photoRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { opacity: 0, scale: 0.8, filter: "blur(8px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: photoRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      if (badgeRef.current) {
        const badge = badgeRef.current.querySelector(".about-badge");
        if (badge) {
          gsap.fromTo(
            badge,
            { opacity: 0, scale: 0 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: badge,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.querySelectorAll("div > div"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      className="px-[clamp(24px,6vw,56px)] py-[clamp(48px,8vh,88px)] border-b border-border max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[minmax(220px,320px)_1fr] gap-12 items-center"
    >
      <div ref={photoRef} className="relative">
        <img
          src="/potrait.png"
          alt="Adzi Bilal portrait"
          className="aspect-[4/5] rounded-[16px] object-cover w-full"
        />
        <div className="absolute -top-[14px] -right-[14px] w-14 h-14 rounded-full bg-accent flex items-center justify-center font-heading font-bold text-[#101010] text-[11px] text-center leading-[1.1] -rotate-6">
          hi
          <br />
          there
        </div>
      </div>

      <div ref={badgeRef}>
        <div className="about-badge inline-flex items-center gap-2 bg-card-bg text-accent-yellow font-sans font-semibold text-[12px] lowercase tracking-[0.02em] px-[14px] py-[6px] rounded-full mb-5">
          about me
        </div>
        <TextReveal>
          <h2 className="font-heading font-semibold text-[clamp(24px,3.2vw,32px)] leading-[1.15] text-white lowercase max-w-[560px] mb-[18px]">
            i&apos;m adzi bilal, a frontend engineer based in indonesia who
            likes making the web feel less boring.
          </h2>
        </TextReveal>
        <TextReveal delay={0.15}>
          <p className="text-[16px] leading-[1.65] text-muted max-w-[560px] mb-6">
            i started out building landing pages and product UIs with plain
            html, css &amp; javascript, then moved into react and next.js as
            projects grew. these days i split my time between shipping clean,
            fast frontends and sweating over the small interaction details most
            people never notice — but always feel.
          </p>
        </TextReveal>
        <div ref={statsRef} className="flex gap-8 flex-wrap">
          <div>
            <div className="font-heading font-bold text-[26px] text-accent">
              3+
            </div>
            <div className="text-[12px] text-muted lowercase mt-[2px]">
              years building for the web
            </div>
          </div>
          <div>
            <div className="font-heading font-bold text-[26px] text-accent">
              10+
            </div>
            <div className="text-[12px] text-muted lowercase mt-[2px]">
              sites &amp; landing pages shipped
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
