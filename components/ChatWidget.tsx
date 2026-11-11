"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { whatsapp } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

// The panel (chat logic, markdown, fallback replies) loads only when first needed.
const loadPanel = () => import("./ChatPanel");
const ChatPanel = dynamic(loadPanel, { ssr: false });

const TIP_KEY = "sunara-chat-tip";
const ICON = "/images/chatbot-icon.png";

/** Floating dock with the SUNARA Assistant and WhatsApp, mounted once in the root layout. */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tip, setTip] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const waHref = whatsappUrl();

  // Tooltip once per session, 5 seconds after load.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(TIP_KEY) === "1";
    } catch {}
    if (seen) return;
    const show = window.setTimeout(() => setTip(true), 5000);
    const hide = window.setTimeout(() => setTip(false), 17000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  const dismissTip = useCallback(() => {
    setTip(false);
    try {
      sessionStorage.setItem(TIP_KEY, "1");
    } catch {}
  }, []);

  const toggle = () => {
    dismissTip();
    setMounted(true);
    setOpen((o) => !o);
  };

  const close = useCallback(() => {
    setOpen(false);
    launcher.current?.focus();
  }, []);

  return (
    <div className={`chat-root ${open ? "is-open" : ""}`}>
      {tip && !open && (
        <div className="chat-tip" role="status">
          <button type="button" className="chat-tip-text" onClick={toggle}>
            Ask me about solar
          </button>
          <button type="button" className="chat-tip-close" onClick={dismissTip} aria-label="Dismiss">
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}
      <div className={`chat-dock ${waHref ? "" : "is-single"}`}>
        <button
          ref={launcher}
          type="button"
          className="chat-launcher"
          onClick={toggle}
          onPointerEnter={loadPanel}
          onFocus={loadPanel}
          aria-expanded={open}
          aria-controls="sunara-chat"
          aria-label={open ? "Close SUNARA Assistant" : "Open SUNARA Assistant"}
        >
          <span className="chat-pulse" aria-hidden="true" />
          <span className="chat-launcher-icon" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny static icon, no optimisation needed */}
            <img src={ICON} alt="" width={34} height={34} decoding="async" />
          </span>
          <span className="chat-launcher-close" aria-hidden="true">
            <X size={24} strokeWidth={2.4} />
          </span>
        </button>
        {waHref && (
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="chat-dock-wa" aria-label={whatsapp.chat}>
            <WhatsAppIcon size={26} />
          </a>
        )}
      </div>
      {mounted && <ChatPanel open={open} onClose={close} icon={ICON} />}
    </div>
  );
}
