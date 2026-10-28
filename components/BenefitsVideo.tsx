"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "./MotionProvider";

/**
 * Decorative looping video. Plays only while on screen and while motion is enabled;
 * when reduced motion is on, the poster/current frame stays visible.
 */
export function BenefitsVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const { enabled } = useMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!enabled) {
      video.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [enabled]);

  return (
    <video
      ref={ref}
      className="benefits-img benefits-video"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
