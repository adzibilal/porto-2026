import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { checkAuth } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";

/**
 * Public callers get published projects only. The admin passes ?all=1 (with the
 * bearer token) to see drafts too.
 */
export async function GET(req: Request) {
  const wantsAll = new URL(req.url).searchParams.get("all") === "1";

  if (wantsAll && !checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const rows = wantsAll
      ? await db.select().from(projects).orderBy(asc(projects.sort))
      : await db
          .select()
          .from(projects)
          .where(eq(projects.active, true))
          .orderBy(asc(projects.sort));
    return Response.json(rows);
  } catch {
    return Response.json([]);
  }
}

/** create a blank project and hand back its slug so the client can navigate to it */
export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const existing = await db.select({ slug: projects.slug, sort: projects.sort }).from(projects);
    const slug = uniqueSlug("untitled", new Set(existing.map((p) => p.slug)));
    const sort = existing.reduce((max, p) => Math.max(max, p.sort ?? 0), -1) + 1;

    // a brand new row is a draft — nothing half-written should hit the public grid
    const [row] = await db
      .insert(projects)
      .values({ slug, title: "untitled", sort, active: false })
      .returning();
    return Response.json(row, { status: 201 });
  } catch {
    return Response.json({ error: "db error" }, { status: 500 });
  }
}

/** reorder only — body is the slugs in their new display order */
export async function PATCH(req: Request) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let slugs: string[];
  try {
    slugs = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  if (!Array.isArray(slugs) || slugs.some((s) => typeof s !== "string")) {
    return Response.json({ error: "expected an array of slugs" }, { status: 400 });
  }

  try {
    await getDb().transaction(async (tx) => {
      for (const [i, slug] of slugs.entries()) {
        await tx.update(projects).set({ sort: i }).where(eq(projects.slug, slug));
      }
    });
    return Response.json({ ok: true, count: slugs.length });
  } catch {
    return Response.json({ error: "db error" }, { status: 500 });
  }
}

