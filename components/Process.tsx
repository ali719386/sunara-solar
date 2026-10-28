import { ArrowRight } from "lucide-react";
import { process } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";

export function Process() {
  return (
    <section className="section section-tint" id="process" aria-labelledby="process-title">
      <div className="container">
        <div className="section-head split-head" data-reveal>
          <div>
            <Eyebrow>{process.eyebrow}</Eyebrow>
            <h2 id="process-title" className="section-title">
              {process.title[0]}
              <br />
              {process.title[1]}
            </h2>
          </div>
          <p className="section-text">
            {process.text[0]}
            <br />
            {process.text[1]}
          </p>
        </div>
        <ol className="process-grid">
          {process.steps.map((s, i) => (
            <li key={s.n} className="process-card" data-reveal style={{ "--d": `${i * 100}ms` } as React.CSSProperties}>
              <div className="process-top">
                <span className="process-num" aria-hidden="true">
                  {s.n}
                </span>
                <ArrowRight size={18} className="process-arrow" aria-hidden="true" />
              </div>
              <h3 className="process-title">
                <span className="sr-only">Step {s.n}: </span>
                {s.title}
              </h3>
              <p className="process-text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
