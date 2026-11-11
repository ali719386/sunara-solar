export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

export const CHAT_LIMITS = {
  maxMessages: 10,
  maxChars: 500,
};

/**
 * Validates and clamps a chat request body. Keeps the last 10 user/assistant messages,
 * trims each to 500 characters, drops empty or unknown entries, and makes sure the
 * conversation starts with a user turn and ends with one. Returns null when unusable.
 */
export function validateChatBody(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw)) return null;

  const cleaned: ChatMessage[] = [];
  for (const m of raw.slice(-CHAT_LIMITS.maxMessages * 2)) {
    if (!m || typeof m !== "object") continue;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;
    // Strip control characters except newlines and tabs.
    const text = content.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim().slice(0, CHAT_LIMITS.maxChars);
    if (!text) continue;
    // Merge consecutive turns from the same role so the API sees a clean alternation.
    const last = cleaned[cleaned.length - 1];
    if (last && last.role === role) last.content = `${last.content}\n${text}`.slice(0, CHAT_LIMITS.maxChars);
    else cleaned.push({ role, content: text });
  }

  let messages = cleaned.slice(-CHAT_LIMITS.maxMessages);
  while (messages.length && messages[0].role !== "user") messages = messages.slice(1);
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

/** Streamed instead of text when the chat API fails before any text was sent; the widget then answers locally. */
export const CHAT_ERROR_SENTINEL = "\u0000ERR";
