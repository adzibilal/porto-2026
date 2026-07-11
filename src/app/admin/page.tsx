"use client";

import { useCallback, useEffect, useRef, useState } from "react";

async function uploadFile(file: File, token: string) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const data = await res.json();
  return data.url as string | undefined;
}

type Project = {
  id?: string;
  title: string;
  desc: string;
  tags: string[];
  image: string;
  url: string;
  sort: number;
};

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101010] p-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch("/api/auth", {
            method: "POST",
            body: JSON.stringify({ password: pw }),
          });
          if (res.ok) {
            sessionStorage.setItem("admin_token", pw);
            onAuth();
          } else setErr(true);
        }}
        className="flex flex-col gap-4 w-80"
      >
        <h1 className="font-heading text-white text-xl lowercase">admin</h1>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="bg-[#1c1c1c] border border-border rounded-lg p-3 text-white text-sm"
          placeholder="password"
        />
        {err && <p className="text-red-400 text-xs">wrong password</p>}
        <button className="bg-accent text-[#101010] font-semibold rounded-lg p-3 text-sm">
          masuk
        </button>
      </form>
    </div>
  );
}

function ProjectCard({
  p,
  i,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  onImageFocus,
  uploading,
}: {
  p: Project;
  i: number;
  onChange: (i: number, p: Project) => void;
  onMoveUp: (i: number) => void;
  onMoveDown: (i: number) => void;
  onRemove: (i: number) => void;
  onImageFocus: (i: number) => void;
  uploading: boolean;
}) {
  return (
    <div className="border border-border rounded-xl p-5 space-y-3 bg-[#151515]">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted font-mono">#{i + 1}</span>
        <div className="flex gap-2">
          <button onClick={() => onMoveUp(i)} className="text-xs text-muted hover:text-white" disabled={i === 0}>↑</button>
          <button onClick={() => onMoveDown(i)} className="text-xs text-muted hover:text-white">↓</button>
          <button onClick={() => onRemove(i)} className="text-xs text-red-400">✕</button>
        </div>
      </div>

      <input
        className="w-full bg-[#1c1c1c] border border-border rounded-lg p-2.5 text-white text-sm"
        placeholder="title"
        value={p.title}
        onChange={(e) => onChange(i, { ...p, title: e.target.value })}
      />
      <input
        className="w-full bg-[#1c1c1c] border border-border rounded-lg p-2.5 text-white text-sm"
        placeholder="description"
        value={p.desc}
        onChange={(e) => onChange(i, { ...p, desc: e.target.value })}
      />
      <input
        className="w-full bg-[#1c1c1c] border border-border rounded-lg p-2.5 text-white text-sm"
        placeholder="tags (comma separated)"
        value={p.tags.join(", ")}
        onChange={(e) => onChange(i, { ...p, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
      />
      <div className="flex gap-2 items-center">
        <input
          className="flex-1 bg-[#1c1c1c] border border-border rounded-lg p-2.5 text-white text-sm"
          placeholder="image url — or paste image"
          value={p.image}
          onChange={(e) => onChange(i, { ...p, image: e.target.value })}
          onFocus={() => onImageFocus(i)}
        />
        <label className="cursor-pointer text-xs text-accent hover:underline shrink-0">
          upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadFile(file, sessionStorage.getItem("admin_token")!);
              if (url) onChange(i, { ...p, image: url });
            }}
          />
        </label>
      </div>
      <input
        className="w-full bg-[#1c1c1c] border border-border rounded-lg p-2.5 text-white text-sm"
        placeholder="url (link to project)"
        value={p.url}
        onChange={(e) => onChange(i, { ...p, url: e.target.value })}
      />
      {p.image && (
        <img src={p.image} alt="" className="w-full h-32 object-cover rounded-lg" />
      )}
      {uploading && <div className="text-xs text-accent animate-pulse">uploading...</div>}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthed(!!sessionStorage.getItem("admin_token"));
  }, []);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : []))
      .then(setProjects)
      .catch(() => {});
  }, [authed]);

  const onChange = useCallback((i: number, p: Project) => {
    setProjects((prev) => {
      const next = [...prev];
      next[i] = p;
      return next;
    });
  }, []);

  const add = () =>
    setProjects((prev) => [...prev, { title: "", desc: "", tags: [], image: "", url: "", sort: prev.length }]);

  const moveUp = (i: number) => {
    if (i === 0) return;
    setProjects((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next.map((p, idx) => ({ ...p, sort: idx }));
    });
  };

  const moveDown = (i: number) => {
    setProjects((prev) => {
      if (i >= prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next.map((p, idx) => ({ ...p, sort: idx }));
    });
  };

  const remove = (i: number) =>
    setProjects((prev) => prev.filter((_, idx) => idx !== i).map((p, idx) => ({ ...p, sort: idx })));

  const save = async () => {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/projects", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(projects.map((p, i) => ({ ...p, sort: i }))),
    });
    setMsg(res.ok ? "saved!" : "error saving");
    setSaving(false);
  };

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (!item.type.startsWith("image/")) continue;
        const file = item.getAsFile();
        if (!file) continue;
        e.preventDefault();

        const target = activeRef.current ?? projects.length - 1;
        if (target < 0) return;
        setUploadingIndex(target);
        const url = await uploadFile(file, sessionStorage.getItem("admin_token")!);
        if (url) {
          setProjects((prev) => {
            const next = [...prev];
            if (next[target]) next[target] = { ...next[target], image: url };
            return next;
          });
        }
        setUploadingIndex(null);
        return;
      }
    },
    [projects.length]
  );

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#101010] p-4 md:p-8" onPaste={handlePaste}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-white text-xl lowercase">manage projects</h1>
          <div className="flex gap-3 items-center">
            <span className="text-[11px] text-muted hidden sm:inline">paste image anywhere</span>
            <button
              onClick={add}
              className="text-sm text-white border border-border rounded-lg px-4 py-2 hover:bg-[#1c1c1c]"
            >
              + add
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="bg-accent text-[#101010] font-semibold rounded-lg px-6 py-2 text-sm disabled:opacity-50"
            >
              {saving ? "saving..." : "save all"}
            </button>
          </div>
        </div>

        {msg && <p className="text-sm text-muted mb-4">{msg}</p>}

        <div className="space-y-4">
          {projects.map((p, i) => (
            <ProjectCard
              key={i}
              p={p}
              i={i}
              onChange={onChange}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
              onRemove={remove}
              onImageFocus={(idx) => { activeRef.current = idx; }}
              uploading={uploadingIndex === i}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <p className="text-center text-muted text-sm py-20">no projects yet. click + add</p>
        )}
      </div>
    </div>
  );
}
