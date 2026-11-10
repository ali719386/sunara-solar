import { ArrowRight } from "lucide-react";
import { testimonials } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Accent } from "./Accent";

/** Customer stories: bill before and after, quote, name and system. */
export function Testimonial() {
  const { billLabel } = testimonials;
  return (
    <section className="section container" id="stories" aria-labelledby="testimonial-title">
      <div className="stories-head" data-reveal>
        <Eyebrow>{testimonials.eyebrow}</Eyebrow>
        <h2 id="testimonial-title" className="section-title">
          {testimonials.title} <Accent>{testimonials.accent}</Accent>
        </h2>
      </div>
      <ul className="stories-grid">
        {testimonials.items.map((t, i) => (
          <li key={t.name} className="story-card" data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
            <figure>
              <p className="story-bills">
                <span className="sr-only">{billLabel.before}:</span>
                <s className="story-before">{t.before}</s>
                <ArrowRight size={16} aria-hidden="true" className="story-arrow" />
                <span className="sr-only">{billLabel.after}:</span>
                <strong className="story-after">{t.after}</strong>
              </p>
              <blockquote className="story-quote">
                <p>&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="story-by">
                <span className="story-name">{t.name}</span>
                <span className="story-meta">
                  {t.city}, {t.system}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
