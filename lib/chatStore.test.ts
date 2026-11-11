import { describe, expect, it } from "vitest";
import {
  MAX_THREADS,
  NEW_CHAT_TITLE,
  createThread,
  listThreads,
  removeThread,
  startThread,
  timeAgo,
  titleFor,
  withMessages,
  type ChatMsg,
  type ChatStore,
} from "./chatStore";

const greet: ChatMsg = { id: "greet", role: "assistant", content: "Hi, welcome!" };
const ask = (content: string): ChatMsg => ({ id: content, role: "user", content });

function storeWith(...questions: string[]): ChatStore {
  const t = createThread(greet, 1000);
  const s = { activeId: t.id, threads: [t] };
  return withMessages(s, [greet, ...questions.map(ask)], 2000);
}

describe("chat threads", () => {
  it("titles a chat from its first question", () => {
    expect(titleFor([greet])).toBe(NEW_CHAT_TITLE);
    expect(titleFor([greet, ask("How many panels do I need?")])).toBe("How many panels do I need?");
    expect(titleFor([greet, ask("a".repeat(80))]).endsWith("…")).toBe(true);
  });

  it("starts a new chat and keeps the previous one", () => {
    const s1 = storeWith("Net metering?");
    const s2 = startThread(s1, greet, 3000);
    expect(s2.threads).toHaveLength(2);
    expect(s2.activeId).not.toBe(s1.activeId);
    expect(s2.threads.find((t) => t.id === s1.activeId)?.title).toBe("Net metering?");
  });

  it("does not stack empty chats when New chat is pressed twice", () => {
    const s1 = startThread(storeWith("Hi"), greet, 3000);
    const s2 = startThread(s1, greet, 4000);
    expect(s2).toBe(s1);
  });

  it(`keeps at most ${MAX_THREADS} chats, dropping the oldest`, () => {
    let s = storeWith("first");
    const firstId = s.activeId;
    for (let i = 0; i < MAX_THREADS + 2; i++) {
      s = startThread(s, greet, 3000 + i * 10);
      s = withMessages(s, [greet, ask(`q${i}`)], 3001 + i * 10);
    }
    expect(s.threads).toHaveLength(MAX_THREADS);
    expect(s.threads.some((t) => t.id === firstId)).toBe(false);
  });

  it("deleting the open chat switches to the most recent other one", () => {
    let s = storeWith("older");
    const older = s.activeId;
    s = startThread(s, greet, 3000);
    s = withMessages(s, [greet, ask("newer")], 3500);
    const next = removeThread(s, s.activeId, greet);
    expect(next.activeId).toBe(older);
    expect(next.threads).toHaveLength(1);
  });

  it("deleting the last chat leaves a fresh one", () => {
    const s = storeWith("only");
    const next = removeThread(s, s.activeId, greet);
    expect(next.threads).toHaveLength(1);
    expect(next.threads[0].title).toBe(NEW_CHAT_TITLE);
  });

  it("lists chats newest first and hides empty ones that are not open", () => {
    let s = storeWith("older");
    s = startThread(s, greet, 3000);
    s = withMessages(s, [greet, ask("newer")], 4000);
    const list = listThreads(s);
    expect(list.map((t) => t.title)).toEqual(["newer", "older"]);
  });

  it("formats time ago", () => {
    const now = 10_000_000;
    expect(timeAgo(now - 10_000, now)).toBe("Just now");
    expect(timeAgo(now - 5 * 60_000, now)).toBe("5 min ago");
    expect(timeAgo(now - 3 * 3_600_000, now)).toBe("3 h ago");
    expect(timeAgo(now - 26 * 3_600_000, now)).toBe("1 day ago");
  });
});
