import { createHash } from "node:crypto";

/** A salted hash of the visitor IP: good enough to rate limit, useless to identify anyone. */
export function visitorKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || headers.get("x-real-ip") || "unknown";
  const salt = process.env.IP_HASH_SALT ?? "local-dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
