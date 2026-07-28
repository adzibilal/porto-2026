"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ActiveToggle,
  AdminLoading,
  authHeaders,
  hasCaseStudy,
  input,
  normalize,
  PasswordGate,
  Project,
  useAdminAuth,
} from "./shared";

type Filter = "all" | "active" | "draft";

function haystack(p: Project) {
  return [p.title, p.slug, p.desc, ...p.tags, ...p.stack].join(" ").toLowerCase();
}

function Row({
  p,
  canReorder,
  first,
  last,
  busy,
  onMove,
  onToggle,
  onDelete,
}: {
  p: Project;
  canReorder: boolean;
  first: boolean;
  last: boolean;
  busy: boolean;
  onMove: (dir: -1 | 1) => void;
  onToggle: (next: boolean) => void;
  onDelete: () => void;
}) {
  const caseStudy = hasCaseStudy(p);

  return (
    <div
      className={`flex items-center gap-3 p-3 border rounded-xl transition-colors ${
        p.active
          ? "border-border bg-[#151515] hover:border-white/20"
          : "border-white/5 bg-[#121212] hover:border-white/15"
      }`}
    >
      <div className="flex flex-col shrink-0">
        <button
          onClick={() => onMove(-1)}
          disabled={!canReorder || first}
          className="px-1.5 text-muted hover:text-white disabled:opacity-20 leading-none text-[11px]"
          title={canReorder ? "move up" : "clear the search to reorder"}
        >
          ▲
        </button>
        <button
          onClick={() => onMove(1)}
          disabled={!canReorder || last}
          className="px-1.5 text-muted hover:text-white disabled:opacity-20 leading-none text-[11px]"
          title={canReorder ? "move down" : "clear the search to reorder"}
        >
          ▼
        </button>
      </div>

      <ActiveToggle active={p.active} onChange={onToggle} disabled={busy} size="sm" />

      <Link
        href={`/admin/${p.slug}`}
        className={`flex items-center gap-3 flex-1 min-w-0 group ${p.active ? "" : "opacity-55"}`}
      >
        <span className="w-16 h-10 rounded-md bg-[#1c1c1c] shrink-0 overflow-hidden flex items-center justify-center">
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="font-mono text-[9px] text-subtle">no img</span>
          )}
        </span>
        <span className="min-w-0">
          <span className="block text-sm text-white truncate group-hover:text-accent transition-colors">
            {p.title || <span className="text-subtle italic">untitled</span>}
          </span>
          <span className="block font-mono text-[10px] text-subtle truncate">/{p.slug}</span>
        </span>
      </Link>

      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        {!p.active && (
          <span className="font-mono text-[9px] uppercase px-2 py-1 rounded bg-white/5 text-subtle">
            draft
          </span>
        )}
        {!p.image && (
          <span className="font-mono text-[9px] uppercase px-2 py-1 rounded bg-amber-500/10 text-amber-400">
            no cover
          </span>
        )}
        <span
          className={`font-mono text-[9px] uppercase px-2 py-1 rounded ${
            caseStudy ? "bg-accent/10 text-accent" : "bg-white/5 text-subtle"
          }`}
        >
          {caseStudy ? "case study" : "links out"}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {caseStudy && (
          <a
            href={`/work/${p.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 text-muted hover:text-accent text-xs"
            title="preview public page"
          >
            ↗
          </a>
        )}
        <Link
          href={`/admin/${p.slug}`}
          className="px-3 py-1.5 text-xs text-white border border-border rounded-lg hover:bg-[#1c1c1c]"
        >
          edit
        </Link>
        <button
          onClick={onDelete}
          className="px-2 py-1 text-red-400/70 hover:text-red-400"
          title="delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function AdminListPage() {
  const router = useRouter();
  const { authed, setAuthed } = useAdminAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [busy, setBusy] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);

  // ?all=1 so drafts show up here — the public grid gets published rows only
  const load = useCallback(() => {
    fetch("/api/projects?all=1", { headers: authHeaders() })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Partial<Project>[]) => setProjects(rows.map(normalize)))
      .catch(() => setMsg({ text: "could not load projects", bad: true }));
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const query = q.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      projects
        .filter((p) => (filter === "all" ? true : filter === "active" ? p.active : !p.active))
        .filter((p) => (query ? haystack(p).includes(query) : true)),
    [projects, query, filter]
  );

  const stats = useMemo(
    () => ({
      total: projects.length,
      active: projects.filter((p) => p.active).length,
      drafts: projects.filter((p) => !p.active).length,
      noCover: projects.filter((p) => !p.image).length,
    }),
    [projects]
  );

  const toggleActive = async (p: Project, next: boolean) => {
    setToggling(p.slug);
    const res = await fetch(`/api/projects/${p.slug}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ active: next }),
    });
    setToggling(null);

    if (res.ok) {
      setProjects((prev) => prev.map((x) => (x.slug === p.slug ? { ...x, active: next } : x)));
      setMsg({ text: `${p.slug} ${next ? "published" : "moved to drafts"}` });
    } else {
      setMsg({ text: "could not change publish state", bad: true });
    }
  };

  // reorder writes straight through — there is no other unsaved state on this page
  const move = async (slug: string, dir: -1 | 1) => {
    const i = projects.findIndex((p) => p.slug === slug);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= projects.length) return;

    const next = [...projects];
    [next[i], next[j]] = [next[j], next[i]];
    setProjects(next);

    setBusy(true);
    const res = await fetch("/api/projects", {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(next.map((p) => p.slug)),
    });
    setBusy(false);

    if (res.ok) {
      setMsg({ text: "order saved" });
    } else {
      setProjects(projects); // put it back
      setMsg({ text: "could not save order", bad: true });
    }
  };

  const remove = async (p: Project) => {
    if (!confirm(`delete "${p.title || p.slug}"? this cannot be undone.`)) return;

    setBusy(true);
    const res = await fetch(`/api/projects/${p.slug}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    setBusy(false);

    if (res.ok) {
      setProjects((prev) => prev.filter((x) => x.slug !== p.slug));
      setMsg({ text: `deleted ${p.slug}` });
    } else {
      setMsg({ text: "could not delete", bad: true });
    }
  };

  const create = async () => {
    setBusy(true);
    const res = await fetch("/api/projects", { method: "POST", headers: authHeaders() });
    setBusy(false);

    if (!res.ok) {
      setMsg({ text: "could not create project", bad: true });
      return;
    }
    const row = await res.json();
    router.push(`/admin/${row.slug}`);
  };

  if (authed === null) return <AdminLoading />;
  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;

  return (
    <div className="native-cursor min-h-screen bg-[#101010]">
      <header className="sticky top-0 z-20 bg-[#101010]/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="font-heading text-white text-lg lowercase">projects</h1>
              <p className="font-mono text-[10px] text-subtle mt-0.5">
                <span className="text-accent">{stats.active} live</span> · {stats.drafts} drafts
                {stats.noCover > 0 && (
                  <span className="text-amber-400"> · {stats.noCover} missing a cover</span>
                )}
              </p>
            </div>
            <button
              onClick={create}
              disabled={busy}
              className="bg-accent text-[#101010] font-semibold rounded-lg px-5 py-2 text-sm disabled:opacity-40 shrink-0"
            >
              + new
            </button>
          </div>

          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={`${input} pl-9`}
              placeholder="search title, slug, tag, or stack…"
              autoFocus
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle text-sm pointer-events-none">
              ⌕
            </span>
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-white text-xs"
              >
                clear
              </button>
            )}
          </div>

          <div className="flex gap-1.5 mt-3">
            {(["all", "active", "draft"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors ${
                  filter === f
                    ? "border-accent text-accent bg-accent/10"
                    : "border-border text-subtle hover:text-white"
                }`}
              >
                {f === "all" ? `all ${stats.total}` : f === "active" ? `live ${stats.active}` : `drafts ${stats.drafts}`}
              </button>
            ))}
          </div>

          {msg && (
            <p className={`mt-3 text-xs ${msg.bad ? "text-red-400" : "text-accent"}`}>{msg.text}</p>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        {(query || filter !== "all") && (
          <p className="font-mono text-[10px] text-subtle mb-3">
            {filtered.length} of {projects.length} shown · reordering is off while filtering
          </p>
        )}

        <div className="space-y-2">
          {filtered.map((p) => (
            <Row
              key={p.slug}
              p={p}
              canReorder={!query && filter === "all"}
              first={projects[0]?.slug === p.slug}
              last={projects[projects.length - 1]?.slug === p.slug}
              busy={toggling === p.slug}
              onMove={(dir) => move(p.slug, dir)}
              onToggle={(next) => toggleActive(p, next)}
              onDelete={() => remove(p)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted text-sm py-20">
            {query
              ? `nothing matches "${q}"`
              : filter === "draft"
                ? "no drafts"
                : filter === "active"
                  ? "nothing published yet"
                  : "no projects yet. click + new"}
          </p>
        )}
      </div>
    </div>
  );
}
