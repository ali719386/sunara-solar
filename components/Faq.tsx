"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { faq as homeFaq, type FaqData } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";

export function Faq({ data = homeFaq }: { data?: FaqData }) {
  const faq = data;
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <section className="section container" id="faq" aria-labelledby="faq-title">
      <div className="faq-grid">
        <div data-reveal>
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <h2 id="faq-title" className="section-title">
            {faq.title[0]}
            <br />
            {faq.title[1]}
          </h2>
          <p className="section-text">{faq.text}</p>
          <a href={faq.link.href} className="text-link">
            {faq.link.label}
          </a>
        </div>
        <div className="faq-list" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            const btnId = `${id}-q${i}`;
            const panelId = `${id}-a${i}`;
            return (
              <div key={item.q} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                <h3 className="faq-q">
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <Plus size={18} />
                    </span>
                  </button>
                </h3>
                {/* Panel stays mounted so the 0fr→1fr collapse can finish; inert hides it from AT and focus. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className="faq-panel"
                  inert={!isOpen}
                >
                  <div className="faq-panel-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
