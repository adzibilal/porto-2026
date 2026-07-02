const items = ["react", "typescript", "next.js", "vue", "nuxt", "tailwind", "figma", "vite", "shadcn/ui", "framer motion"];

export default function MarqueeSection() {
  return (
    <div className="border-y border-border overflow-hidden py-[18px]">
      <div className="marquee-track">
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-12 pr-12">
            {items.map((item, idx) => (
              <span key={idx} className="flex gap-12">
                <span className="font-heading text-[22px] text-muted lowercase whitespace-nowrap">
                  {item}
                </span>
                <span className="font-heading text-[22px] text-accent-yellow whitespace-nowrap">
                  ·
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
