import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { about, aboutPage, benefits, images, pageMeta } from "@/lib/content";
import { PageShell } from "@/components/PageShell";
import { Eyebrow } from "@/components/Eyebrow";
import { Accent } from "@/components/Accent";
import { FeatureIcon } from "@/components/FeatureIcon";
import { StatCounter } from "@/components/StatCounter";
import { QuoteCta } from "@/components/QuoteCta";

export const metadata: Metadata = pageMeta.about;

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function AboutPage() {
  const { hero, banner, story, experience, mission, values, team } = aboutPage;
  const [customers, installed] = about.stats;
  const img = images.hero;
  // Bento crops of the hero photo use background sizing, set per block in CSS.
  const photo = { "--photo": `url("${img.src}")` } as React.CSSProperties;

  return (
    <PageShell>
      <section className="ab-banner" aria-labelledby="page-title">
        <div className="ab-banner-frame">
          <div className="ab-banner-media">
            <Image
              src={images.aboutHero.src}
              alt={images.aboutHero.alt}
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={images.aboutHero.blur}
              className="ab-banner-img"
            />
            <div className="ab-banner-word" aria-hidden="true">
              {banner.word.split("").map((ch, i) => (
                <span key={i} style={{ "--i": i } as React.CSSProperties}>
                  {ch}
                </span>
              ))}
            </div>
            <div className="ab-banner-shade" aria-hidden="true" />
          </div>
          <div className="ab-banner-card glass">
            <nav className="ab-crumbs hero-seq" aria-label="Breadcrumb" style={{ "--s": 1 } as React.CSSProperties}>
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{banner.crumb}</span>
            </nav>
            <h1 id="page-title" className="ab-banner-title hero-seq" style={{ "--s": 2 } as React.CSSProperties}>
              {hero.title} <Accent>{hero.accent}</Accent>
            </h1>
            <p className="ab-banner-text hero-seq" style={{ "--s": 3 } as React.CSSProperties}>
              {hero.text}
            </p>
          </div>
        </div>
      </section>

      <section className="ab-bento-wrap" aria-label="About SUNARA">
        <div className="ab-bento">
          <article className="ab-block ab-span-7 ab-light ab-story" data-reveal>
            <Eyebrow>{story.eyebrow}</Eyebrow>
            <h2 className="ab-h3">
              {story.title} <Accent>{story.accent}</Accent>
            </h2>
            {story.paragraphs.map((para) => (
              <p key={para.slice(0, 24)} className="ab-text">
                {para}
              </p>
            ))}
            <ul className="ab-chips">
              {story.milestones.map((m) => (
                <li key={m.year} className="ab-chip">
                  <span className="ab-chip-year">{m.year}</span> {m.label}
                </li>
              ))}
            </ul>
          </article>

          <figure className="ab-block ab-span-5 ab-photo ab-photo-village" data-reveal style={{ ...delay(90), ...photo }}>
            <figcaption className="ab-float glass">
              <span className="ab-float-value">{experience.value}</span>
              <span className="ab-float-label">{experience.label}</span>
            </figcaption>
          </figure>

          <div className="ab-block ab-span-4 ab-stat" data-reveal>
            <StatCounter {...customers} />
          </div>
          <div className="ab-block ab-span-4 ab-stat" data-reveal style={delay(90)}>
            <StatCounter {...installed} />
          </div>
          <div className="ab-block ab-span-4 ab-stat ab-blue" data-reveal style={delay(180)}>
            <div className="stat">
              <p className="stat-value">{benefits.warranty.value}</p>
              <p className="stat-label">{benefits.warranty.label}</p>
            </div>
          </div>

          <figure className="ab-block ab-span-5 ab-photo ab-mission" data-reveal style={{ "--photo": `url("${images.residential.src}")` } as React.CSSProperties}>
            <div className="ab-mission-shade" aria-hidden="true" />
            <blockquote className="ab-mission-copy">
              <Eyebrow>{mission.eyebrow}</Eyebrow>
              <p className="ab-mission-quote">{mission.quote}</p>
            </blockquote>
          </figure>

          <article className="ab-block ab-span-7 ab-values" data-reveal style={delay(90)}>
            <Eyebrow>{values.eyebrow}</Eyebrow>
            <h2 className="ab-h3">
              {values.title} <Accent>{values.accent}</Accent>
            </h2>
            <ul className="ab-values-grid">
              {values.items.map((v) => (
                <li key={v.title} className="ab-value">
                  <span className="benefit-icon">
                    <FeatureIcon name={v.icon} />
                  </span>
                  <h3 className="ab-h4">{v.title}</h3>
                  <p className="ab-small">{v.text}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="ab-block ab-span-12 ab-light ab-team" data-reveal>
            <div className="ab-team-head">
              <div>
                <Eyebrow>{team.eyebrow}</Eyebrow>
                <h2 className="ab-h3">
                  {team.title} <Accent>{team.accent}</Accent>
                </h2>
              </div>
              <p className="ab-text">{team.text}</p>
            </div>
            <ul className="ab-team-grid">
              {team.items.map((t) => (
                <li key={t.title} className="ab-member">
                  {/* No team photos yet: gradient avatar with the role icon. */}
                  <span className="ab-avatar">
                    <FeatureIcon name={t.icon} size={24} />
                  </span>
                  <div>
                    <h3 className="ab-h4">{t.title}</h3>
                    <p className="ab-small">{t.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <QuoteCta />
    </PageShell>
  );
}
