import Reveal from "./Reveal";

const skillGroups = [
  {
    title: "languages",
    items: ["html", "css", "javascript", "typescript"],
  },
  {
    title: "frameworks",
    items: ["react", "next.js", "tailwind", "bootstrap"],
  },
  {
    title: "tools",
    items: ["figma", "git", "vite", "vercel"],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="px-[clamp(24px,6vw,56px)] py-[clamp(48px,8vh,88px)] border-b border-border max-w-[1200px] mx-auto"
    >
      <Reveal>
        <div className="flex items-baseline justify-between mb-9 flex-wrap gap-[10px]">
          <h2 className="font-heading font-semibold text-[clamp(24px,3vw,28px)] text-white lowercase">
            skills &amp; tools
          </h2>
          <span className="text-[13px] text-muted lowercase">
            what i reach for daily
          </span>
        </div>
      </Reveal>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
        {skillGroups.map((group) => (
          <Reveal key={group.title}>
            <div className="border border-border rounded-[14px] p-6 hover:border-accent transition-colors duration-200">
              <h3 className="font-heading font-semibold text-[16px] text-accent-yellow lowercase mb-[14px]">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-[13px] px-[14px] py-[6px] rounded-full bg-card-bg text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
