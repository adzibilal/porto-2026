"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import TextReveal from "./TextReveal";

const testimonials = [
  {
    name: "Cheppy Andriyana",
    role: "Fullstack Developer @ Bara Prima Multi Teknovasi",
    quote: "Across three years working together, Adzi consistently delivered standout UI/UX solutions with speed, precision, and a deep understanding of the product vision.",
    rating: 5,
  },
  {
    name: "Rivansyah Ahmadien",
    role: "CTO @ Vidya Indonesia Prima",
    quote: "Adzi is quick to respond, tuned in to business priorities, and able to translate product vision into clean, usable interfaces that keep teams aligned.",
    rating: 5,
  },
  {
    name: "Rahman Faruq Rajabiyansyahr",
    role: "UI/UX Designer @ PT MENCETAK BANYAK GOL",
    quote: "Working with Adzi is always positive. His design taste is sharp, he works smart, and he shares practical tips that streamline the entire team\u2019s workflow.",
    rating: 5,
  },
  {
    name: "Rizki Awanta Jordhie",
    role: "Consultant @ SMP",
    quote: "Adzi brings clear vision and strong problem-solving skills to every challenge, keeping collaboration smooth while balancing big-picture strategy with technical detail.",
    rating: 5,
  },
  {
    name: "Dwi",
    role: "Frontend Developer @ Jumpa Daring Indonesia",
    quote: "Working with Adzi was a positive experience overall. He quickly addressed communication gaps, stayed collaborative, and kept the process efficient through open feedback loops.",
    rating: 5,
  },
  {
    name: "Ihsan Fajar Ramadhan",
    role: "Project Manager @ Lontarlab Foundation",
    quote: "Brainstorming with Adzi is energizing\u2014he brings passion, turns ambitious ideas into real solutions, and keeps the whole team inspired throughout delivery.",
    rating: 5,
  },
  {
    name: "Nur Sasongko",
    role: "Full Stack Web Dev @ Motiolabs",
    quote: "Partnering with Adzi is always a pleasure. He keeps learning, adapts quickly, and stays a dependable teammate through every sprint and delivery milestone.",
    rating: 5,
  },
  {
    name: "Risman",
    role: "Fullstack Developer @ Motiolabs",
    quote: "Adzi works fast without sacrificing quality. His pace and reliability were crucial on our Project Muda Kerja initiatives.",
    rating: 5,
  },
  {
    name: "Arie Lesmana Hidayat",
    role: "System Analyst @ PT Motiolabs Digital Indonesia",
    quote: "Over two years collaborating, Adzi kept surprising us with fast learning, fresh ideas, and steady delivery we could depend on.",
    rating: 5,
  },
  {
    name: "Putri Puspita",
    role: "Business Development Manager @ PT Motiolabs Digital Indonesia",
    quote: "Adzi shows real hunger to learn. Even on brief engagements, he absorbs requirements quickly and turns them into thoughtful execution.",
    rating: 5,
  },
  {
    name: "Andika Rizki Ramdani",
    role: "Frontend Developer @ Aestech",
    quote: "There is always something new to learn from Adzi. He thrives on exploration, stays detail-oriented, and elevates the team\u2019s standards.",
    rating: 5,
  },
  {
    name: "Dyky Jaka Maulana",
    role: "Human Capital @ PT. Swamedia Informatika",
    quote: "Adzi brings energy, accountability, and a genuine willingness to grow. His skill set keeps expanding, and his dedication stands out.",
    rating: 5,
  },
  {
    name: "Kevin Naserwan",
    role: "Fullstack Developer @ Hashmicro",
    quote: "Working with Adzi was excellent. He blends attention to detail with proactive communication, turning complex requirements into clean, user-friendly interfaces that surpassed our goals.",
    rating: 4,
  },
  {
    name: "Saldi Supriadi",
    role: "Project Manager",
    quote: "Adzi brings a balanced approach\u2014steady communication, accountable ownership, and outcomes that keep stakeholders satisfied.",
    rating: 4,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${i <= count ? "text-accent-yellow" : "text-[rgba(255,255,255,0.15)]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="w-[340px] flex-none border border-border rounded-[14px] p-5 flex flex-col justify-between hover:border-accent transition-colors duration-200">
      <Stars count={t.rating} />
      <p className="text-[13px] leading-[1.6] text-muted mt-3">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="mt-3 pt-3 border-t border-border">
        <div className="font-heading font-semibold text-[13px] text-white">
          {t.name}
        </div>
        <div className="text-[11px] text-muted mt-0.5">{t.role}</div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const mid = Math.ceil(testimonials.length / 2);
  const row1 = testimonials.slice(0, mid);
  const row2 = testimonials.slice(mid);

  const trackARef = useRef<HTMLDivElement>(null);
  const trackBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const speed = 50;
      if (trackARef.current) {
        gsap.set(trackARef.current, { xPercent: -50 });
        gsap.to(trackARef.current, {
          xPercent: 0,
          duration: speed,
          ease: "none",
          repeat: -1,
        });
      }
      if (trackBRef.current) {
        gsap.to(trackBRef.current, {
          xPercent: -50,
          duration: speed,
          ease: "none",
          repeat: -1,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-[clamp(48px,8vh,88px)] border-b border-border overflow-hidden">
      <TextReveal>
        <h2 className="font-heading font-semibold text-[clamp(24px,3vw,28px)] text-white lowercase mb-9 text-center">
          what people say
        </h2>
      </TextReveal>

      <div className="flex flex-col gap-5">
        <div className="flex gap-4 overflow-hidden">
          <div ref={trackARef} className="flex gap-4">
            {[...row1, ...row1].map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          <div ref={trackBRef} className="flex gap-4">
            {[...row2, ...row2].map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
