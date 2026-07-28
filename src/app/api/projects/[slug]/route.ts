import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { checkAuth } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function GET(_req: Request, { params }: RouteContext<"/api/projects/[slug]">) {
  const { slug } = await params;
  try {
    const [row] = await getDb().select().from(projects).where(eq(projects.slug, slug)).limit(1);
    if (!row) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json(row);
  } catch {
    return Response.json({ error: "db error" }, { status: 500 });
  }
}

type Body = {
  slug?: string;
  title?: string;
  desc?: string;
  tags?: string[];
  image?: string;
  url?: string;
  problem?: string;
  approach?: string;
  result?: string;
  stack?: string[];
  images?: string[];
  active?: boolean;
};

/** partial update — used by the list page's publish toggle */
export async function PATCH(req: Request, { params }: RouteContext<"/api/projects/[slug]">) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  let body: { active?: boolean };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  if (typeof body.active !== "boolean") {
    return Response.json({ error: "expected { active: boolean }" }, { status: 400 });
  }

  try {
    const [row] = await getDb()
      .update(projects)
      .set({ active: body.active, updatedAt: new Date() })
      .where(eq(projects.slug, slug))
      .returning();
    if (!row) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json(row);
  } catch {
    return Response.json({ error: "db error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteContext<"/api/projects/[slug]">) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const title = body.title?.trim();
  if (!title) {
    return Response.json({ error: "title is required" }, { status: 400 });
  }

  const nextSlug = slugify(body.slug?.trim() || title);
  if (!nextSlug) {
    return Response.json({ error: "slug cannot be empty" }, { status: 400 });
  }

  try {
    const db = getDb();

    // renaming the slug changes a public permalink, so make sure it is free first
    if (nextSlug !== slug) {
      const [clash] = await db
        .select({ slug: projects.slug })
        .from(projects)
        .where(and(eq(projects.slug, nextSlug), ne(projects.slug, slug)))
        .limit(1);
      if (clash) {
        return Response.json({ error: `slug "${nextSlug}" is already taken` }, { status: 409 });
      }
    }

    const [row] = await db
      .update(projects)
      .set({
        slug: nextSlug,
        title,
        desc: body.desc ?? "",
        tags: body.tags ?? [],
        image: body.image ?? "",
        url: body.url ?? "",
        problem: body.problem ?? "",
        approach: body.approach ?? "",
        result: body.result ?? "",
        stack: body.stack ?? [],
        images: body.images ?? [],
        active: body.active ?? false,
        updatedAt: new Date(),
      })
      .where(eq(projects.slug, slug))
      .returning();

    if (!row) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json(row);
  } catch {
    return Response.json({ error: "db error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteContext<"/api/projects/[slug]">) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  try {
    const [row] = await getDb()
      .delete(projects)
      .where(eq(projects.slug, slug))
      .returning({ slug: projects.slug });
    if (!row) return Response.json({ error: "not found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "db error" }, { status: 500 });
  }
}
