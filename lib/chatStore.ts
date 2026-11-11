// Several SUNARA Assistant conversations per visit, kept in sessionStorage.
// Pure helpers (no React) so they can be unit tested.

export type ChatMsg = { id: string; role: "user" | "assistant"; content: string; form?: "estimate" | "lead" };
export type ChatThread = { id: string; title: string; updatedAt: number; messages: ChatMsg[] };
export type ChatStore = { activeId: string; threads: ChatThread[] };

export const STORE_KEY = "sunara-chats-v2";
const LEGACY_KEY = "sunara-chat-v1";
/** Most conversations kept; the oldest is dropped when a new one would go past this. */
export const MAX_THREADS = 10;
const MAX_MESSAGES = 40;
const TITLE_CHARS = 48;

export const NEW_CHAT_TITLE = "New chat";

export const newId = () => Math.random().toString(36).slice(2, 10);

/** Title from the first question, e.g. "How many panels do I need?". */
export function titleFor(messages: ChatMsg[]) {
  const first = messages.find((m) => m.role === "user" && m.content.trim());
  if (!first) return NEW_CHAT_TITLE;
  const text = first.content.replace(/\s+/g, " ").trim();
  return text.length > TITLE_CHARS ? `${text.slice(0, TITLE_CHARS - 1).trimEnd()}…` : text;
}

/** True when the visitor has not asked anything yet. */
export const isEmptyThread = (t: ChatThread) => !t.messages.some((m) => m.role === "user");

export function createThread(greeting: ChatMsg, now = Date.now()): ChatThread {
  return { id: newId(), title: NEW_CHAT_TITLE, updatedAt: now, messages: [greeting] };
}

/** Saves the active conversation's messages back into its thread. */
export function withMessages(store: ChatStore, messages: ChatMsg[], now = Date.now()): ChatStore {
  return {
    ...store,
    threads: store.threads.map((t) =>
      t.id === store.activeId
        ? { ...t, messages: messages.slice(-MAX_MESSAGES), title: titleFor(messages), updatedAt: isEmptyThread({ ...t, messages }) ? t.updatedAt : now }
        : t
    ),
  };
}

/**
 * Starts a new conversation and keeps the others. Reuses the current one when it is still
 * empty, so pressing "New chat" twice never leaves blank chats in the list.
 */
export function startThread(store: ChatStore, greeting: ChatMsg, now = Date.now()): ChatStore {
  const active = store.threads.find((t) => t.id === store.activeId);
  if (active && isEmptyThread(active)) return store;
  const thread = createThread(greeting, now);
  // The new thread is the newest, so trimming to MAX_THREADS only ever drops the oldest.
  const threads = [thread, ...[...store.threads].sort((a, b) => b.updatedAt - a.updatedAt)].slice(0, MAX_THREADS);
  return { activeId: thread.id, threads };
}

/** Deletes a conversation. Deleting the open one switches to the most recent other, or a fresh chat. */
export function removeThread(store: ChatStore, id: string, greeting: ChatMsg, now = Date.now()): ChatStore {
  const threads = store.threads.filter((t) => t.id !== id);
  if (store.activeId !== id) return { ...store, threads };
  const next = [...threads].sort((a, b) => b.updatedAt - a.updatedAt)[0];
  if (next) return { activeId: next.id, threads };
  const fresh = createThread(greeting, now);
  return { activeId: fresh.id, threads: [fresh] };
}

/** Conversations for the list, newest first. Empty ones other than the open chat are hidden. */
export function listThreads(store: ChatStore) {
  return store.threads
    .filter((t) => t.id === store.activeId || !isEmptyThread(t))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

const isMsg = (m: unknown): m is ChatMsg =>
  !!m && typeof m === "object" && typeof (m as ChatMsg).content === "string" && ((m as ChatMsg).role === "user" || (m as ChatMsg).role === "assistant");

export function loadStore(greeting: ChatMsg): ChatStore {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ChatStore;
      const threads = (Array.isArray(parsed?.threads) ? parsed.threads : [])
        .filter((t) => t && typeof t.id === "string" && Array.isArray(t.messages))
        .map((t) => ({ ...t, messages: t.messages.filter(isMsg).slice(-MAX_MESSAGES), title: titleFor(t.messages.filter(isMsg)) }))
        .filter((t) => t.messages.length)
        .slice(0, MAX_THREADS);
      if (threads.length) {
        const activeId = threads.some((t) => t.id === parsed.activeId) ? parsed.activeId : threads[0].id;
        return { activeId, threads };
      }
    }
    // One conversation saved by the earlier single chat version.
    const legacy = sessionStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const messages = (JSON.parse(legacy) as unknown[]).filter(isMsg);
      sessionStorage.removeItem(LEGACY_KEY);
      if (messages.length) {
        const thread = { ...createThread(greeting), messages, title: titleFor(messages) };
        return { activeId: thread.id, threads: [thread] };
      }
    }
  } catch {}
  const fresh = createThread(greeting);
  return { activeId: fresh.id, threads: [fresh] };
}

export function saveStore(store: ChatStore) {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {}
}

/** "Just now", "5 min ago", "2 h ago", "3 days ago". */
export function timeAgo(then: number, now = Date.now()) {
  const min = Math.floor((now - then) / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}
