/**
 * The chat API streams plain text. One control character is reserved: when the server has to retry
 * a reply that already started streaming (the upstream connection dropped mid-sentence), it sends
 * RESTART and the client discards the half-written reply before the retry streams in.
 */
export const RESTART = "\u001e";

/**
 * Where the browser sends chat messages: the Cloudflare Worker in worker/ (the site itself is static).
 * Set at build time, e.g. NEXT_PUBLIC_CHAT_URL=https://rifat-ai-twin.<you>.workers.dev/chat
 */
export const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_URL ?? "";
