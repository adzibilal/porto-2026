"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slug";
import {
  ActiveToggle,
  AdminLoading,
  authHeaders,
  Field,
  GalleryField,
  hasCaseStudy,
  ImageField,
  input,
  normalize,
  PasswordGate,
  Project,
  uploadFile,
  useAdminAuth,
} from "../shared";

type State = "loading" | "ready" | "missing";

export default function AdminEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: routeSlug } = use(params);
  const router = useRouter();
  const { authed, setAuthed } = useAdminAuth();

  const [state, setState] = useState<State>("loading");
  const [p, setP] = useState<Project>(normalize({}));
  const [loaded, setLoaded] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);

  useEffect(() => {
    if (!authed) return;
    fetch(`/api/projects/${routeSlug}`)
      .then(async (r) => {
        if (r.status === 404) {
          setState("missing");
          return;
        }
        const row = normalize(await r.json());
        setP(row);
        setLoaded(JSON.stringify(row));
        setState("ready");
      })
      .catch(() => setMsg({ text: "could not load this project", bad: true }));
  }, [authed, routeSlug]);

  const dirty = useMemo(
    () => loaded !== "" && JSON.stringify(p) !== loaded,
    [p, loaded]
  );

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const patch = useCallback((next: Partial<Project>) => setP((prev) => ({ ...prev, ...next })), []);

  const save = async () => {
    if (!p.title.trim()) {
      setMsg({ text: "title is required", bad: true });
      return;
    }

    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/projects/${routeSlug}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(p),
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg({ text: data.error ?? "could not save", bad: true });
        setSaving(false);
        return;
      }

      const saved = normalize(data);
      setP(saved);
      setLoaded(JSON.stringify(saved));
      setMsg({ text: "saved" });
      setSaving(false);

      // the slug is the url, so follow it if it changed
      if (saved.slug !== routeSlug) router.replace(`/admin/${saved.slug}`);
    } catch {
      setMsg({ text: "network error — nothing was saved", bad: true });
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`delete "${p.title || p.slug}"? this cannot be undone.`)) return;
    const res = await fetch(`/api/projects/${routeSlug}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (res.ok) router.push("/admin");
    else setMsg({ text: "could not delete", bad: true });
  };

  // paste an image anywhere on the page to set the cover
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const file = Array.from(e.clipboardData.items)
        .find((it) => it.type.startsWith("image/"))
        ?.getAsFile();
      if (!file) return;
      e.preventDefault();

      setMsg({ text: "uploading pasted image…" });
      const { url, error } = await uploadFile(file);
      if (url) {
        patch({ image: url });
        setMsg({ text: "cover image pasted" });
      } else {
        setMsg({ text: error ?? "upload failed", bad: true });
      }
    },
    [patch]
  );

  if (authed === null) return <AdminLoading />;
  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;
  if (state === "loading") return <AdminLoading />;

  if (state === "missing") {
    return (
      <div className="native-cursor min-h-screen bg-[#101010] flex flex-col items-center justify-center gap-4">
        <p className="text-muted text-sm">
          no project with slug <span className="font-mono text-white">{routeSlug}</span>
        </p>
        <Link href="/admin" className="font-mono text-xs text-accent hover:underline">
          ← back to projects
        </Link>
      </div>
    );
  }

  const caseStudy = hasCaseStudy(p);

  return (
    <div className="native-cursor min-h-screen bg-[#101010] pb-28" onPaste={handlePaste}>
      <header className="sticky top-0 z-20 bg-[#101010]/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link
              href="/admin"
              className="font-mono text-[11px] text-muted hover:text-accent transition-colors"
            >
              ← projects
            </Link>
            <h1 className="font-heading text-white text-lg lowercase truncate mt-0.5">
              {p.title || "untitled"}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {caseStudy && (
              <a
                href={`/work/${p.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted hover:text-accent px-3 py-2"
              >
                preview ↗
              </a>
            )}
            <button
              onClick={remove}
              className="text-xs text-red-400/80 hover:text-red-400 border border-red-400/20 rounded-lg px-3 py-2"
            >
              delete
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-6 space-y-5">
        <div
          className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 ${
            p.active ? "border-accent/25 bg-accent/5" : "border-border bg-[#151515]"
          }`}
        >
          <div>
            <p className="text-sm text-white lowercase">
              {p.active ? "published" : "draft"}
            </p>
            <p className="font-mono text-[10px] text-subtle mt-0.5">
              {p.active
                ? "showing in the selected work grid"
                : "hidden from the grid and from search engines"}
            </p>
          </div>
          <ActiveToggle active={p.active} onChange={(active) => patch({ active })} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field name="title">
            <input
              className={input}
              placeholder="simbioclip"
              value={p.title}
              onChange={(e) => {
                const title = e.target.value;
                // keep the slug in sync until it is edited by hand
                const auto = !p.slug || p.slug === slugify(p.title);
                patch(auto ? { title, slug: slugify(title) } : { title });
              }}
            />
          </Field>
          <Field name="slug" hint="public permalink">
            <input
              className={`${input} font-mono text-xs`}
              placeholder="simbioclip"
              value={p.slug}
              onChange={(e) => patch({ slug: slugify(e.target.value) })}
            />
          </Field>
        </div>

        <Field name="description" hint="one line, shown on the card">
          <input
            className={input}
            placeholder="fastapi · redis · ffmpeg — long-form video to vertical shorts"
            value={p.desc}
            onChange={(e) => patch({ desc: e.target.value })}
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-4">
          <Field name="tags" hint="comma separated">
            <input
              className={input}
              placeholder="ai, backend"
              value={p.tags.join(", ")}
              onChange={(e) =>
                patch({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
              }
            />
          </Field>
          <Field name="live url">
            <input
              className={input}
              placeholder="https://…"
              value={p.url}
              onChange={(e) => patch({ url: e.target.value })}
            />
          </Field>
        </div>

        <Field name="cover image" hint="card thumbnail, 16:9 — or just paste">
          <ImageField
            value={p.image}
            onChange={(url) => patch({ image: url })}
            onError={(text) => setMsg({ text, bad: true })}
          />
        </Field>

        <div className="pt-3 border-t border-border">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent mb-1">
            case study
          </p>
          <p className="text-[11px] text-subtle mb-4">
            fill any field below and the card starts linking to{" "}
            <span className="font-mono text-muted">/work/{p.slug || "slug"}</span> instead of the
            live url.
          </p>

          <div className="space-y-5">
            <Field name="the problem">
              <textarea
                className={`${input} min-h-24 resize-y leading-relaxed`}
                placeholder="what was broken or missing, and for whom"
                value={p.problem}
                onChange={(e) => patch({ problem: e.target.value })}
              />
            </Field>
            <Field name="what i built">
              <textarea
                className={`${input} min-h-40 resize-y leading-relaxed`}
                placeholder="the approach, the hard parts, the decisions you made"
                value={p.approach}
                onChange={(e) => patch({ approach: e.target.value })}
              />
            </Field>
            <Field name="result" hint="numbers beat adjectives">
              <textarea
                className={`${input} min-h-24 resize-y leading-relaxed`}
                placeholder="lighthouse 42 → 96, render time 8min → 40s, 30 clips/day"
                value={p.result}
                onChange={(e) => patch({ result: e.target.value })}
              />
            </Field>
            <Field name="stack" hint="comma separated">
              <input
                className={input}
                placeholder="next.js 15, typescript, postgres"
                value={p.stack.join(", ")}
                onChange={(e) =>
                  patch({ stack: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
                }
              />
            </Field>
            <Field name="screens" hint="gallery on the detail page">
              <GalleryField
                values={p.images}
                onChange={(images) => patch({ images })}
                onError={(text) => setMsg({ text, bad: true })}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 bg-[#101010]/95 backdrop-blur border-t border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <p
            className={`text-xs truncate ${
              msg?.bad ? "text-red-400" : msg ? "text-accent" : "text-subtle"
            }`}
          >
            {msg?.text ?? (dirty ? "unsaved changes" : "all changes saved")}
          </p>
          <button
            onClick={save}
            disabled={saving || !dirty}
            className="bg-accent text-[#101010] font-semibold rounded-lg px-6 py-2.5 text-sm disabled:opacity-30 shrink-0"
          >
            {saving ? "saving…" : "save"}
          </button>
        </div>
      </div>
    </div>
  );
}
