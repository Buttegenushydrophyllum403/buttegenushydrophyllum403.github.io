import { afterEach, describe, expect, it, vi } from "vitest";
import { GeminiHttpError, GeminiTruncatedError, streamGemini } from "@/lib/chat/gemini";

const chunk = (text: string, finishReason?: string) =>
  `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text }] }, ...(finishReason ? { finishReason } : {}) }] })}`;

function mockFetch(body: string, status = 200) {
  const bytes = new TextEncoder().encode(body);
  // A fresh body per call, delivered in awkward 7-byte pieces to exercise the buffering.
  const stream = () =>
    new ReadableStream<Uint8Array>({
      start(c) {
        for (let i = 0; i < bytes.length; i += 7) c.enqueue(bytes.slice(i, i + 7));
        c.close();
      },
    });
  vi.stubGlobal("fetch", vi.fn(async () => new Response(stream(), { status })));
}

async function collect() {
  let text = "";
  let finish: string | undefined;
  for await (const e of streamGemini({ apiKey: "k", model: "m", system: "s", turns: [{ role: "user", text: "hi" }], maxOutputTokens: 10, temperature: 0 })) {
    text += e.text ?? "";
    finish = e.finishReason ?? finish;
  }
  return { text, finish };
}

afterEach(() => vi.unstubAllGlobals());

describe("streamGemini", () => {
  it("reassembles text across chunk boundaries and CRLF delimiters", async () => {
    mockFetch(`${chunk("Hello, ")}\r\n\r\n${chunk("world.", "STOP")}\r\n\r\n`);
    expect(await collect()).toEqual({ text: "Hello, world.", finish: "STOP" });
  });

  it("keeps a final event that arrives without its trailing blank line (the SDK dropped this)", async () => {
    mockFetch(`${chunk("Hello, ")}\n\n${chunk("world.", "STOP")}`);
    expect(await collect()).toEqual({ text: "Hello, world.", finish: "STOP" });
  });

  it("reports a stream that ends mid-reply as truncated, so the route can retry", async () => {
    mockFetch(`${chunk("Hello, ")}\n\ndata: {"candidates": [{"content": {"parts": [{"te`);
    await expect(collect()).rejects.toBeInstanceOf(GeminiTruncatedError);
  });

  it("surfaces HTTP errors with their status (429 quota, 404 model, ...)", async () => {
    mockFetch('{"error":{"code":429}}', 429);
    await expect(collect()).rejects.toMatchObject({ status: 429 });
    await expect(collect()).rejects.toBeInstanceOf(GeminiHttpError);
  });
});
