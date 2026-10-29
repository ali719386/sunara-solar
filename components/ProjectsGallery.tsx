"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { MapPin, Zap } from "lucide-react";
import { projectsPage } from "@/lib/content";
import { isFirstLoad } from "./RevealManager";

type Filter = (typeof projectsPage.filters)[number];

export function ProjectsGallery() {
  const [filter, setFilter] = useState<Filter>("All");
  const items = projectsPage.items.filter((p) => filter === "All" || p.type === filter);
  const gridRef = useRef<HTMLUListElement>(null);

  // Cards reveal as they scroll into view; ones entering together stagger left to right.
  // Re-runs per filter because the grid is re-keyed and its cards are new elements.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = (Array.from(grid.children) as HTMLElement[]).filter((c) => !c.classList.contains("is-shown"));
    // First load: cards already on screen stay as the server painted them.
    if (isFirstLoad()) {
      const vh = window.innerHeight;
      cards.forEach((c) => {
        const r = c.getBoundingClientRect();
        if (r.top < vh * 0.94 && r.bottom > 0) c.classList.add("is-shown");
      });
    }
    if (!("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add("is-in"));
      return;
    }
    grid.classList.add("is-observed");
    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.setProperty("--d", `${n++ * 90}ms`);
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 }
    );
    cards.forEach((c) => {
      if (!c.classList.contains("is-shown")) io.observe(c);
    });
    return () => io.disconnect();
  }, [filter]);

  return (
    <>
      <div className="segmented project-filters" role="group" aria-label="Filter projects">
        {projectsPage.filters.map((f) => (
          <button
            key={f}
            type="button"
            className={`segment segment-btn ${filter === f ? "is-active" : ""}`}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            <span>{f}</span>
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="project-empty">{projectsPage.empty}</p>
      ) : (
        // Re-keyed on filter change so the cards reveal again.
        <ul className="project-grid" key={filter} ref={gridRef}>
          {items.map((p) => (
            <li key={p.title} className="project-card">
              <div className="project-media">
                <Image src={p.image.src} alt={p.image.alt} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" className="project-img" />
                <span className="solution-label">{p.type}</span>
              </div>
              <div className="project-body">
                <h2 className="project-title">{p.title}</h2>
                {(p.location || p.size) && (
                  <p className="project-meta">
                    {p.location && (
                      <span>
                        <MapPin size={14} aria-hidden="true" />
                        {p.location}
                      </span>
                    )}
                    {p.size && (
                      <span>
                        <Zap size={14} aria-hidden="true" />
                        {p.size}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
