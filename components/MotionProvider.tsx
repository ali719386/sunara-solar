"use client";

import { createContext, useContext, useEffect, useState } from "react";

type MotionState = {
  /** True when animations may run (no reduced-motion preference on the device). */
  enabled: boolean;
  reduced: boolean;
};

const MotionContext = createContext<MotionState>({ enabled: true, reduced: false });

export function useMotion() {
  return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    setReady(true);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const enabled = !reduced;

  useEffect(() => {
    // Wait for the OS preference so a stale "on" never restarts settled animations.
    if (!ready) return;
    const root = document.documentElement;
    root.setAttribute("data-motion", enabled ? "on" : "off");
    if (!enabled) {
      // Settle any in-flight animations at their final state.
      document.getAnimations?.().forEach((a) => {
        try {
          a.finish();
        } catch {
          a.cancel();
        }
      });
    }
  }, [enabled, ready]);

  return <MotionContext.Provider value={{ enabled, reduced }}>{children}</MotionContext.Provider>;
}
