import { getCookie, getSessionUser, getUploadedFile, replaceUploadedFile } from "../../../../lib/auth-db";

export async function GET(request, context) {
  const user = getSessionUser(getCookie(request, "demo_session"));
  if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const params = await context.params;
  const fileId = Number(params.id);
  if (!Number.isInteger(fileId) || fileId < 1) {
    return Response.json({ error: "Invalid file." }, { status: 400 });
  }

  const file = getUploadedFile(user.id, fileId);
  if (!file) return Response.json({ error: "File not found." }, { status: 404 });

  const safeName = file.filename.replace(/[\r\n"]/g, "_");
  const preview = new URL(request.url).searchParams.get("mode") === "preview";
  return new Response(file.contents, {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.size),
      "Content-Disposition": `${preview ? "inline" : "attachment"}; filename="${safeName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function PUT(request, context) {
  const user = getSessionUser(getCookie(request, "demo_session"));
  if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });
  const params = await context.params;
  const fileId = Number(params.id);
  if (!Number.isInteger(fileId) || fileId < 1) {
    return Response.json({ error: "Invalid file." }, { status: 400 });
  }
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file.arrayBuffer !== "function" || !file.name) {
    return Response.json({ error: "Choose a newer file." }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return Response.json({ error: "Files must be 10 MB or smaller." }, { status: 413 });
  }
  const replaced = replaceUploadedFile({
    userId: user.id,
    fileId,
    filename: file.name,
    mimeType: file.type,
    contents: Buffer.from(await file.arrayBuffer()),
  });
  return replaced
    ? Response.json({ ok: true })
    : Response.json({ error: "File not found." }, { status: 404 });
}
