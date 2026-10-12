import { chatCopy } from "@/content";
import { GeminiEmptyReplyError, GeminiHttpError, GeminiTruncatedError, streamGemini, type GeminiTurn } from "@/lib/chat/gemini";
import { RESTART } from "@/lib/chat/protocol";
import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { prepareMessages } from "@/lib/chat/validate";
import { visitorKey } from "@/lib/ip";
import { chatPerDay, chatPerMinute } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Tried in order. Flash-Lite leads because its free-tier daily quota lasts much longer; when a model's
 * quota runs out (429), it's missing (404) or keeps failing, the next one takes over.
 */
const MODELS = (process.env.GEMINI_MODELS ?? "gemini-3.5-flash-lite,gemini-3.8-flash,gemini-3.1-flash-lite")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

const LINES = chatCopy.replies;
const BLOCKED = new Set(["SAFETY", "BLOCKLIST", "PROHIBITED_CONTENT", "SPII", "RECITATION", "IMAGE_SAFETY"]);

function plain(text: string, status: number) {
  return new Response(text, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}

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
  if (!day.success) return plain(LINES.dailyLimit, 429);
  if (!minute.success) return plain(LINES.rateLimited, 429);

  if (process.env.CHAT_MOCK === "1") return mockStream(prepared.messages.at(-1)!.content);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY is not set (add it to .env.local, or to Vercel's environment variables)");
    return plain(LINES.disabled, 503);
  }

  const turns: GeminiTurn[] = prepared.messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", text: m.content }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (text: string) => controller.enqueue(encoder.encode(text));
      // True while the visitor can see part of a reply. A retry first sends RESTART to clear it.
      let visible = false;
      let lastError: unknown;

      try {
        // Each model gets a retry for transient failures (dropped connection, 5xx). Quota (429) or a
        // missing model (404) moves straight to the next model. A rejected key (401/403) stops everything.
        for (const model of MODELS) {
          for (let attempt = 0; attempt < 2; attempt++) {
            if (visible) {
              send(RESTART);
              visible = false;
            }
            try {
              let finish: string | undefined;
              let tokens = { in: 0, out: 0 };
              for await (const event of streamGemini({
                apiKey,
                model,
                system: SYSTEM_PROMPT,
                turns,
                maxOutputTokens: 1024,
                temperature: 0.8,
                // A portfolio chat doesn't need deep reasoning. LOW is accepted by all the default models.
                thinkingLevel: "LOW",
                signal: req.signal,
              })) {
                if (event.text) {
                  send(event.text);
                  visible = true;
                }
                finish = event.finishReason ?? finish;
                tokens = { in: event.promptTokens ?? tokens.in, out: event.outputTokens ?? tokens.out };
              }

              if (finish && BLOCKED.has(finish)) send(visible ? `\n\n${LINES.refusal}` : LINES.refusal);
              else if (!visible) throw new GeminiEmptyReplyError(finish);
              else if (finish === "MAX_TOKENS") send(`\n\n${LINES.maxTokens}`);

              // Token counts only: chat content is never logged.
              console.info(`[chat] model=${model} finish=${finish} in=${tokens.in} out=${tokens.out}${attempt ? " (retry)" : ""}`);
              return;
            } catch (err) {
              if (req.signal.aborted) return;
              lastError = err;
              const status = err instanceof GeminiHttpError ? err.status : undefined;
              if (status === 401 || status === 403) throw err;
              if (status === 429 || status === 404) {
                console.warn(`[chat] ${model} unavailable (status=${status}), trying the next model`);
                break;
              }
              const transient = err instanceof GeminiTruncatedError || err instanceof GeminiEmptyReplyError || status === undefined || status >= 500;
              if (!transient) throw err;
              console.warn(`[chat] ${model}: ${err instanceof Error ? err.message : err}${attempt === 0 ? ", retrying" : ", trying the next model"}`);
            }
          }
        }
        throw lastError;
      } catch (err) {
        if (req.signal.aborted) return;
        const status = err instanceof GeminiHttpError ? err.status : undefined;
        console.error(`[chat] giving up: ${err instanceof Error ? err.message : err}`);
        if (status === 401 || status === 403) console.error("[chat] check GEMINI_API_KEY: Google rejected it");
        const line = status === 429 ? LINES.quota : visible ? LINES.cutOff : LINES.error;
        send(visible ? `\n\n${line}` : line);
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
  const reply = `Mock twin here. You asked: "${question.slice(0, 80)}". In real life I'd tell you about GenieA (10K+ users) or the rover that placed 6th globally at IRC. See /projects.`;
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
