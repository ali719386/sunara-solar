import { homeCta } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Accent } from "./Accent";
import { Button } from "./Button";
import { Sunburst } from "./Sunburst";
import { WhatsAppButton } from "./WhatsAppButton";

/** Home page closing call to action on the soft light blue panel. Keeps the #quote anchor. */
export function HomeCta() {
  return (
    <section className="section container" id="quote" aria-labelledby="quote-title">
      <div className="cta-panel home-cta" data-reveal>
        <Sunburst className="cta-sun" rays={16} />
        <div className="cta-content">
          <Eyebrow>{homeCta.eyebrow}</Eyebrow>
          <h2 id="quote-title" className="section-title">
            {homeCta.title} <Accent>{homeCta.accent}</Accent>
          </h2>
          <p className="section-text">{homeCta.text}</p>
          <div className="home-cta-actions">
            <Button href={homeCta.primary.href}>{homeCta.primary.label}</Button>
            <WhatsAppButton />
          </div>
        </div>
      </div>
    </section>
  );
}
