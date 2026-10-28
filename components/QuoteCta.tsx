import { quote } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Accent } from "./Accent";
import { Sunburst } from "./Sunburst";
import { QuoteForm } from "./QuoteForm";

export function QuoteCta({ withService = false }: { withService?: boolean }) {
  return (
    <section className="section container" id="quote" aria-labelledby="quote-title">
      <div className="cta-panel" data-reveal>
        <Sunburst className="cta-sun" rays={16} />
        <div className="cta-content">
          <Eyebrow>{quote.eyebrow}</Eyebrow>
          <h2 id="quote-title" className="section-title">
            {quote.title.lines[0]}
            <br />
            {quote.title.lines[1]}
            <Accent>{quote.title.accent}</Accent>
          </h2>
          <p className="section-text">{quote.text}</p>
          <QuoteForm withService={withService} />
        </div>
      </div>
    </section>
  );
}
