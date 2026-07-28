import { authenticate, createSession } from "../../../../lib/auth-db";
import { verifyTurnstile } from "../../../../lib/turnstile";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { username = "", password = "", turnstileToken = "" } = body;

  if (!await verifyTurnstile(turnstileToken, request)) {
    return Response.json({ error: "Cloudflare verification failed. Please try again." }, { status: 400 });
  }

  const user = authenticate(username, password);
  if (!user) {
    return Response.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const session = createSession(user.id);
  const cookie = [
    `demo_session=${encodeURIComponent(session.token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${30 * 24 * 60 * 60}`,
  ].join("; ");

  return Response.json(
    { user: { username: user.username, displayName: user.displayName } },
    { headers: { "Set-Cookie": cookie, "Cache-Control": "no-store" } }
  );
}
