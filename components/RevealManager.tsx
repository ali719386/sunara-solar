"use client";

import { useLayoutEffect } from "react";

// True until the first page has hydrated. On that first load, content already on screen
// was painted by the server, so it is shown as-is instead of hiding and replaying.
let firstLoad = true;

/** Whether the page is still on its first, server-rendered load (no client navigation yet). */
export const isFirstLoad = () => firstLoad;

/**
 * Observes every [data-reveal] element once and adds .is-in when it enters view.
 * Hidden start states only apply after html.reveal-ready is set here, so content
 * stays visible if JavaScript fails. On the first load, elements already on screen get
 * .is-shown (visible, no animation); after client-side navigation they animate in.
 */
export function RevealManager() {
  // Layout effect: runs before paint, so a newly navigated page never flashes before hiding.
  useLayoutEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
      (el) => !el.classList.contains("is-shown")
    );
    const vh = window.innerHeight;
    const inView = firstLoad ? "is-shown" : "is-in";
    firstLoad = false;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.94 && r.bottom > 0) el.classList.add(inView);
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
      { rootMargin: "0px 0px -6% 0px", threshold: 0 }
    );
    els.forEach((el) => {
      if (!el.classList.contains("is-in") && !el.classList.contains("is-shown")) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
