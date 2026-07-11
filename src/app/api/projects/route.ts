import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import { checkAuth } from "@/lib/auth";

export async function GET() {
  try {
    const data = await getDb().select().from(projects).orderBy(asc(projects.sort));
    return Response.json(data);
  } catch {
    return Response.json([]);
  }
}

export async function PUT(req: Request) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      id?: string;
      title: string;
      desc: string;
      tags: string[];
      image: string;
      url: string;
      sort: number;
    }[];

    await getDb().delete(projects);

    if (body.length > 0) {
      await getDb().insert(projects).values(
        body.map((p) => ({
          title: p.title,
          desc: p.desc ?? "",
          tags: p.tags ?? [],
          image: p.image ?? "",
          url: p.url ?? "",
          sort: p.sort ?? 0,
        }))
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "db error" }, { status: 500 });
  }
}
