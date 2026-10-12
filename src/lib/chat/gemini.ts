/**
 * Minimal streaming client for the Gemini REST API.
 *
 * Why not the official SDK: its stream parser throws away the final chunk whenever the connection
 * ends without a trailing blank line ("Incomplete JSON segment at the end"), which cut replies off
 * mid-sentence. Here every event that can be parsed is kept, and a stream that ends without a
 * finish reason is reported as truncated so the caller can retry.
 */

const API = "https://generativelanguage.googleapis.com/v1beta/models";

export type GeminiTurn = { role: "user" | "model"; text: string };

export type GeminiEvent = { text?: string; finishReason?: string; promptTokens?: number; outputTokens?: number };

/** HTTP error from the API (429 quota, 404 unknown model, 5xx overloaded, ...). */
export class GeminiHttpError extends Error {
  constructor(readonly status: number, detail: string) {
    super(`Gemini HTTP ${status}: ${detail.slice(0, 200)}`);
  }
}

/** The connection closed before Gemini said it was finished. */
export class GeminiTruncatedError extends Error {
  constructor() {
    super("Gemini stream ended without a finish reason");
  }
}

/** Gemini finished without producing any text (e.g. finishReason MALFORMED_RESPONSE). Worth a retry. */
export class GeminiEmptyReplyError extends Error {
  constructor(readonly finishReason: string | undefined) {
    super(`Gemini returned no text (finish=${finishReason ?? "n/a"})`);
  }
}

type RawChunk = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  promptFeedback?: { blockReason?: string };
  error?: { code?: number; message?: string };
};

function toEvent(raw: RawChunk): GeminiEvent {
  if (raw.error) throw new GeminiHttpError(raw.error.code ?? 500, raw.error.message ?? "stream error");
  const candidate = raw.candidates?.[0];
  const text = candidate?.content?.parts
    ?.filter((p) => !p.thought && p.text)
    .map((p) => p.text)
    .join("");
  return {
    text: text || undefined,
    // A blocked prompt has no candidates, only a block reason.
    finishReason: candidate?.finishReason ?? (raw.promptFeedback?.blockReason ? "SAFETY" : undefined),
    promptTokens: raw.usageMetadata?.promptTokenCount,
    outputTokens: raw.usageMetadata?.candidatesTokenCount,
  };
}

/** Parses one SSE event block ("data: {...}" lines). Returns null for keep-alives and partial JSON. */
function parseEvent(block: string): RawChunk | null {
  const data = block
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .join("");
  if (!data) return null;
  try {
    return JSON.parse(data) as RawChunk;
  } catch {
    return null;
  }
}

export async function* streamGemini(opts: {
  apiKey: string;
  model: string;
  system: string;
  turns: GeminiTurn[];
  maxOutputTokens: number;
  temperature: number;
  thinkingLevel?: string;
  signal?: AbortSignal;
}): AsyncGenerator<GeminiEvent> {
  const res = await fetch(`${API}/${encodeURIComponent(opts.model)}:streamGenerateContent?alt=sse`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": opts.apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: opts.turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
      generationConfig: {
        maxOutputTokens: opts.maxOutputTokens,
        temperature: opts.temperature,
        ...(opts.thinkingLevel ? { thinkingConfig: { thinkingLevel: opts.thinkingLevel } } : {}),
      },
    }),
    signal: opts.signal,
  });
  if (!res.ok || !res.body) throw new GeminiHttpError(res.status, await res.text().catch(() => ""));

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finished = false;

  const handle = (block: string) => {
    const raw = parseEvent(block);
    if (!raw) return null;
    const event = toEvent(raw);
    if (event.finishReason) finished = true;
    return event;
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      const event = handle(block);
      if (event) yield event;
    }
  }
  // The last event may arrive without its trailing blank line: keep it if it parses.
  const tail = handle(buffer + decoder.decode());
  if (tail) yield tail;

  if (!finished) throw new GeminiTruncatedError();
}
