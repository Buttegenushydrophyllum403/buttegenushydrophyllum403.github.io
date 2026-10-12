/**
 * A salted hash of the visitor IP: good enough to rate limit, useless to identify anyone.
 * Uses Web Crypto, so it runs anywhere (Cloudflare Workers, Node, browsers).
 */
export async function visitorKey(headers: Headers, salt = "local-dev-salt"): Promise<string> {
  const ip =
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`));
  return Array.from(new Uint8Array(digest).slice(0, 16), (b) => b.toString(16).padStart(2, "0")).join("");
}
