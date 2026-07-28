import { createSession, createUser } from "../../../../lib/auth-db";
import { verifyTurnstile } from "../../../../lib/turnstile";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { displayName = "", username = "", password = "", turnstileToken = "" } = body;

  if (!await verifyTurnstile(turnstileToken, request)) {
    return Response.json({ error: "Cloudflare verification failed. Please try again." }, { status: 400 });
  }
  if (displayName.trim().length < 2) {
    return Response.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username.trim())) {
    return Response.json({ error: "Username must be 3–30 letters, numbers, dots, dashes or underscores." }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: "Password must contain at least 8 characters." }, { status: 400 });
  }

  const user = createUser(username, displayName, password);
  if (!user) {
    return Response.json({ error: "That username is already registered." }, { status: 409 });
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
    { status: 201, headers: { "Set-Cookie": cookie, "Cache-Control": "no-store" } }
  );
}
