export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** slugify, then suffix -2, -3, ... until it is not in `taken` */
export function uniqueSlug(title: string, taken: Set<string>): string {
  const base = slugify(title) || "project";
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
