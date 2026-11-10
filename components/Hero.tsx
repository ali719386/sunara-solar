"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { hero, heroRoofClip, images } from "@/lib/content";
import { Button } from "./Button";
import { Accent } from "./Accent";
import { useMotion } from "./MotionProvider";

export function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();

  // Gentle parallax on the SOLAR lettering only; photo and roof layer never move.
  useEffect(() => {
    const word = wordRef.current;
    const frame = frameRef.current;
    if (!word || !frame) return;
    const desktop = window.matchMedia("(min-width: 761px)");
    let raf = 0;
    const write = () => {
      raf = 0;
      if (!enabled || !desktop.matches) {
        word.style.transform = "";
        return;
      }
      const range = frame.offsetHeight;
      const y = Math.min(Math.max(window.scrollY, 0), range);
      word.style.transform = `translate3d(0, ${(y * 0.16).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    desktop.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener("change", onScroll);
      cancelAnimationFrame(raf);
      word.style.transform = "";
    };
  }, [enabled]);

  const img = images.hero;

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-frame" ref={frameRef}>
        <div className="hero-media">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={img.blur}
            className="hero-img"
          />
          <div className="hero-word-wrap" ref={wordRef} aria-hidden="true">
            <div className="hero-word">
              {hero.word.split("").map((ch, i) => (
                <span key={i} style={{ "--i": i } as React.CSSProperties}>
                  {ch}
                </span>
              ))}
            </div>
          </div>
          {/* Same photograph, same crop, clipped to the roof so letters pass behind it. */}
          <div className="hero-roof" aria-hidden="true" style={{ clipPath: heroRoofClip }}>
            <Image src={img.src} alt="" fill sizes="100vw" className="hero-img" priority />
          </div>
          <div className="hero-shade" aria-hidden="true" />
        </div>

        <div className="hero-card glass">
          <div className="hero-card-copy">
            <p className="eyebrow hero-seq" style={{ "--s": 1 } as React.CSSProperties}>
              {hero.eyebrow}
            </p>
            <h1 id="hero-title" className="hero-title hero-seq" style={{ "--s": 2 } as React.CSSProperties}>
              {hero.title.before}
              <Accent>{hero.title.accent}</Accent>
              {hero.title.after}
            </h1>
            <p className="hero-text hero-seq" style={{ "--s": 3 } as React.CSSProperties}>
              {hero.text}
            </p>
          </div>
          <div className="hero-actions hero-seq" style={{ "--s": 4 } as React.CSSProperties}>
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={hero.secondary.href} variant="secondary" arrow="right">
              {hero.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
