import { redis } from "@/lib/redis";

/** USD per million tokens. Defaults are Claude Opus 5 list prices. */
const PRICE_INPUT = Number(process.env.CHAT_PRICE_INPUT_PER_MTOK ?? 5);
const PRICE_OUTPUT = Number(process.env.CHAT_PRICE_OUTPUT_PER_MTOK ?? 25);
const CACHE_WRITE_MULTIPLIER = 1.25;
const CACHE_READ_MULTIPLIER = 0.1;

type Usage = {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
};

export function estimateCostUsd(usage: Usage): number {
  const input =
    usage.input_tokens +
    (usage.cache_creation_input_tokens ?? 0) * CACHE_WRITE_MULTIPLIER +
    (usage.cache_read_input_tokens ?? 0) * CACHE_READ_MULTIPLIER;
  return (input * PRICE_INPUT + usage.output_tokens * PRICE_OUTPUT) / 1_000_000;
}

const memory = new Map<string, number>();
const dayKey = () => `spend:${new Date().toISOString().slice(0, 10)}`;

export async function getTodaySpend(): Promise<number> {
  const key = dayKey();
  if (redis) return Number((await redis.get<number>(key)) ?? 0);
  return memory.get(key) ?? 0;
}

export async function addSpend(usd: number): Promise<void> {
  const key = dayKey();
  if (redis) {
    await redis.incrbyfloat(key, usd);
    await redis.expire(key, 60 * 60 * 48);
    return;
  }
  memory.set(key, (memory.get(key) ?? 0) + usd);
}

export function dailyBudgetUsd(): number {
  return Number(process.env.CHAT_DAILY_BUDGET_USD ?? 2);
}
