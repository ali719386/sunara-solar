"use client";

import { Fragment, useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, MessagesSquare, Plus, SendHorizontal, Trash2, X } from "lucide-react";
import { CHAT_ERROR_SENTINEL, CHAT_LIMITS } from "@/lib/chatValidation";
import { detectLang, estimateText, fallbackReply, hasBuyingIntent, type FallbackAction } from "@/lib/chatFallback";
import { estimateFor } from "@/lib/solarCalc";
import { currencies, currencyCodes, findPreset, locationSuggestions, type CurrencyCode } from "@/lib/solarConfig";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { useMotion } from "./MotionProvider";
import {
  listThreads,
  loadStore,
  newId,
  removeThread,
  saveStore,
  startThread,
  timeAgo,
  withMessages,
  type ChatMsg,
  type ChatStore,
} from "@/lib/chatStore";

type Msg = ChatMsg;

const GREETING: Msg = {
  id: "greet",
  role: "assistant",
  content:
    "Hi, welcome to SUNARA! I can help with solar panels, savings and your free roof assessment. What would you like to know?",
};
const CHIPS = [
  "How many panels do I need?",
  "Pros and cons of solar",
  "How much can I save?",
  "Net metering explained",
  "Installment options",
  "Book a free assessment",
];
const BUSY_TEXT = "I’m getting a lot of questions right now. Please try again in a minute, or chat with our team on WhatsApp.";
const PHONE_RE = /^[+\d][\d\s-]{6,}$/;

let aiAvailable: boolean | null = null; // cached for the page session
const uid = newId;
const activeMessages = (store: ChatStore) => store.threads.find((t) => t.id === store.activeId)?.messages ?? [GREETING];

/* ───────────── Minimal markdown: **bold**, "- " lists, [links](url) and bare URLs ───────────── */

const SAFE_HREF = /^(\/(?!\/)|https?:\/\/|tel:|mailto:)/i;

function inline(text: string, key: string) {
  const out: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s)]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${i++}`;
    if (m[1]) out.push(<strong key={k}>{m[1]}</strong>);
    else {
      const label = m[2] ?? m[4];
      const href = m[3] ?? m[4];
      if (SAFE_HREF.test(href)) {
        const external = /^https?:/i.test(href);
        out.push(
          <a key={k} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {label}
          </a>
        );
      } else out.push(label);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Markdown({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.split("\n");
  let list: string[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) {
      const k = `p${blocks.length}`;
      blocks.push(
        <p key={k}>
          {para.map((l, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              {inline(l, `${k}-${i}`)}
            </Fragment>
          ))}
        </p>
      );
      para = [];
    }
    if (list.length) {
      const k = `l${blocks.length}`;
      blocks.push(
        <ul key={k}>
          {list.map((l, i) => (
            <li key={i}>{inline(l, `${k}-${i}`)}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    const item = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (item) {
      if (para.length) {
        const keep = list;
        list = [];
        flush();
        list = keep;
      }
      list.push(item[1]);
    } else if (!line) flush();
    else {
      if (list.length) {
        const keep = para;
        para = [];
        flush();
        para = keep;
      }
      para.push(line.replace(/^#+\s*/, ""));
    }
  }
  flush();
  return <>{blocks}</>;
}

/* ───────────── Inline forms ───────────── */

function EstimateForm({ onDone }: { onDone: (summary: string, reply: string) => void }) {
  const id = useId();
  const [location, setLocation] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("PKR");
  const [bill, setBill] = useState("");
  const [roof, setRoof] = useState("1500");
  const [error, setError] = useState("");

  const onLocation = (v: string) => {
    setLocation(v);
    const p = findPreset(v);
    if (p) setCurrency(p.currency);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const billNum = Number(bill);
    const roofNum = Number(roof);
    if (!location.trim() || !Number.isFinite(billNum) || billNum <= 0 || !Number.isFinite(roofNum) || roofNum <= 0) {
      setError("Please add your location, monthly bill and roof size.");
      return;
    }
    const result = estimateFor({ location, currency, monthlyBill: billNum, roofSqFt: roofNum });
    const sym = currencies[currency].symbol;
    onDone(
      `${location.trim()}, bill ${sym}${billNum.toLocaleString("en-US")}/month, roof ${roofNum.toLocaleString("en-US")} sq ft`,
      estimateText(result)
    );
  };

  return (
    <form className="chat-form" onSubmit={submit} noValidate>
      <label htmlFor={`${id}-loc`}>Location</label>
      <input id={`${id}-loc`} list={`${id}-places`} value={location} onChange={(e) => onLocation(e.target.value)} placeholder="e.g. Lahore" maxLength={60} autoComplete="address-level2" />
      <datalist id={`${id}-places`}>
        {locationSuggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <div className="chat-form-row">
        <div>
          <label htmlFor={`${id}-bill`}>Monthly bill</label>
          <div className="chat-form-bill">
            <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
              {currencyCodes.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input id={`${id}-bill`} type="number" inputMode="numeric" min={0} value={bill} onChange={(e) => setBill(e.target.value)} placeholder={String(currencies[currency].bill.default)} />
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-roof`}>Roof (sq ft)</label>
          <input id={`${id}-roof`} type="number" inputMode="numeric" min={300} max={6000} value={roof} onChange={(e) => setRoof(e.target.value)} />
        </div>
      </div>
      {error && <p className="chat-form-error">{error}</p>}
      <button type="submit" className="chat-form-submit">
        Estimate my system
      </button>
    </form>
  );
}

