# Design System

Visual language extracted from `porto-2026`. Styling only — tokens, type, spacing,
motion. Portable: nothing here depends on this project's data or routes.

Stack it assumes: **Tailwind v4** (`@theme inline`), **GSAP + ScrollTrigger**, **Lenis**.
Everything except the GSAP recipes works with plain CSS.

---

## 1. Character

Four rules carry the whole look. Break these and it stops being this system:

1. **Near-black canvas, one acid accent.** `#101010` everywhere, lime `#C6FF4A` used
   sparingly enough that it still reads as an event.
2. **Everything is lowercase.** Headings, buttons, nav, labels, footer. The only
   uppercase in the system is the mono micro-label.
3. **Fluid type, no breakpoints.** Every display size is a `clamp()`. Layout has
   breakpoints; type does not.
4. **Hairline borders instead of shadows.** There is not a single `box-shadow`.
   Separation comes from `1px` white-at-12% lines.

---

## 2. Color

```css
@theme inline {
  --color-background:   #101010;  /* page canvas */
  --color-foreground:   #ededed;
  --color-accent:       #C6FF4A;  /* lime — primary action, active state, highlight */
  --color-accent-yellow: #F5E642; /* warm yellow — secondary accent, ratings */
  --color-muted:        #B8B8B8;  /* body copy on dark */
  --color-subtle:       #666;     /* meta, timestamps, placeholders */
  --color-border:       rgba(255, 255, 255, 0.12);
  --color-card-bg:      rgba(255, 255, 255, 0.08);
}
```

| Token | Use it for | Never |
|---|---|---|
| `accent` | primary button fill, one word in a headline, active toggle, links on hover, progress bar | large fills, body text |
| `accent-yellow` | second badge variant, star ratings, marquee separators | next to `accent` in the same component |
| `muted` | all paragraph text | headings |
| `subtle` | captions, mono labels, placeholders | anything that must be read |
| `border` | every divider, card outline, input outline | — |
| `card-bg` | tag/pill background only | card surfaces (those use border + transparent) |

**Text on accent is always `#101010`, never white.** Lime at that luminance fails
contrast against white.

Semantic colors sit outside the theme and use Tailwind defaults at low opacity:
`amber-400` on `amber-400/5` for warnings, `red-400` for destructive.

### Depth

Surfaces are near-black steps, not grays:

```
#101010  page
#121212  recessed / disabled row
#151515  raised card in a form
#1c1c1c  input field, image placeholder
```

Sticky headers use `bg-[#101010]/95` + `backdrop-blur`.

---

## 3. Typography

```ts
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

const sans = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });
```

```css
--font-sans:    var(--font-plus-jakarta), system-ui, sans-serif;
--font-heading: var(--font-plus-jakarta), system-ui, sans-serif;
--font-mono:    var(--font-jetbrains), "JetBrains Mono", monospace;
```

One family does display and body; weight and tracking do the separating. `--font-heading`
is a seam left open for a future display face — keep using it on headings so swapping
one line changes every heading.

### Scale

| Role | Size | Leading | Weight | Tracking |
|---|---|---|---|---|
| Hero | `clamp(40px, 7.5vw, 84px)` | `0.98` | 700 | `-0.02em` |
| Page title / CTA | `clamp(32px, 5.5vw, 56px)` | `1.05` | 700 | — |
| Sub-headline | `clamp(24px, 3.2vw, 32px)` | `1.15` | 600 | — |
| Section heading | `clamp(24px, 3vw, 28px)` | — | 600 | — |
| Stat figure | `26px` | — | 700 | — |
| Marquee item | `22px` | — | 400 | — |
| Card title | `19px` | — | 600 | — |
| Body | `16px` | `1.6`–`1.65` | 400 | — |
| Long-form body | `15px` | `1.75` | 400 | — |
| Card body / meta | `13px` | `1.6` | 400 | — |
| Caption | `11–12px` | — | 400 | — |
| **Mono label** | `10–11px` | — | 400 | `0.12–0.14em` **uppercase** |

