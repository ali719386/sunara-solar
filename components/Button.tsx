"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useMotion } from "./MotionProvider";

type Props = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  arrow?: "up-right" | "right" | "none";
  type?: "button" | "submit";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  ariaLabel?: string;
};

const MAX_PULL = 6;

/** Button/link with restrained magnetic pull and pointer highlight on fine pointers only. */
export function Button({ href, children, variant = "primary", arrow = "up-right", type = "button", className = "", onClick, ariaLabel }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    let px = 50;
    let py = 50;
    const write = () => {
      frame = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--hx", `${px}%`);
      el.style.setProperty("--hy", `${py}%`);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const rx = (e.clientX - r.left) / r.width;
      const ry = (e.clientY - r.top) / r.height;
      x = (rx - 0.5) * 2 * MAX_PULL;
      y = (ry - 0.5) * 2 * MAX_PULL * 0.7;
      px = rx * 100;
      py = ry * 100;
      if (!frame) frame = requestAnimationFrame(write);
    };
    const onLeave = () => {
      x = 0;
      y = 0;
      if (!frame) frame = requestAnimationFrame(write);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
  }, [enabled]);

  const Icon = arrow === "up-right" ? ArrowUpRight : arrow === "right" ? ArrowRight : null;
  const cls = `btn btn-${variant} ${className}`;
  const inner = (
    <>
      <span className="btn-label">{children}</span>
      {Icon && (
        <span className={`btn-icon btn-icon-${arrow}`} aria-hidden="true">
          <Icon size={16} strokeWidth={2.2} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type={type} className={cls} onClick={onClick} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}
