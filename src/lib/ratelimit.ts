import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { createRedis } from "./redis";

type Limiter = { limit: (key: string) => Promise<{ success: boolean; reset: number }> };

export type LimitEnv = {
  /** "off" disables the per-visitor limits (local development). Anything else, or unset, enforces them. */
  CHAT_LIMITS?: string;
  CHAT_LIMIT_PER_MINUTE?: string;
  CHAT_LIMIT_PER_DAY?: string;
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
};

/** In-memory sliding window: per server instance only. Add Upstash to share limits across instances. */
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
const unlimited: Limiter = { limit: async () => ({ success: true, reset: Date.now() }) };

function createLimiter(env: LimitEnv, prefix: string, max: number, window: Duration): Limiter {
  const redis = createRedis(env);
  if (redis) return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(max, window), prefix: `rl:${prefix}` });
  const [, amount, unit] = /^(\d+)\s*([smhd])$/.exec(window) ?? [];
  return memoryLimiter(max, Number(amount) * MS[unit]);
}

let cached: { perMinute: Limiter; perDay: Limiter } | null = null;

/** Per-visitor chat limits, created once per server instance. */
export function chatLimiters(env: LimitEnv) {
  if (env.CHAT_LIMITS === "off") return { perMinute: unlimited, perDay: unlimited };
  cached ??= {
    perMinute: createLimiter(env, "chat-m", Number(env.CHAT_LIMIT_PER_MINUTE ?? 8), "1 m"),
    perDay: createLimiter(env, "chat-d", Number(env.CHAT_LIMIT_PER_DAY ?? 40), "1 d"),
  };
  return cached;
}