Negative tracking only above ~40px. Positive tracking (`0.02em`) on small lowercase
pills. Wide tracking is reserved for the mono label.

### The mono label

The system's one uppercase element. It labels a block of content and is usually accent-colored:

```html
<h2 class="font-mono text-[11px] uppercase tracking-[0.14em] text-accent mb-3">the problem</h2>
```

Long-form body under it caps at `max-w-[68ch]`.

---

## 4. Layout & spacing

### Containers

| Width | For |
|---|---|
| `1200px` | wide sections (work grid, about) |
| `1000px` | long-form reading page |
| `900px` | timeline, centered CTA |
| `768px` (`3xl`) | forms |

### Section rhythm

```html
<!-- standard section -->
class="px-[clamp(24px,6vw,56px)] py-[clamp(48px,8vh,88px)] border-b border-border max-w-[1200px] mx-auto"
```

- Horizontal padding is **always** `clamp(24px, 6vw, 56px)`. Reuse it verbatim so
  every section's left edge lines up.
- Vertical `clamp(48px, 8vh, 88px)` — note `vh`, so the rhythm breathes with viewport
  height, not width.
- Hero opens wider: `pt-[clamp(56px,12vh,120px)]`. Closing CTA: `pt-[clamp(64px,10vh,120px)]`.
- `border-b border-border` on each section is the only separator. No spacers, no dividers.

### Card grid

```html
class="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6"
```

Auto-fit, no breakpoints. `320px` is the floor where a card title still fits on one line.

### Radius

| Value | Applied to |
|---|---|
| `rounded-full` | buttons, badges, tags, dots, toggles |
| `16px` | portrait / feature image |
| `14px` | content card |
| `12px` | scroll indicator |
| `10px` | gallery thumbnail |
| `8px` (`rounded-lg`) | form input, small button |
| `6px` (`rounded-md`) | list thumbnail |

Bigger surface, bigger radius — and anything interactive-and-small is a full pill.

---

## 5. Components

### Buttons

```html
<!-- primary -->
class="font-sans font-semibold lowercase px-[26px] py-[13px] rounded-full bg-accent
       text-[#101010] text-[14px] hover:opacity-85 transition-opacity"

<!-- outline -->
class="font-sans font-semibold lowercase px-[26px] py-[13px] rounded-full border
       border-white text-white text-[14px] hover:bg-white hover:text-[#101010] transition-all"

<!-- compact (nav) -->
class="... px-5 py-[9px] text-[13px] ..."
```

Primary hover is `opacity-85`, never a color shift. Outline hover **inverts** to solid white.

### Badge / pill

```html
<!-- accent — announces something -->
class="inline-flex items-center gap-2 bg-accent text-[#101010] font-sans font-bold
       text-[12px] lowercase tracking-[0.02em] px-4 py-[7px] rounded-full"

<!-- quiet — categorises -->
class="text-[11px] px-[10px] py-[4px] rounded-full bg-card-bg text-muted"
```

Separate segments inside a badge with a `·` at `opacity-50`.

### Card

```html
class="block border border-border rounded-[14px] overflow-hidden
       transition-colors duration-200 group hover:border-accent"
```

Border-only, transparent fill. Hover moves the **border** to accent — never the fill.

Media area gets a diagonal-stripe placeholder while empty:

```html
class="relative aspect-video bg-[repeating-linear-gradient(45deg,#1c1c1c,#1c1c1c_10px,#181818_10px,#181818_20px)]
       flex items-center justify-center font-mono text-[11px] text-subtle overflow-hidden"
```

Full-bleed accent hover overlay, revealed by the card's `group`:

```html
class="absolute inset-0 bg-[rgba(198,255,74,0.9)] flex items-center justify-center
       opacity-0 group-hover:opacity-100 transition-opacity duration-250"
```

