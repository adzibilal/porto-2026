import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const valid = password === process.env.ADMIN_PASSWORD;

  if (!valid) {
    return Response.json({ ok: false }, { status: 401 });
  }

  return Response.json({ ok: true });
}
