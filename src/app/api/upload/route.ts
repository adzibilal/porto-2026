import { checkAuth } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File;
  if (!file) {
    return Response.json({ error: "no file" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "png";
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

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: buf,
      ContentType: file.type,
    })
  );

  const url = `${process.env.AWS_URL}/${process.env.AWS_BUCKET}/${key}`;
  return Response.json({ url });
}
