"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Zap } from "lucide-react";
import { projectsPage } from "@/lib/content";

type Filter = (typeof projectsPage.filters)[number];

export function ProjectsGallery() {
  const [filter, setFilter] = useState<Filter>("All");
  const items = projectsPage.items.filter((p) => filter === "All" || p.type === filter);

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
        // Re-keyed on filter change so the cards fade in again.
        <ul className="project-grid" key={filter}>
          {items.map((p, i) => (
            <li key={p.title} className="project-card" style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
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
