import { testimonial } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";

export function Testimonial() {
  return (
    <section className="section container" id="stories" aria-labelledby="testimonial-title">
      <figure className="testimonial" data-reveal>
        <Eyebrow className="eyebrow-center">
          <span id="testimonial-title">{testimonial.eyebrow}</span>
        </Eyebrow>
        <span className="quote-mark" aria-hidden="true">
          &ldquo;
        </span>
        <blockquote className="testimonial-quote">
          <p>{testimonial.quote}</p>
        </blockquote>
        <figcaption className="testimonial-by">
          <span className="avatar" aria-hidden="true">
            {testimonial.initials}
          </span>
          <span>
            <span className="testimonial-name">{testimonial.name}</span>
            <span className="testimonial-role">{testimonial.role}</span>
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
