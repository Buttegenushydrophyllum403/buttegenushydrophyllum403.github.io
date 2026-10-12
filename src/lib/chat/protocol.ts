/**
 * The chat API streams plain text. One control character is reserved: when the server has to retry
 * a reply that already started streaming (the upstream connection dropped mid-sentence), it sends
 * RESTART and the client discards the half-written reply before the retry streams in.
 */
export const RESTART = "\u001e";
