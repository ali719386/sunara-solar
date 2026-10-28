"use client";

import { useEffect } from "react";

/**
 * Observes every [data-reveal] element once and adds .is-in when it enters view.
 * Hidden start states only apply after html.reveal-ready is set here, so content
 * stays visible if JavaScript fails. Elements already on screen are shown immediately.
 */
export function RevealManager() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const vh = window.innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("is-in");
    });
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    document.documentElement.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    els.forEach((el) => {
      if (!el.classList.contains("is-in")) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
