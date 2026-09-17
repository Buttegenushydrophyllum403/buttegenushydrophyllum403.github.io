import { Redis } from "@upstash/redis";

/**
 * Upstash Redis when configured (Vercel Marketplace integration), otherwise null.
 * Accepts both the Upstash and the Vercel KV variable names.
 */
function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const redis = createRedis();