function LeadForm({ onDone }: { onDone: (name: string, url: string) => void }) {
  const id = useId();
  const [v, setV] = useState({ name: "", phone: "", location: "" });
  const [error, setError] = useState("");
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = v.phone.trim();
    if (v.name.trim().length < 2 || !PHONE_RE.test(phone) || phone.replace(/\D/g, "").length < 10 || v.location.trim().length < 2) {
      setError("Please add your name, a valid phone number and your location.");
      return;
    }
    const url = whatsappUrl(
      `Hi SUNARA, I’d like a free roof assessment.\nName: ${v.name.trim()}\nPhone: ${phone}\nLocation: ${v.location.trim()}`
    );
    // Nothing is stored or sent to our server; WhatsApp opens with the details ready to send.
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    onDone(v.name.trim(), url);
  };

  return (
    <form className="chat-form" onSubmit={submit} noValidate>
      <label htmlFor={`${id}-name`}>Name</label>
      <input id={`${id}-name`} value={v.name} onChange={set("name")} autoComplete="name" maxLength={60} />
      <div className="chat-form-row">
        <div>
          <label htmlFor={`${id}-phone`}>Phone</label>
          <input id={`${id}-phone`} type="tel" inputMode="tel" value={v.phone} onChange={set("phone")} autoComplete="tel" placeholder="0300 1234567" maxLength={20} />
        </div>
        <div>
          <label htmlFor={`${id}-loc`}>Location</label>
          <input id={`${id}-loc`} value={v.location} onChange={set("location")} autoComplete="address-level2" placeholder="e.g. Lahore" maxLength={60} />
        </div>
      </div>
      {error && <p className="chat-form-error">{error}</p>}
      <button type="submit" className="chat-form-submit is-wa">
        <WhatsAppIcon size={16} />
        Send on WhatsApp
      </button>
      <p className="chat-form-note">Your details go straight to WhatsApp. We don’t store them here.</p>
    </form>
  );
}

/* ───────────── Panel ───────────── */

