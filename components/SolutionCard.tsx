"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { PropertyType } from "@/lib/content";
import { useMotion } from "./MotionProvider";
import { selectProperty } from "./QuoteForm";

type Props = {
  label: string;
  title: string;
  text: string;
  property: PropertyType;
  image: { src: string; alt: string; blur?: string };
  large?: boolean;
  delay: number;
};

const MAX_TILT = 1.6;

export function SolutionCard({ label, title, text, property, image, large, delay }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { enabled } = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let rx = 0;
    let ry = 0;
    let px = 50;
    let py = 50;
    const write = () => {
      raf = 0;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
      el.style.setProperty("--px", `${px}%`);
      el.style.setProperty("--py", `${py}%`);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      ry = (x - 0.5) * 2 * MAX_TILT;
      rx = -(y - 0.5) * 2 * MAX_TILT;
      px = x * 100;
      py = y * 100;
      if (!raf) raf = requestAnimationFrame(write);
    };
    const onLeave = () => {
      rx = 0;
      ry = 0;
      if (!raf) raf = requestAnimationFrame(write);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    };
  }, [enabled]);

  return (
    <a
      ref={ref}
      href="#quote"
      className={`solution-card ${large ? "is-large" : ""}`}
      data-reveal
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
      onClick={() => selectProperty(property)}
      aria-label={`${label}: ${title} ${text} Get a quote for ${property.toLowerCase()}.`}
    >
      {/* Tilt lives on the inner layer so it never competes with the reveal animation. */}
      <div className="solution-inner">
        <div className="solution-media">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={large ? "(max-width: 760px) 100vw, 60vw" : "(max-width: 760px) 100vw, 42vw"}
            placeholder={image.blur ? "blur" : "empty"}
            blurDataURL={image.blur}
            className="solution-img"
          />
        </div>
        <span className="solution-shine" aria-hidden="true" />
        <span className="solution-label">{label}</span>
        <div className="solution-copy">
          <h3 className="solution-title">{title}</h3>
          <p className="solution-text">{text}</p>
        </div>
        <span className="solution-arrow" aria-hidden="true">
          <ArrowRight size={20} />
        </span>
      </div>
    </a>
  );
}