### Form controls

```ts
const input =
  "w-full bg-[#1c1c1c] border border-border rounded-lg p-2.5 text-white text-sm " +
  "placeholder:text-subtle focus:border-accent focus:outline-none transition-colors";

const label = "block font-mono text-[10px] uppercase tracking-[0.12em] text-subtle mb-1.5";
```

Focus replaces the outline with an accent border — no ring, no glow.

### Toggle

```html
<button role="switch" class="w-11 h-6 relative rounded-full transition-colors
        [aria-checked=true]:bg-accent bg-white/15">
  <span class="absolute top-1/2 left-1 -translate-y-1/2 w-4 h-4 rounded-full
               transition-transform bg-white/70 /* on: bg-[#101010] translate-x-5 */" />
</button>
```

Off state is `white/15`, on is `accent` with a **dark** knob.

### Dropzone

```html
class="relative rounded-lg border border-dashed border-border transition-colors
       /* drag-over: */ border-accent bg-accent/5"
```

`border-dashed` is the system's only dashed border — it means "drop here".

---

## 6. Motion

Motion is the point of the system. It is also where it can most easily be ruined:
everything is `power3.out`, plays **once**, and never bounces except one badge.

### Constants

```
easing (default)   power3.out
easing (pop)       back.out(2)          — badge scale-in only
easing (CSS)       cubic-bezier(.2,.7,.2,1)
duration           0.4s – 1.0s          (0.8s is the default reveal)
stagger            0.1 / 0.15 / 0.2
color transition   200ms
layout/nav         300ms
overlay fade       250ms
```

### Scroll reveal

The workhorse. Fade up, once, never reversed:

```ts
gsap.fromTo(el,
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
);
```

`toggleActions: "play none none none"` is non-negotiable — content must never
re-animate on scroll-back.

Trigger points by weight of the element:

| `start` | For |
|---|---|
| `top 85%` | text, small items |
| `top 80%` | images, CTA blocks |
| `top 75%` | timelines |
| `top 70%` | card grids |

Entry offsets: `y: 24` text · `y: 30` blocks · `y: 40` hero lines · `y: 60` cards ·
`x: -30` timeline rows. Add `scale: 0.95` for cards and CTAs; `scale: 0.8` + `blur(8px)`
for a feature image.

Always wrap in `gsap.context()` and `revert()` on cleanup.

### Hero timeline

Overlap each step into the previous with a negative offset:

```ts
tl.from(badge,    { opacity: 0, y: -20, duration: 0.6 })
  .from(lines,    { opacity: 0, y: 40, stagger: 0.15, duration: 0.8 }, "-=0.3")
  .from(desc,     { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
  .from(ctas,     { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 }, "-=0.3")
  .from(indicator,{ opacity: 0, duration: 0.4 }, "-=0.2");
```

Then tie the badge and scroll indicator to hero scroll progress so they fade as you leave:

```ts
onUpdate: (self) => {
  badge.style.opacity = `${1 - self.progress}`;
  badge.style.transform = `scale(${1 - self.progress * 0.3})`;
  indicator.style.opacity = `${1 - self.progress * 2}`;  // ×2 = leaves twice as fast
}
```

### Smooth scroll

```ts
new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 1,
});
lenis.on("scroll", () => ScrollTrigger.update());  // required, or reveals desync
```

### Marquees

CSS for a single track, duplicated content, translating `-50%`:

```css
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

@utility marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 22s linear infinite;
}
```

`22s` for a tech-logo strip. For stacked rows of cards, drive them with GSAP at `50s`
in **opposite** directions (`xPercent: -50 → 0` and `0 → -50`) — the counter-drift is
what stops it looking like a single sliding block.

### Cursor

```css
body { cursor: none; }
a, button, input, textarea, select { cursor: none; }
```

Replaced by two fixed elements at `z-[9999]`:

