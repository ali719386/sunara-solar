import { Check } from "lucide-react";
import { emi } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Accent } from "./Accent";
import { Button } from "./Button";

/** Financing teaser: copy and chips on the left, an example installment card on the right. */
export function Emi() {
  const { example } = emi;
  return (
    <section className="section container" id="financing" aria-labelledby="emi-title">
      <div className="emi">
        <div className="emi-copy" data-reveal>
          <Eyebrow>{emi.eyebrow}</Eyebrow>
          <h2 id="emi-title" className="section-title">
            {emi.title} <Accent>{emi.accent}</Accent>
          </h2>
          <p className="section-text emi-text">{emi.text}</p>
          <ul className="emi-chips">
            {emi.chips.map((chip) => (
              <li key={chip} className="emi-chip">
                <Check size={15} aria-hidden="true" />
                {chip}
              </li>
            ))}
          </ul>
          <Button href={emi.button.href}>{emi.button.label}</Button>
        </div>
        <div className="emi-card" data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
          <p className="emi-card-label">{example.label}</p>
          <p className="emi-card-value">
            {example.value} <span>{example.unit}</span>
          </p>
          <p className="emi-card-note">{example.note}</p>
        </div>
      </div>
    </section>
  );
}
