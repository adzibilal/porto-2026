export type Project = {
  slug: string;
  title: string;
  desc: string;
  tags: string[];
  url: string;
  problem?: string;
  approach?: string;
  result?: string;
  stack?: string[];
  images?: string[];
  /** always true for static public set — kept for parity with DB shape */
  active?: boolean;
};

/**
 * Public selected works — sourced from seed (entries without active:false).
 * Used by the homepage grid and /work/[slug] so production works without Postgres.
 */
export const projects: Project[] = [
  {
    slug: "simbioclip",
    title: "simbioclip",
    desc: "fastapi · redis · ffmpeg · whisper — self-hosted ai clipper turning long-form video into vertical shorts with auto-captions",
    tags: ["ai", "backend", "video"],
    url: "https://github.com/adzibilal/simbioclip",
    problem:
      "Repurposing long-form video into shorts means paying a monthly subscription per seat, and handing raw footage to a third party you do not control. For anyone publishing daily, the cost scales with output and the footage never stays private.",
    approach:
      "A self-hosted pipeline that runs the whole job end to end: pull the source with yt-dlp or a direct upload, transcribe with word-level timestamps, let an LLM pick the moments worth cutting, then render vertical clips with burned-in captions in FFmpeg.\n\nFastAPI takes the request and queues it in Redis; RQ workers run the stages independently so a long render never blocks the next download. The dashboard is HTMX, so job status updates live without a frontend build step. Supports 9:16, 1:1, 4:5 and 16:9 output with center-crop, talking-head and blurred-background layouts, plus per-frame trimming on individual clips.\n\nShips as Docker Compose and runs on a plain VPS. Speech-to-text can run locally with faster-whisper or hit a remote endpoint, and the LLM layer is OpenAI-compatible so it works with Groq, OpenRouter or Google AI Studio.",
    result: "",
    stack: [
      "fastapi",
      "python",
      "redis",
      "rq",
      "ffmpeg",
      "yt-dlp",
      "faster-whisper",
      "htmx",
      "docker compose",
    ],
  },
  {
    slug: "mindsync",
    title: "mindsync",
    desc: "fastapi · qdrant · next.js — rag document q&a delivered over whatsapp, with an admin dashboard and cited answers",
    tags: ["ai", "rag", "full-stack"],
    url: "https://github.com/adzibilal/mindsync-v2",
    problem:
      "Campus regulations, schedules and announcements live in PDFs that nobody reads, so students ask staff the same questions over and over. The answers already exist in writing — they are just not reachable from where students actually are.",
    approach:
      "Administrators upload the official documents, including scans, which are OCR'd, chunked and embedded into Qdrant. Students then ask questions in plain language over WhatsApp and get an answer with a citation back to the source document, so nothing is invented.\n\nThe admin dashboard covers document management and categorisation, usage analytics, an editable system prompt, and a RAG playground for testing retrieval before it reaches students. The WhatsApp side runs through self-hosted WAHA with typing indicators and rate limiting.\n\nLiteLLM sits in front of the model layer so providers can be swapped without touching the retrieval code.",
    result: "",
    stack: [
      "fastapi",
      "python",
      "postgres",
      "qdrant",
      "litellm",
      "tesseract ocr",
      "next.js",
      "shadcn/ui",
      "tanstack query",
      "docker compose",
    ],
  },
  {
    slug: "react-docscan",
    title: "react docscan",
    desc: "react · opencv.js · vite — document scanner that runs fully in the browser, no upload",
    tags: ["frontend", "computer vision"],
    url: "https://react-docscan.vercel.app",
    problem:
      "Scanning a document usually means installing a native app and sending the image to somebody else's server. For anything sensitive — an ID, a contract, a tax form — that upload is the whole problem.",
    approach:
      "Everything runs client-side. Capture from the webcam or pick a file, then OpenCV.js via jscanify finds the document edges and applies perspective correction to flatten it. From there, crop, rotate and brightness/contrast tools clean it up before exporting to JPG or PNG.\n\nBecause there is no backend, the file never leaves the device — which is also what makes it deployable as a static site. State is handled with Zustand and the capture/detect/edit/export flow is split into hooks so each stage can be tested on its own.",
    result: "",
    stack: [
      "react 18",
      "typescript",
      "vite",
      "tailwind",
      "jscanify",
      "opencv.js",
      "zustand",
      "cropper.js",
    ],
  },
  {
    slug: "dilos-ui",
    title: "dilos ui",
    desc: "typescript · tailwind · lerna monorepo — component library with docusaurus documentation site",
    tags: ["library", "design system"],
    url: "https://github.com/Diloslibs/dilos-ui",
    problem:
      "Rebuilding the same buttons, inputs and modals on every new project, then discovering each copy has drifted slightly from the last.",
    approach:
      "A Lerna monorepo with two packages: the component library itself and a Docusaurus documentation site. Both run from a single command in development, so a component and the docs that describe it are written and reviewed together rather than drifting apart.\n\nComponents are Tailwind-styled with behaviour layered on in TypeScript, and the build is set up to publish to npm or ship over a CDN.",
    result: "",
    stack: ["typescript", "tailwind", "lerna", "docusaurus", "pnpm"],
  },
  {
    slug: "splitbillz",
    title: "splitbillz",
    desc: "next.js 15 · shadcn/ui — split a restaurant bill by link, no sign-up",
    tags: ["frontend", "product"],
    url: "https://splitbillz-ivory.vercel.app",
    problem:
      "Splitting a bill in a group chat falls apart the moment one person has to install an app or create an account. The maths is trivial; the friction is the reason it ends up being done by hand.",
    approach:
      "The host creates a bill and shares a link. Everyone else opens it and taps only their own items — no account, no install. Tax and service charges are then distributed proportionally to what each person actually ordered, rather than split evenly.\n\nBuilt mobile-first, since it is used at the table: 44×44px minimum touch targets and a flow that works one-handed. State runs through React Context with in-memory data, so the interaction model was proven before committing to a backend.",
    result: "",
    stack: ["next.js 15", "typescript", "tailwind", "shadcn/ui", "react context"],
  },
  {
    slug: "pahamin",
    title: "pahamin",
    desc: "next.js · gemini · supabase · clerk — ai study buddy with quizzes and flashcards",
    tags: ["ai", "full-stack"],
    url: "https://pahamin.vercel.app",
    problem:
      "Studying alone, there is nobody to check whether you actually understood the material or just read it. Re-reading feels like progress and usually is not.",
    approach:
      "A student enters a topic and gets three things back: an explanation in a chosen style, practice questions with worked answers, and a flashcard deck to drill. Authentication through Clerk with progress stored in Supabase, so the material stays across sessions.\n\nGemini handles generation behind a server route, keeping keys off the client.",
    result: "",
    stack: ["next.js", "typescript", "clerk", "supabase", "gemini", "tailwind"],
  },
  {
    slug: "openprompter",
    title: "openprompter",
    desc: "next.js 14 · vision llm — turns any image into a structured prompt for ai image generation",
    tags: ["ai", "frontend"],
    url: "https://open-prompter.vercel.app",
  },
  {
    slug: "kck-property",
    title: "kck property",
    desc: "next.js · typescript · tailwind — property listing site",
    tags: ["frontend", "client work"],
    url: "https://kckproperty.vercel.app",
  },
  {
    slug: "pearl-habsye",
    title: "pearl habsye",
    desc: "next.js · prisma · tailwind — online store front",
    tags: ["frontend", "e-commerce"],
    url: "https://pearlhabsye.vercel.app",
  },
  {
    slug: "jalan-online-kasir",
    title: "jalan online kasir",
    desc: "next.js · prisma — point-of-sale and cashier app",
    tags: ["full-stack", "product"],
    url: "https://jalan-online-kasir.vercel.app",
  },
  {
    slug: "forkey-creative",
    title: "forkey creative",
    desc: "next.js · typescript · tailwind — creative agency website",
    tags: ["frontend", "client work"],
    url: "https://forkeycreative.vercel.app",
  },
  {
    slug: "azmi-trans",
    title: "azmi trans",
    desc: "next.js · typescript · tailwind — transport company website",
    tags: ["frontend", "client work"],
    url: "https://azmi-trans.vercel.app",
  },
  {
    slug: "ar-plant-identifier",
    title: "ar plant identifier",
    desc: "next.js · typescript — augmented reality plant identification in the browser",
    tags: ["frontend", "ar"],
    url: "https://ar-plant-identifier.vercel.app",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
