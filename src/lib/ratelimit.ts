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

export const chatPerMinute = createLimiter("chat-m", 8, "1 m");
export const chatPerDay = createLimiter("chat-d", 40, "1 d");
export const contactLimiter = createLimiter("contact", 3, "10 m");
