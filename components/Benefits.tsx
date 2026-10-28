import { House, Leaf, Zap } from "lucide-react";
import { benefits } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Accent } from "./Accent";
import { BenefitsVideo } from "./BenefitsVideo";

const icons = { bolt: Zap, leaf: Leaf, house: House };

export function Benefits() {
  return (
    <section className="section container" id="benefits" aria-labelledby="benefits-title">
      <div className="benefits-grid">
        <div data-reveal>
          <Eyebrow>{benefits.eyebrow}</Eyebrow>
          <h2 id="benefits-title" className="section-title">
            {benefits.title.before}
            <br />
            <Accent>{benefits.title.accent}</Accent>
            {benefits.title.after}
          </h2>
          <ul className="benefit-list">
            {benefits.items.map((b) => {
              const Icon = icons[b.icon];
              return (
                <li key={b.title} className="benefit-row">
                  <span className="benefit-icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="benefit-title">{b.title}</h3>
                    <p className="benefit-text">{b.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="benefits-media" data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
          <BenefitsVideo src={benefits.video.src} poster={benefits.video.poster} />
          <div className="warranty-card glass">
            <p className="warranty-value">{benefits.warranty.value}</p>
            <p className="warranty-label">{benefits.warranty.label}</p>          </div>
        </div>
      </div>
    </section>
  );
}
