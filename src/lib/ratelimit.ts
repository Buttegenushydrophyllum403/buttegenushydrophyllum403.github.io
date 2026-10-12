import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { redis } from "./redis";

type Limiter = { limit: (key: string) => Promise<{ success: boolean; reset: number }> };

/** In-memory sliding window for local dev (not shared across serverless instances). */
function memoryLimiter(max: number, windowMs: number): Limiter {
  const hits = new Map<string, number[]>();
  return {
    async limit(key) {
      const now = Date.now();
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      const success = recent.length < max;
      if (success) recent.push(now);
      hits.set(key, recent);
      return { success, reset: (recent[0] ?? now) + windowMs };
    },
  };
}

const MS: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

function createLimiter(prefix: string, max: number, window: Duration): Limiter {
  if (redis) {
    return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(max, window), prefix: `rl:${prefix}` });
  }
  const [, amount, unit] = /^(\d+)\s*([smhd])$/.exec(window) ?? [];
  return memoryLimiter(max, Number(amount) * MS[unit]);
}

/** Local development (npm run dev) isn't limited: one person testing would burn through a visitor's daily allowance. */
const unlimited: Limiter = { limit: async () => ({ success: true, reset: Date.now() }) };
const enforce = process.env.NODE_ENV === "production";

/** Per-visitor chat limits. Override with CHAT_LIMIT_PER_MINUTE / CHAT_LIMIT_PER_DAY. */
export const chatPerMinute = enforce ? createLimiter("chat-m", Number(process.env.CHAT_LIMIT_PER_MINUTE ?? 8), "1 m") : unlimited;
export const chatPerDay = enforce ? createLimiter("chat-d", Number(process.env.CHAT_LIMIT_PER_DAY ?? 40), "1 d") : unlimited;
