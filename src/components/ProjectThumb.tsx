/** Code-built project thumbnail — no image assets required. */

type Props = {
  title: string;
  tags?: string[];
  className?: string;
};

const PALETTES = [
  { a: "#C6FF4A", b: "#1a2e0a", c: "#F5E642" },
  { a: "#4AF5FF", b: "#0a1e2e", c: "#C6FF4A" },
  { a: "#FF4AC6", b: "#2e0a1e", c: "#F5E642" },
  { a: "#F5E642", b: "#2e2a0a", c: "#C6FF4A" },
  { a: "#7B61FF", b: "#140a2e", c: "#4AF5FF" },
  { a: "#FF8A4A", b: "#2e140a", c: "#C6FF4A" },
] as const;

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(title: string): string {
  const parts = title.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return title.slice(0, 2).toUpperCase();
}

function variant(title: string): number {
  return hash(title) % 3;
}

export default function ProjectThumb({ title, tags = [], className = "" }: Props) {
  const palette = PALETTES[hash(title) % PALETTES.length];
  const v = variant(title);
  const mono = initials(title);
  const tag = tags[0] ?? "project";

  return (
    <div
      className={`relative aspect-video overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${palette.b} 0%, #101010 55%, ${palette.b} 100%)`,
      }}
      aria-hidden
    >
      {/* diagonal hatch */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `repeating-linear-gradient(
            ${v === 0 ? "45deg" : v === 1 ? "-45deg" : "0deg"},
            transparent,
            transparent 8px,
            rgba(255,255,255,0.04) 8px,
            rgba(255,255,255,0.04) 9px
          )`,
        }}
      />

      {/* soft accent glow */}
      <div
        className="absolute -right-8 -top-8 h-40 w-40 rounded-full blur-3xl opacity-50"
        style={{ background: palette.a }}
      />
      <div
        className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full blur-3xl opacity-30"
        style={{ background: palette.c }}
      />

      {/* geometric svg accents */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 225"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {v === 0 && (
          <>
            <rect
              x="260"
              y="40"
              width="90"
              height="90"
              rx="8"
              stroke={palette.a}
              strokeWidth="1.5"
              opacity="0.55"
            />
            <rect
              x="285"
              y="65"
              width="90"
              height="90"
              rx="8"
              stroke={palette.c}
              strokeWidth="1"
              opacity="0.35"
            />
            <circle cx="70" cy="160" r="28" stroke={palette.a} strokeWidth="1.5" opacity="0.4" />
          </>
        )}
        {v === 1 && (
          <>
            <path
              d="M40 180 L120 40 L200 180 Z"
              stroke={palette.a}
              strokeWidth="1.5"
              opacity="0.45"
            />
            <circle cx="320" cy="70" r="36" stroke={palette.c} strokeWidth="1.5" opacity="0.4" />
            <line
              x1="280"
              y1="180"
              x2="380"
              y2="120"
              stroke={palette.a}
              strokeWidth="1"
              opacity="0.35"
            />
          </>
        )}
        {v === 2 && (
          <>
            <circle cx="320" cy="112" r="54" stroke={palette.a} strokeWidth="1.5" opacity="0.4" />
            <circle cx="320" cy="112" r="28" stroke={palette.c} strokeWidth="1" opacity="0.5" />
            <rect
              x="36"
              y="48"
              width="72"
              height="12"
              rx="2"
              fill={palette.a}
              opacity="0.35"
            />
            <rect
              x="36"
              y="72"
              width="48"
              height="8"
              rx="2"
              fill={palette.c}
              opacity="0.25"
            />
            <rect
              x="36"
              y="92"
              width="60"
              height="8"
              rx="2"
              fill="white"
              opacity="0.12"
            />
          </>
        )}
        {/* grid dots */}
        {Array.from({ length: 6 }).map((_, i) => (
          <circle
            key={i}
            cx={48 + i * 18}
            cy={200}
            r="1.5"
            fill={palette.a}
            opacity={0.25 + i * 0.05}
          />
        ))}
      </svg>

      {/* monogram + tag */}
      <div className="absolute inset-0 flex flex-col items-start justify-between p-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
          {tag}
        </span>
        <div className="flex w-full items-end justify-between gap-3">
          <span
            className="font-heading text-[42px] font-semibold leading-none tracking-tight"
            style={{ color: palette.a }}
          >
            {mono}
          </span>
          <span className="mb-1 max-w-[55%] truncate text-right font-mono text-[10px] lowercase text-white/40">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}
