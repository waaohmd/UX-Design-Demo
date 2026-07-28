import { getCookie, getSessionUser, storeUploadedFile } from "../../../lib/auth-db";

const allowedCategories = new Set([
  "Personal information",
  "Identity / right to work",
  "Tax and payroll",
  "Employment document",
  "Training certificate",
  "Other",
]);

export async function POST(request) {
  const user = getSessionUser(getCookie(request, "demo_session"));
  if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  if (!form) return Response.json({ error: "Invalid upload." }, { status: 400 });
  const category = String(form.get("category") || "");
  const teamIdValue = String(form.get("teamId") || "");
  const file = form.get("file");

  if (!allowedCategories.has(category)) {
    return Response.json({ error: "Select a valid document category." }, { status: 400 });
  }
  if (!file || typeof file.arrayBuffer !== "function" || !file.name) {
    return Response.json({ error: "Select a file." }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return Response.json({ error: "Files must be 10 MB or smaller." }, { status: 413 });
  }

  try {
    const id = storeUploadedFile({
      userId: user.id,
      teamId: teamIdValue ? Number(teamIdValue) : null,
      category,
      filename: file.name,
      mimeType: file.type,
      contents: Buffer.from(await file.arrayBuffer()),
    });
    return Response.json({ id }, { status: 201 });
  } catch {
    return Response.json({ error: "Unable to store this file." }, { status: 400 });
  }
}