export default function ChatPanel({ open, onClose, icon }: { open: boolean; onClose: () => void; icon: string }) {
  const { enabled: motion } = useMotion();
  const [initial] = useState(() => loadStore(GREETING));
  const [store, setStore] = useState<ChatStore>(initial);
  const [messages, setMessages] = useState<Msg[]>(() => activeMessages(initial));
  const [view, setView] = useState<"chat" | "list">("chat");
  const activeRef = useRef(initial.activeId);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ai, setAi] = useState<boolean | null>(aiAvailable);
  const panel = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const abort = useRef<AbortController | null>(null);
  const timers = useRef<number[]>([]);

  // Is the AI configured? Decides the footer copy and whether to call the API at all.
  useEffect(() => {
    if (aiAvailable !== null) return;
    fetch("/api/chat")
      .then((r) => r.json() as Promise<{ ai?: boolean }>)
      .then((d) => {
        aiAvailable = Boolean(d.ai);
        setAi(aiAvailable);
      })
      .catch(() => setAi(false));
  }, []);

  // Keep the open conversation saved in its thread, and the threads saved for this tab.
  useEffect(() => setStore((s) => withMessages(s, messages)), [messages]);
  useEffect(() => saveStore(store), [store]);

  useEffect(
    () => () => {
      abort.current?.abort();
      timers.current.forEach((t) => window.clearInterval(t));
    },
    []
  );

  // Applied a frame after `open` changes, so the first open animates from the closed state too.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setShown(open));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [open]);

  // Focus the input on open, and lock page scroll behind the full screen sheet on phones.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => field.current?.focus({ preventScroll: true }), 80);
    const phone = window.matchMedia("(max-width: 760px)").matches;
    if (phone) document.documentElement.classList.add("chat-lock");
    return () => {
      window.clearTimeout(t);
      document.documentElement.classList.remove("chat-lock");
    };
  }, [open]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = listRef.current;
    if (el && open) el.scrollTo({ top: el.scrollHeight, behavior: motion ? "smooth" : "auto" });
  }, [messages, loading, open, motion]);

  const update = (id: string, content: string) =>
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, content } : m)));

  /** Reveals local text in small steps so it reads like the streamed replies. */
  const typeOut = (text: string) =>
    new Promise<void>((resolve) => {
      const id = uid();
      const chatId = activeRef.current;
      if (!motion) {
        setMessages((ms) => [...ms, { id, role: "assistant", content: text }]);
        return resolve();
      }
      setMessages((ms) => [...ms, { id, role: "assistant", content: "" }]);
      let n = 0;
      const t = window.setInterval(() => {
        if (activeRef.current !== chatId) {
          window.clearInterval(t);
          return resolve();
        }
        n = Math.min(text.length, n + 4);
        update(id, text.slice(0, n));
        if (n >= text.length) {
          window.clearInterval(t);
          resolve();
        }
      }, 16);
      timers.current.push(t);
    });

  const addForm = (form: FallbackAction) =>
    setMessages((ms) => (ms.some((m) => m.form === form) ? ms : [...ms, { id: uid(), role: "assistant", content: "", form }]));

  /** Streams an answer from /api/chat. "fail" means the local responder should answer instead. */
  const askApi = async (history: Msg[]): Promise<"ok" | "busy" | "fail"> => {
    const controller = new AbortController();
    abort.current = controller;
    const payload = history
      .filter((m) => !m.form && m.id !== GREETING.id && m.content.trim())
      .slice(-CHAT_LIMITS.maxMessages)
      .map(({ role, content }) => ({ role, content }));
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: controller.signal,
      });
      if (res.status === 429) return "busy";
      if (res.status === 503) {
        aiAvailable = false;
        setAi(false);
      }
      if (!res.ok || !res.body) return "fail";
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      let id = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        if (text.startsWith("\u0000")) continue; // error marker, never shown
        if (!id) {
          id = uid();
          const first = text;
          setMessages((ms) => [...ms, { id, role: "assistant", content: first }]);
        } else update(id, text);
      }
      text += decoder.decode();
      if (text.startsWith(CHAT_ERROR_SENTINEL) || !text.trim()) return "fail";
      return "ok";
    } catch {
      return controller.signal.aborted ? "ok" : "fail";
    } finally {
      if (abort.current === controller) abort.current = null;
    }
  };

  const send = async (raw: string) => {
    const text = raw.trim().slice(0, CHAT_LIMITS.maxChars);
    if (!text || loading) return;
    const user: Msg = { id: uid(), role: "user", content: text };
    // Drop unfinished forms once the user types instead.
    const history = [...messages.filter((m) => !m.form), user];
    setMessages(history);
    setInput("");
    setLoading(true);
    const chatId = activeRef.current;
    const moved = () => activeRef.current !== chatId;

    const local = fallbackReply(text);
    let outcome: "ok" | "busy" | "fail" = "fail";
    if (ai !== false) outcome = await askApi(history);
    if (moved()) return;

    if (outcome === "busy") await typeOut(BUSY_TEXT);
    else if (outcome === "fail") {
      await new Promise((r) => setTimeout(r, motion ? 450 : 0));
      await typeOut(local.text);
      if (moved()) return;
      if (local.action) addForm(local.action);
    }
    if (moved()) return;
    if (outcome !== "busy" && hasBuyingIntent(text)) addForm("lead");
    setLoading(false);
  };

  const finishForm = (form: FallbackAction, userText: string, reply: string) => {
    setMessages((ms) => [
      ...ms.filter((m) => m.form !== form),
      { id: uid(), role: "user", content: userText },
    ]);
    void typeOut(reply);
  };

  /** Stops any reply in progress before switching conversations. */
  const stopActivity = () => {
    abort.current?.abort();
    timers.current.forEach((t) => window.clearInterval(t));
    timers.current = [];
    setLoading(false);
  };

  const activate = (next: ChatStore) => {
    activeRef.current = next.activeId;
    setStore(next);
    setMessages(activeMessages(next));
    setView("chat");
    setInput("");
    window.setTimeout(() => field.current?.focus({ preventScroll: true }), 30);
  };

  /** Opens a fresh conversation; the current one stays in the chat list. */
  const newChat = () => {
    stopActivity();
    activate(startThread(withMessages(store, messages), GREETING));
  };

  const openThread = (id: string) => {
    if (id !== store.activeId) stopActivity();
    activate({ ...withMessages(store, messages), activeId: id });
  };

  const deleteThread = (id: string) => {
    const next = removeThread(withMessages(store, messages), id, GREETING);
    if (id === store.activeId) {
      stopActivity();
      activeRef.current = next.activeId;
      setMessages(activeMessages(next));
    }
    setStore(next);
  };

  // Esc closes; Tab stays inside the dialog.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      // From the chat list, Esc goes back to the conversation first.
      if (view === "list") setView("chat");
      else onClose();
      return;
    }
    if (e.key !== "Tab" || !panel.current) return;
    const items = Array.from(
      panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), textarea, input, select")
    ).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(input);
    }
  };

  const autosize = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    el.style.overflowY = el.scrollHeight > 120 ? "auto" : "hidden";
  }, []);
  useEffect(() => autosize(field.current), [input, autosize]);

  const questions = messages.filter((m) => m.role === "user").slice(-3).map((m) => m.content.replace(/\s+/g, " ").slice(0, 120));
  const waSummary = questions.length
    ? `Hi SUNARA, I was chatting with your website assistant about: ${questions.join(" | ")}. Could you help me further?`
    : undefined;
  const waHref = whatsappUrl(waSummary);
  const streaming = loading && messages[messages.length - 1]?.role === "assistant" && !messages[messages.length - 1]?.form;
  const lang = detectLang(questions[questions.length - 1] ?? "");
  const threads = listThreads(store);

  return (
    <div
      ref={panel}
      id="sunara-chat"
      className={`chat-panel ${shown ? "is-open" : ""}`}
      role="dialog"
      aria-modal="false"
      aria-label="SUNARA Assistant chat"
      inert={!open}
      onKeyDown={onKeyDown}
    >
      <header className="chat-head">
        {view === "list" ? (
          <button type="button" className="chat-icon-btn" onClick={() => setView("chat")} aria-label="Back to chat" title="Back to chat">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- tiny static icon
          <img src={icon} alt="" width={40} height={40} className="chat-avatar" />
        )}
        <div className="chat-head-text">
          <p className="chat-title">{view === "list" ? "Your chats" : "SUNARA Assistant"}</p>
          <p className="chat-subtitle">
            {view === "list" ? `${threads.length} ${threads.length === 1 ? "conversation" : "conversations"}` : "Solar answers in seconds"}
          </p>
        </div>
        {view === "chat" && (
          <button
            type="button"
            className="chat-icon-btn chat-threads-btn"
            onClick={() => setView("list")}
            aria-label={`Your chats (${threads.length})`}
            title="Your chats"
          >
            <MessagesSquare size={17} aria-hidden="true" />
            {threads.length > 1 && <span className="chat-badge" aria-hidden="true">{threads.length}</span>}
          </button>
        )}
        <button
          type="button"
          className={`chat-icon-btn chat-new ${view === "chat" ? "is-compact" : ""}`}
          onClick={newChat}
          title="New chat (this one stays in your chats)"
        >
          <Plus size={view === "chat" ? 18 : 16} aria-hidden="true" />
          <span className={view === "chat" ? "sr-only" : undefined}>New chat</span>
        </button>
        <button type="button" className="chat-icon-btn" onClick={onClose} aria-label="Close chat">
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      {view === "list" && (
        <div className="chat-threads">
          <ul aria-label="Your chats">
            {threads.map((t) => {
              const asked = t.messages.filter((m) => m.role === "user").length;
              const active = t.id === store.activeId;
              return (
                <li key={t.id} className={`chat-thread ${active ? "is-active" : ""}`}>
                  <button type="button" className="chat-thread-open" onClick={() => openThread(t.id)} aria-current={active ? "true" : undefined}>
                    <span className="chat-thread-title" dir="auto">{t.title}</span>
                    <span className="chat-thread-meta">
                      {asked ? `${asked} ${asked === 1 ? "question" : "questions"} · ${timeAgo(t.updatedAt)}` : "No questions yet"}
                      {active && <span className="chat-thread-now"> · Open</span>}
                    </span>
                  </button>
                  <button type="button" className="chat-thread-del" onClick={() => deleteThread(t.id)} aria-label={`Delete chat: ${t.title}`} title="Delete chat">
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="chat-threads-note">Chats are kept on this device until you close the tab.</p>
        </div>
      )}

      <div
        ref={listRef}
        className="chat-list"
        hidden={view === "list"}
        aria-live="polite"
        aria-busy={streaming}
        aria-relevant="additions text"
      >
        {messages.map((m, i) =>
          m.form ? (
            <div key={m.id} className="chat-msg is-assistant is-form">
              {m.form === "estimate" ? (
                <EstimateForm onDone={(summary, reply) => finishForm("estimate", summary, reply)} />
              ) : (
                <LeadForm
                  onDone={(name, url) =>
                    finishForm(
                      "lead",
                      lang === "en" ? "Details sent on WhatsApp" : "WhatsApp par details bhej di",
                      `Thanks, ${name}! WhatsApp should now be open with your details ready to send. Our team replies during opening hours.${url ? ` If it didn’t open, [tap here](${url}).` : ""}`
                    )
                  }
                />
              )}
            </div>
          ) : (
            <Fragment key={m.id}>
              <div className={`chat-msg is-${m.role}`} dir="auto">
                {m.role === "assistant" ? <Markdown text={m.content} /> : <p>{m.content}</p>}
              </div>
              {i === 0 && messages.length === 1 && (
                <div className="chat-chips" role="group" aria-label="Suggested questions">
                  {CHIPS.map((c) => (
                    <button key={c} type="button" className="chat-chip" onClick={() => void send(c)}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </Fragment>
          )
        )}
        {loading && !streaming && (
          <div className="chat-msg is-assistant chat-typing" aria-label="Assistant is typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <form
        className="chat-compose"
        hidden={view === "list"}
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <label htmlFor="sunara-chat-input" className="sr-only">
          Type your question
        </label>
        <textarea
          id="sunara-chat-input"
          ref={field}
          rows={1}
          value={input}
          maxLength={CHAT_LIMITS.maxChars}
          placeholder="Ask about solar…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onInputKey}
          dir="auto"
        />
        <button type="submit" className="chat-send" disabled={loading || !input.trim()} aria-label="Send message">
          <SendHorizontal size={18} aria-hidden="true" />
        </button>
        {input.length > CHAT_LIMITS.maxChars - 100 && (
          <span className="chat-count" aria-live="polite">
            {input.length}/{CHAT_LIMITS.maxChars}
          </span>
        )}
      </form>

      <footer className="chat-foot">
        <p>{ai ? "AI assistant. Estimates only, confirmed at your free assessment." : "Estimates only, confirmed at your free assessment."}</p>
        {waHref && (
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="chat-wa">
            <WhatsAppIcon size={14} />
            Chat on WhatsApp
          </a>
        )}
      </footer>
    </div>
  );
}
