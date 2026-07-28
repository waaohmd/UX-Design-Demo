import { deleteSession, getCookie } from "../../../../lib/auth-db";

export async function POST(request) {
  deleteSession(getCookie(request, "demo_session"));
  return Response.json(
    { ok: true },
    { headers: { "Set-Cookie": "demo_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0" } }
  );
}
