/**
 * Cloudflare Worker for the AI twin. The site itself is static (GitHub Pages), so the one piece that
 * needs a server lives here: it holds the Gemini key and streams replies back to the browser.
 *
 *   npm run twin:dev      run it locally (reads .dev.vars)
 *   npm run twin:deploy   publish it (secrets: npx wrangler secret put GEMINI_API_KEY)
 */
import { handleChat, type ChatEnv } from "../src/lib/chat/handler";

export type WorkerEnv = ChatEnv & {
  /** Comma-separated origins allowed to call the chat, e.g. "https://rifatsarwarcodes.github.io". */
  ALLOWED_ORIGINS?: string;
  /** "false" stops http://localhost:* from calling the deployed worker. */
  ALLOW_LOCALHOST?: string;
};

export function isAllowedOrigin(origin: string, env: WorkerEnv) {
  const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean);
  if (allowed.includes(origin)) return true;
  return env.ALLOW_LOCALHOST !== "false" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function withCors(res: Response, origin: string | null) {
  const headers = new Headers(res.headers);
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

const worker = {
  async fetch(req: Request, env: WorkerEnv): Promise<Response> {
    const origin = req.headers.get("Origin");
    const allowedOrigin = origin && isAllowedOrigin(origin, env) ? origin : null;
    const { pathname } = new URL(req.url);

    if (pathname !== "/chat") return new Response("Not found", { status: 404 });

    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: allowedOrigin ? 204 : 403,
        headers: allowedOrigin
          ? {
              "Access-Control-Allow-Origin": allowedOrigin,
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Max-Age": "86400",
              Vary: "Origin",
            }
          : {},
      });
    }
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { Allow: "POST, OPTIONS" } });
    // Browsers always send Origin on cross-site POSTs; refuse other sites (and origin-less scripts).
    if (!allowedOrigin) return new Response("Forbidden", { status: 403 });

    return withCors(await handleChat(req, env), allowedOrigin);
  },
};

export default worker;
