import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { projects } from "@/db/schema";

async function getProject(slug: string) {
  try {
    const [row] = await getDb().select().from(projects).where(eq(projects.slug, slug)).limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return { title: "not found · adzi bilal" };
  return {
    title: `${p.title} · adzi bilal`,
    description: p.desc || undefined,
    openGraph: p.image ? { images: [p.image] } : undefined,
    // drafts stay reachable by direct link for previewing, but out of search
    robots: p.active ? undefined : { index: false, follow: false },
  };
}

function Block({ label, body }: { label: string; body: string }) {
  if (!body) return null;
  return (
    <div className="border-t border-border pt-6">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent mb-3">
        {label}
      </h2>
      <p className="text-[15px] leading-[1.75] text-muted whitespace-pre-line max-w-[68ch]">
        {body}
      </p>
    </div>
  );
}

export default async function WorkDetail({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();

  const stack = p.stack ?? [];
  const gallery = (p.images ?? []).filter(Boolean);

  return (
    <main className="px-[clamp(24px,6vw,56px)] py-[clamp(32px,6vh,64px)] max-w-[1000px] mx-auto">
      {!p.active && (
        <div className="mb-6 rounded-lg border border-amber-400/25 bg-amber-400/5 px-4 py-3">
          <p className="font-mono text-[11px] text-amber-400">
            draft — not listed on the homepage and not indexed by search engines
          </p>
        </div>
      )}

      <Link
        href="/#work"
        className="inline-flex items-center gap-2 font-mono text-[12px] text-muted hover:text-accent transition-colors"
      >
        ← back to work
      </Link>

      <header className="mt-10 mb-10">
        <h1 className="font-heading font-semibold text-[clamp(32px,6vw,56px)] leading-[1.05] text-white lowercase">
          {p.title}
        </h1>
        {p.desc && (
          <p className="mt-4 text-[16px] leading-[1.7] text-muted max-w-[68ch]">{p.desc}</p>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-[#101010] font-semibold text-[13px] lowercase rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity"
            >
              view live →
            </a>
          )}
          {(p.tags ?? []).map((t) => (
            <span
              key={t}
              className="text-[11px] px-[10px] py-[4px] rounded-full bg-card-bg text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      {p.image && (
        <div className="relative aspect-video rounded-[14px] overflow-hidden border border-border mb-12">
          <Image
            src={p.image}
            alt={p.title}
            fill
            className="object-cover"
            sizes="(max-width: 1000px) 100vw, 1000px"
            priority
          />
        </div>
      )}

      <div className="space-y-8">
        <Block label="the problem" body={p.problem ?? ""} />
        <Block label="what i built" body={p.approach ?? ""} />
        <Block label="result" body={p.result ?? ""} />

        {stack.length > 0 && (
          <div className="border-t border-border pt-6">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent mb-3">
              stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[12px] px-3 py-1.5 rounded-lg border border-border text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {gallery.length > 0 && (
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent mb-5">
            screens
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
            {gallery.map((src) => (
              <div
                key={src}
                className="relative aspect-video rounded-[10px] overflow-hidden border border-border"
              >
                <Image
                  src={src}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 border-t border-border pt-8 flex flex-wrap gap-4 items-center justify-between">
        <p className="text-[14px] text-muted lowercase">interested in working together?</p>
        <Link
          href="/#contact"
          className="font-mono text-[12px] text-accent hover:underline lowercase"
        >
          get in touch →
        </Link>
      </div>
    </main>
  );
}
