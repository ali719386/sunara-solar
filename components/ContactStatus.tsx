"use client";

import { useEffect, useState } from "react";
import { contact } from "@/lib/content";

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** Open or closed right now, from the opening hours and the visitor's local time. */
function isOpen(now: Date) {
  const mins = now.getHours() * 60 + now.getMinutes();
  const row = contact.openingHours.rows.find((r) => r.days.includes(now.getDay()));
  if (!row || !row.open || !row.close) return false;
  return mins >= toMin(row.open) && mins < toMin(row.close);
}

export function ContactStatus() {
  // Unknown until mounted, so server and client markup match.
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isOpen(new Date()));
    update();
    const t = window.setInterval(update, 60_000);
    return () => window.clearInterval(t);
  }, []);

  const a = contact.advisor;
  return (
    <p className={`ct-status ${open === false ? "is-closed" : ""}`} aria-live="polite">
      {/* pkg-teal supplies the site's existing green tone (with its dark-mode variant). */}
      <span className="ct-dot pkg-teal" aria-hidden="true" />
      <span>{open === null ? " " : open ? a.open : a.closed}</span>
    </p>
  );
}
