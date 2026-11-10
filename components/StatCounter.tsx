"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "./MotionProvider";

const DURATION = 1600;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts up once on first view. Screen readers always get the final value. */
export function StatCounter({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) {
  const format = (n: number) => n.toFixed(decimals);
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);
  const { enabled } = useMotion();
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (done.current || !enabled) {
      done.current = true;
      setDisplay(value);
      return;
    }
    // Leave the final value in place if the stat is already on screen at load.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      done.current = true;
      return;
    }
    setDisplay(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        done.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          setDisplay(t < 1 ? Math.round(easeOut(t) * value * 10 ** decimals) / 10 ** decimals : value);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      // If motion is turned off mid-count, settle on the final value.
      setDisplay(value);
    };
  }, [enabled, value, decimals]);

  return (
    <div className="stat" ref={ref}>
      <p className="stat-value">
        <span aria-hidden="true">
          {format(display)}
          <span className="stat-suffix">{suffix}</span>
        </span>
        <span className="sr-only">
          {format(value)}
          {suffix} {label}
        </span>
      </p>
      <p className="stat-label" aria-hidden="true">
        {label}
      </p>
    </div>
  );
}
