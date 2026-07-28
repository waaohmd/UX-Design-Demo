const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";

export async function verifyTurnstile(token, request) {
  if (!token) return false;

  const payload = new URLSearchParams({
    secret: turnstileSecret,
    response: token,
  });
  const remoteIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
  if (remoteIp) payload.set("remoteip", remoteIp.split(",")[0].trim());

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
      signal: AbortSignal.timeout(8000),
    });
    const result = await response.json();
    return result.success === true;
  } catch {
    return false;
  }
}
