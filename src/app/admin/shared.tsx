"use client";

import { useEffect, useState } from "react";

export type Project = {
  id?: string;
  slug: string;
  active: boolean;
  title: string;
  desc: string;
  tags: string[];
  image: string;
  url: string;
  problem: string;
  approach: string;
  result: string;
  stack: string[];
  images: string[];
  sort: number;
};

export const EMPTY: Project = {
  slug: "",
  active: false,
  title: "",
  desc: "",
  tags: [],
  image: "",
  url: "",
  problem: "",
  approach: "",
  result: "",
  stack: [],
  images: [],
  sort: 0,
};

/** fills in fields the api may omit on older rows */
export function normalize(p: Partial<Project>): Project {
  return {
    ...EMPTY,
    ...p,
    active: p.active ?? false,
    tags: p.tags ?? [],
    stack: p.stack ?? [],
    images: p.images ?? [],
  };
}

/** publish switch — same control on the list and the edit page */
export function ActiveToggle({
  active,
  onChange,
  disabled,
  size = "md",
}: {
  active: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const w = size === "sm" ? "w-9 h-5" : "w-11 h-6";
  const knob = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const shift = size === "sm" ? "translate-x-4" : "translate-x-5";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={active ? "unpublish" : "publish"}
      disabled={disabled}
      onClick={() => onChange(!active)}
      title={active ? "published — click to make it a draft" : "draft — click to publish"}
      className={`${w} relative rounded-full transition-colors shrink-0 disabled:opacity-40 ${
        active ? "bg-accent" : "bg-white/15"
      }`}
    >
      <span
        className={`absolute top-1/2 left-1 -translate-y-1/2 ${knob} rounded-full transition-transform ${
          active ? `bg-[#101010] ${shift}` : "bg-white/70"
        }`}
      />
    </button>
  );
}

export function hasCaseStudy(p: Project) {
  return !!(p.problem || p.approach || p.result || p.images.length);
}

export const token = () =>
  typeof window === "undefined" ? "" : sessionStorage.getItem("admin_token") ?? "";

export const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

/* ---------- styles ---------- */

export const input =
  "w-full bg-[#1c1c1c] border border-border rounded-lg p-2.5 text-white text-sm placeholder:text-subtle focus:border-accent focus:outline-none transition-colors";

export const labelCls = "block font-mono text-[10px] uppercase tracking-[0.12em] text-subtle mb-1.5";

export function Field({
  name,
  hint,
  children,
}: {
  name: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className={labelCls}>
        {name}
        {hint && (
          <span className="normal-case tracking-normal text-[10px] text-subtle/70"> — {hint}</span>
        )}
      </span>
      {children}
    </div>
  );
}

/* ---------- auth ---------- */

export function useAdminAuth() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthed(!!sessionStorage.getItem("admin_token"));
  }, []);

  return { authed, setAuthed };
}

/** auth lives in sessionStorage, so the server cannot know it — show a shell, not a blank page */
export function AdminLoading({ text = "loading…" }: { text?: string }) {
  return (
    <div className="native-cursor min-h-screen bg-[#101010] flex items-center justify-center">
      <p className="font-mono text-xs text-subtle animate-pulse">{text}</p>
    </div>
  );
}

export function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  return (
    <div className="native-cursor min-h-screen flex items-center justify-center bg-[#101010] p-4">
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
          className={input}
          placeholder="password"
          autoFocus
        />
        {err && <p className="text-red-400 text-xs">wrong password</p>}
        <button className="bg-accent text-[#101010] font-semibold rounded-lg p-3 text-sm">
          masuk
        </button>
      </form>
    </div>
  );
}

/* ---------- upload ---------- */

export async function uploadFile(file: File): Promise<{ url?: string; error?: string }> {
  const fd = new FormData();
  fd.append("file", file);
  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}` },
      body: fd,
    });
    const data = await res.json();
    return res.ok ? { url: data.url } : { error: data.error ?? "upload failed" };
  } catch {
    return { error: "network error" };
  }
}

export function Dropzone({
  onFiles,
  busy,
  children,
  className = "",
}: {
  onFiles: (files: File[]) => void;
  busy?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
        if (files.length) onFiles(files);
      }}
      className={`relative rounded-lg border border-dashed transition-colors ${
        over ? "border-accent bg-accent/5" : "border-border"
      } ${className}`}
    >
      {children}
      {(over || busy) && (
        <div className="absolute inset-0 rounded-lg bg-[#101010]/80 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-[11px] text-accent">
            {busy ? "uploading…" : "drop to upload"}
          </span>
        </div>
      )}
    </div>
  );
}

export function ImageField({
  value,
  onChange,
  onError,
}: {
  value: string;
  onChange: (url: string) => void;
  onError: (msg: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  const handle = async (files: File[]) => {
    setBusy(true);
    const { url, error } = await uploadFile(files[0]);
    setBusy(false);
    if (url) onChange(url);
    else onError(error ?? "upload failed");
  };

  return (
    <Dropzone onFiles={handle} busy={busy} className="p-3">
      {value ? (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full aspect-video object-cover rounded-md" />
          <div className="flex items-center gap-3">
            <label className="font-mono text-[11px] text-accent hover:underline">
              replace
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handle([e.target.files[0]])}
              />
            </label>
            <button
              type="button"
              onClick={() => onChange("")}
              className="font-mono text-[11px] text-red-400 hover:underline"
            >
              remove
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-1 h-32 text-center">
          <span className="font-mono text-[11px] text-muted">drop, paste, or click</span>
          <span className="font-mono text-[10px] text-subtle">png · jpg · webp · max 8mb</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handle([e.target.files[0]])}
          />
        </label>
      )}
    </Dropzone>
  );
}

export function GalleryField({
  values,
  onChange,
  onError,
}: {
  values: string[];
  onChange: (urls: string[]) => void;
  onError: (msg: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  const handle = async (files: File[]) => {
    setBusy(true);
    const results = await Promise.all(files.map(uploadFile));
    setBusy(false);
    const urls = results.map((r) => r.url).filter((u): u is string => !!u);
    const failed = results.filter((r) => r.error);
    if (failed.length) onError(`${failed.length} of ${files.length} failed: ${failed[0].error}`);
    if (urls.length) onChange([...values, ...urls]);
  };

  return (
    <Dropzone onFiles={handle} busy={busy} className="p-3">
      {values.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {values.map((src, i) => (
            <div key={src} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-20 object-cover rounded-md" />
              <button
                type="button"
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#101010]/90 text-red-400 text-[11px] leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                title="remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="flex items-center justify-center gap-2 h-14 text-center">
        <span className="font-mono text-[11px] text-muted">
          {values.length ? "add more screens" : "drop or click — multiple allowed"}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) handle(files);
          }}
        />
      </label>
    </Dropzone>
  );
}
