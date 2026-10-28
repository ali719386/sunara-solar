import { solutions } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Accent } from "./Accent";
import { SolutionCard } from "./SolutionCard";

export function Solutions() {
  return (
    <section className="section container" id="solutions" aria-labelledby="solutions-title">
      <div className="section-head split-head" data-reveal>
        <div>
          <Eyebrow>{solutions.eyebrow}</Eyebrow>
          <h2 id="solutions-title" className="section-title">
            {solutions.title.lines[0]}
            <br />
            {solutions.title.lines[1]}
            <Accent>{solutions.title.accent}</Accent>
          </h2>
        </div>
        <div>
          <p className="section-text">{solutions.text}</p>
          <a href={solutions.more.href} className="text-link">
            {solutions.more.label}
          </a>
        </div>
      </div>
      <div className="bento">
        {solutions.items.map((item, i) => (
          <SolutionCard key={item.id} {...item} large={i === 0} delay={i * 100} />
        ))}
      </div>
    </section>
  );
}
