import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { addSpend, dailyBudgetUsd, estimateCostUsd, getTodaySpend } from "@/lib/chat/spend";
import { prepareMessages } from "@/lib/chat/validate";
import { visitorKey } from "@/lib/ip";
import { chatPerDay, chatPerMinute } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-5";

const LINES = {
  disabled: "My AI twin is taking a nap. Real Rifat is awake at /contact, though.",
  rateLimited: "Whoa, easy. Even my AI brain needs a breather. Try again in a minute, or reach real Rifat at /contact.",
  budget: "I've talked so much today that my budget filed a complaint. Come back tomorrow, or ask real Rifat at /contact.",
  invalid: "I couldn't read that message. Try something shorter?",
  refusal: "Yeah, I'm not touching that one. Ask me about rovers, drones or apps instead.",
  maxTokens: "…and I'm rambling. Ask me to continue if you want the rest.",
  error: "Something short-circuited on my end. Give it another go in a moment, or reach real Rifat at /contact.",
};

function plain(text: string, status: number) {
  return new Response(text, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

export async function POST(req: Request) {
  if (process.env.CHAT_ENABLED === "false") return plain(LINES.disabled, 503);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return plain(LINES.invalid, 400);
  }
  const prepared = prepareMessages(body);
  if (!prepared.ok) return plain(LINES.invalid, 400);

  const key = visitorKey(req.headers);
  const [minute, day] = await Promise.all([chatPerMinute.limit(key), chatPerDay.limit(key)]);
  if (!minute.success || !day.success) return plain(LINES.rateLimited, 429);

  if (process.env.CHAT_MOCK === "1") return mockStream(prepared.messages.at(-1)!.content);

  if ((await getTodaySpend()) >= dailyBudgetUsd()) return plain(LINES.budget, 503);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (text: string) => controller.enqueue(encoder.encode(text));
      try {
        const response = getClient().beta.messages.stream(
          {
            model: MODEL,
            max_tokens: 1024,
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            output_config: { effort: "low" },
            system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
            messages: prepared.messages,
          },
          { signal: req.signal },
        );

        let sentText = false;
        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send(event.delta.text);
            sentText = true;
          }
        }

        const final = await response.finalMessage();
        if (final.stop_reason === "refusal") send(sentText ? `\n\n${LINES.refusal}` : LINES.refusal);
        else if (final.stop_reason === "max_tokens") send(`\n\n${LINES.maxTokens}`);

        const cost = estimateCostUsd(final.usage);
        await addSpend(cost);
        // Token counts only: chat content is never logged.
        console.info(
          `[chat] model=${final.model} stop=${final.stop_reason} in=${final.usage.input_tokens} ` +
            `cache_read=${final.usage.cache_read_input_tokens ?? 0} cache_write=${final.usage.cache_creation_input_tokens ?? 0} ` +
            `out=${final.usage.output_tokens} usd=${cost.toFixed(4)}`,
        );
      } catch (err) {
        if (req.signal.aborted) {
          // Visitor pressed stop or closed the panel.
        } else if (err instanceof Anthropic.RateLimitError) {
          send(LINES.rateLimited);
        } else if (err instanceof Anthropic.APIError) {
          console.error(`[chat] api error status=${err.status} request_id=${err.requestID ?? "n/a"}`);
          send(LINES.error);
        } else {
          console.error("[chat] unexpected error", err instanceof Error ? err.message : err);
          send(LINES.error);
        }
      } finally {
        try {
          controller.close();
        } catch {
          // Already closed by an aborted request.
        }
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}

/** Canned streaming reply for local development and end-to-end tests (CHAT_MOCK=1). */
function mockStream(question: string) {
  const reply = `Mock twin here. You asked: "${question.slice(0, 80)}". In real life I'd tell you about GenieA (10K+ downloads) or the rover that placed 6th globally at IRC. See /projects.`;
  const encoder = new TextEncoder();
  const words = reply.split(/(\s+)/);
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const w of words) {
        controller.enqueue(encoder.encode(w));
        await new Promise((r) => setTimeout(r, 15));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
