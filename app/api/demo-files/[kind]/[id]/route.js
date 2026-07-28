import { getCookie, getDemoFile, getSessionUser } from "../../../../../lib/auth-db";

export async function GET(request, context) {
  const user = getSessionUser(getCookie(request, "demo_session"));
  if (!user) return Response.json({ error: "Not authenticated." }, { status: 401 });
  const params = await context.params;
  const id = Number(params.id);
  if (!["document", "payroll", "contract"].includes(params.kind) || !Number.isInteger(id) || id < 1) {
    return Response.json({ error: "Invalid file request." }, { status: 400 });
  }
  const file = getDemoFile(user.id, params.kind, id);
  if (!file) return Response.json({ error: "File not found." }, { status: 404 });
  const safeFilename = file.filename.replace(/[\r\n"]/g, "_");
  const preview = new URL(request.url).searchParams.get("mode") === "preview";
  return new Response(file.contents, {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": `${preview ? "inline" : "attachment"}; filename="${safeFilename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
