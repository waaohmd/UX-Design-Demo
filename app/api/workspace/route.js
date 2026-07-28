import { getCookie, getSessionUser, getWorkspaceData } from "../../../lib/auth-db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const user = getSessionUser(getCookie(request, "demo_session"));
  if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });
  return Response.json(getWorkspaceData(user.id), {
    headers: { "Cache-Control": "no-store" },
  });
}