- **Dot** — `w-2 h-2 bg-accent rounded-full`, follows the pointer with zero lag.
- **Ring** — `w-8 h-8 border border-white/40 rounded-full`, lerped at `0.12` per frame
  so it trails.

On `a`/`button` hover the ring goes `scale-150 opacity-60`.

Escape hatch — forms need real affordances, so give the cursor back on admin-type pages:

```css
.native-cursor, .native-cursor * { cursor: auto; }
.native-cursor a, .native-cursor button, .native-cursor label { cursor: pointer; }
.native-cursor input, .native-cursor textarea { cursor: text; }
.native-cursor button:disabled { cursor: not-allowed; }
```

Skip rendering the custom cursor entirely on those routes.

### Scroll progress

`2px` accent bar, `z-[9998]`, driven by `transform: scaleX()` with `origin-left`. Never
animate `width`.

### Atmosphere (optional)

Hero depth comes from three stacked layers, all `pointer-events-none`:

1. Wireframe torus knot — `#C6FF4A`, `wireframe`, `opacity 0.15`, rotating on
   `elapsedTime * 0.1/0.15` plus a pointer-follow lerped at `0.05`.
2. 300 particles — same lime, `size 0.02`, `opacity 0.4`, `sizeAttenuation`.
3. Vignette on top, fading the canvas edges back to black:
   ```css
   background: radial-gradient(circle at 50% 38%, rgba(16,16,16,0) 0%, #101010 72%);
   ```

Keep `dpr={[1, 1.5]}` — full DPR on a decorative canvas is wasted budget.

### Keyframe

```css
@keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
/* usage: animate-[bounce_1.6s_ease-in-out_infinite] */
```

---

## 7. Porting checklist

1. Copy the `@theme inline` block and the `@keyframes` / `@utility` definitions.
2. Add `body { background:#101010; color:#FFFFFF; cursor:none }` and the
   `a, button, input, textarea, select { cursor:none }` rule.
3. Load Plus Jakarta Sans + JetBrains Mono, bind both CSS variables.
4. Copy `CustomCursor`, `ScrollProgress`, `LenisProvider`, `TextReveal` — they are
   self-contained and carry most of the feel.
5. Adopt the section wrapper string verbatim; alignment depends on it.
6. Write every user-facing string lowercase.

Swapping the accent is the one safe way to rebrand: replace `--color-accent`, the
`rgba(198,255,74,0.9)` overlay, and the two Three.js `#C6FF4A` values. Pick something
bright enough to still take `#101010` text.

---

## 8. Known inconsistencies

Documented so they get fixed rather than copied:

- **`--color-foreground` is dead.** It is `#ededed`, but `body` sets `color: #FFFFFF`
  directly and nothing else in `src/` ever references the token. Either route body text
  through it or drop it.
- **`--font-heading` duplicates `--font-sans`.** Both are Plus Jakarta Sans, so
  `font-heading` currently does nothing at runtime. Keep using it — it is the seam for
  a display face — but know it is aspirational today.
- **Nav padding is off by 1vw.** Nav is the lone `clamp(24px,5vw,56px)`; the other seven
  sections all use `6vw`, so the logo drifts out of alignment with section content at
  mid widths. Move the nav to `6vw`.
- **`Reveal.tsx` + `Skills.tsx` are an unreachable pair.** `Reveal` is imported only by
  `Skills`, and `Skills` is imported by nothing — neither ships. `Reveal` also
  contradicts `TextReveal`: IntersectionObserver instead of ScrollTrigger, and
  `0.7s cubic-bezier(.2,.7,.2,1)` instead of `0.8s power3.out`. Delete both rather than
  carrying them into a new project; `TextReveal` is the real reveal primitive.
- **No reduced-motion or coarse-pointer escape.** `cursor: none` is unconditional, and
  nothing checks `prefers-reduced-motion`, so a reduced-motion visitor still gets every
  scroll reveal, both marquees, and the rotating canvas. Add the query if you reuse this.
