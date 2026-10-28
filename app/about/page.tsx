import type { Metadata } from "next";
import { about, aboutPage, pageMeta } from "@/lib/content";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { Eyebrow } from "@/components/Eyebrow";
import { Accent } from "@/components/Accent";
import { FeatureIcon } from "@/components/FeatureIcon";
import { StatCounter } from "@/components/StatCounter";
import { QuoteCta } from "@/components/QuoteCta";

export const metadata: Metadata = pageMeta.about;

export default function AboutPage() {
  const { hero, story, values, team } = aboutPage;
  return (
    <PageShell>
      <PageHero {...hero} />

      <section className="section container" aria-labelledby="story-title">
        <div className="story-grid">
          <div data-reveal>
            <Eyebrow>{story.eyebrow}</Eyebrow>
            <h2 id="story-title" className="section-title">
              {story.title} <Accent>{story.accent}</Accent>
            </h2>
          </div>
          <div className="story-text" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
            {story.paragraphs.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        </div>
        {/* Same figures as the home page; keep them in line with real company data. */}
        <div className="stats" data-reveal>
          {about.stats.map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </div>
      </section>

      <section className="section section-tint" aria-labelledby="values-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <Eyebrow>{values.eyebrow}</Eyebrow>
            <h2 id="values-title" className="section-title">
              {values.title} <Accent>{values.accent}</Accent>
            </h2>
          </div>
          <ul className="feature-grid">
            {values.items.map((v, i) => (
              <li key={v.title} className="feature-card" data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
                <span className="benefit-icon">
                  <FeatureIcon name={v.icon} />
                </span>
                <h3 className="feature-title">{v.title}</h3>
                <p className="feature-text">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section container" aria-labelledby="team-title">
        <div className="section-head split-head" data-reveal>
          <div>
            <Eyebrow>{team.eyebrow}</Eyebrow>
            <h2 id="team-title" className="section-title">
              {team.title} <Accent>{team.accent}</Accent>
            </h2>
          </div>
          <p className="section-text">{team.text}</p>
        </div>
        <ul className="feature-grid feature-grid-3">
          {team.items.map((t, i) => (
            <li key={t.title} className="feature-card team-card" data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
              <span className="team-icon">
                <FeatureIcon name={t.icon} size={26} />
              </span>
              <h3 className="feature-title">{t.title}</h3>
              <p className="feature-text">{t.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <QuoteCta />
    </PageShell>
  );
}
