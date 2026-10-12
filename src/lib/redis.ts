import { Redis } from "@upstash/redis";

/** Upstash Redis when configured, otherwise null (callers fall back to in-memory state). */
export function createRedis(env: { UPSTASH_REDIS_REST_URL?: string; UPSTASH_REDIS_REST_TOKEN?: string }): Redis | null {
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = env;
  if (!url || !token) return null;
  return new Redis({ url, token });
}
