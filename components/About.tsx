import { Star } from "lucide-react";
import { about } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { StatCounter } from "./StatCounter";

export function About() {
  return (
    <section className="section container" id="about" aria-labelledby="about-title">
      <div className="about-grid">
        <div data-reveal>
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <p className="about-lead">
            {about.lead[0]}
            <br />
            {about.lead[1]}
          </p>
        </div>
        <div data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
          <h2 id="about-title" className="about-statement">
            {about.statement} <span className="muted">{about.statementMuted}</span>
          </h2>
          <div className="rating">
            <span className="rating-value">{about.rating.value}</span>
            <span className="stars" role="img" aria-label="Five stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
              ))}
            </span>
            <span className="rating-label">{about.rating.label}</span>
          </div>
        </div>
      </div>
      <div className="stats" data-reveal>
        {about.stats.map((s) => (
          <StatCounter key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
