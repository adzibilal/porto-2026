import { checkAuth } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"];

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "no file" }, { status: 400 });
  }

  if (!ALLOWED.includes(file.type)) {
    return Response.json(
      { error: `unsupported type ${file.type || "unknown"} — use png, jpeg, webp, avif or gif` },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: `too large (${(file.size / 1024 / 1024).toFixed(1)}mb) — max 8mb` },
      { status: 400 }
    );
  }

  // derive the extension from the validated mime type, not the client filename
  const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const key = `${process.env.AWS_FOLDER_NAME}/${randomUUID()}.${ext}`;

  const client = new S3Client({
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: process.env.AWS_USE_PATH_STYLE_ENDPOINT === "true",
  });

  const buf = Buffer.from(await file.arrayBuffer());

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Body: buf,
        ContentType: file.type,
      })
    );
  } catch {
    return Response.json({ error: "upload failed — check s3 config" }, { status: 502 });
  }

  const url = `${process.env.AWS_URL}/${process.env.AWS_BUCKET}/${key}`;
  return Response.json({ url });
}
