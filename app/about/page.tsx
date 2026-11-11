import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Check, Clock, FileText, MapPin, Minus, ShieldCheck, X, Zap } from "lucide-react";
import { aboutContent as c, env } from "@/content/about";
import { brand, images, packagesPage } from "@/lib/content";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { Eyebrow } from "@/components/Eyebrow";
import { Accent } from "@/components/Accent";
import { Button } from "@/components/Button";
import { FeatureIcon } from "@/components/FeatureIcon";
import { StatsStrip } from "@/components/StatsStrip";
import { Sunburst } from "@/components/Sunburst";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = c.meta;

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** Section heading: eyebrow, H2 with accent word, optional intro. */
function Heading({ id, eyebrow, title, accent, text }: { id: string; eyebrow: string; title: string; accent: string; text?: string }) {
  return (
    <div className="abx-head" data-reveal>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="section-title">
        {title} <Accent>{accent}</Accent>
      </h2>
      {text && <p className="section-text">{text}</p>}
    </div>
  );
}

/** Initials on a light blue gradient, used until real photos are added. */
function Avatar({ photo, initials, alt, size }: { photo: string; initials: string; alt: string; size: number }) {
  if (photo) return <Image src={photo} alt={alt} width={size} height={size} className="abx-avatar abx-avatar-photo" />;
  return (
    <span className="abx-avatar" style={{ width: size, height: size }} aria-hidden="true">
      {initials}
    </span>
  );
}

function CompareCell({ value }: { value: boolean | "partial" }) {
  const { yes, no, partial } = c.comparison.labels;
  if (value === "partial")
    return (
      <span className="abx-mark is-partial">
        <Minus size={16} aria-hidden="true" />
        <span className="abx-mark-text">{partial}</span>
      </span>
    );
  return value ? (
    <span className="abx-mark is-yes">
      <Check size={16} aria-hidden="true" />
      <span className="sr-only">{yes}</span>
    </span>
  ) : (
    <span className="abx-mark is-no">
      <X size={16} aria-hidden="true" />
      <span className="sr-only">{no}</span>
    </span>
  );
}

const noteIcons = { zap: Zap, file: FileText } as const;

export default function AboutPage() {
  const { hero, story, timeline, stats, trust, values, team, comparison, local, cta } = c;
  const { founder } = story;
  const approvals = trust.approvals.filter((a) => a.show);

  // Organization structured data with both offices.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    description: c.meta.description,
    ...(env.siteUrl ? { url: env.siteUrl, logo: `${env.siteUrl}${images.logo.src}` } : {}),
    department: local.offices.map((o) => ({
      "@type": "LocalBusiness",
      name: `${brand.name} ${o.city}`,
      openingHours: o.hours,
      address: {
        "@type": "PostalAddress",
        streetAddress: o.address,
        addressLocality: o.city,
        addressRegion: o.region,
        addressCountry: "PK",
      },
    })),
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. Hero */}
      <PageHero
        className="abx-hero"
        crumb={hero.crumb}
        eyebrow={hero.eyebrow}
        title={hero.title}
        accent={hero.accent}
        text={hero.lead}
        image={hero.image}
        primary={hero.primary}
        secondary={hero.secondary}
      />

      {/* 2. Story + founder note */}
      <section className="section container abx-story" aria-labelledby="story-title">
        <div className="abx-story-copy" data-reveal>
          <Eyebrow>{story.eyebrow}</Eyebrow>
          <h2 id="story-title" className="section-title">
            {story.title} <Accent>{story.accent}</Accent>
          </h2>
          <p className="abx-lead">{story.text}</p>
        </div>
        <figure className="abx-founder" data-reveal style={delay(120)}>
          <Avatar photo={founder.photo} initials={founder.initials} alt={`${founder.name}, ${founder.role}`} size={96} />
          <blockquote className="abx-founder-quote">
            <p>“{founder.quote}”</p>
          </blockquote>
          <figcaption className="abx-founder-name">
            <strong>{founder.name}</strong>
            <span>{founder.role}</span>
          </figcaption>
        </figure>
      </section>

      {/* 3. Timeline */}
      <section className="section section-tint abx-band" aria-labelledby="timeline-title">
        <div className="container">
          <Heading {...timeline} id="timeline-title" />
          <div className="abx-timeline" data-reveal>
            <span className="abx-line" aria-hidden="true">
              <span className="abx-line-fill" />
            </span>
            <ol className="abx-milestones">
              {timeline.items.map((t, i) => (
                <li key={t.year} className="abx-milestone" style={delay(200 + i * 160)}>
                  <span className="abx-dot" aria-hidden="true" />
                  <p className="abx-year">{t.year}</p>
                  <h3 className="abx-h3">{t.title}</h3>
                  <p className="abx-small">{t.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 4. Stats */}
      <section className="container abx-stats" aria-label="SUNARA in numbers">
        <StatsStrip items={stats} />
      </section>

      {/* 5. Trust */}
      <section className="section container" aria-labelledby="trust-title">
        <Heading {...trust} id="trust-title" />
        <div className="abx-trust">
          <div className="abx-panel" data-reveal>
            <h3 className="abx-h3">{trust.approvalsTitle}</h3>
            {approvals.length > 0 && (
              <ul className="abx-badges">
                {approvals.map((a) => (
                  <li key={a.label} className="abx-badge">
                    <BadgeCheck size={20} aria-hidden="true" />
                    <span>
                      <strong>{a.label}</strong>
                      <span className="abx-small">{a.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="abx-warranty">
              <ShieldCheck size={28} aria-hidden="true" />
              <p className="abx-warranty-value">{trust.warranty.value}</p>
              <div>
                <p className="abx-warranty-label">{trust.warranty.label}</p>
                <p className="abx-small">{trust.warranty.text}</p>
              </div>
            </div>
          </div>
          <div className="abx-panel abx-panel-partners" data-reveal style={delay(120)}>
            <h3 className="abx-h3">{trust.partnersTitle}</h3>
            <p className="abx-small">{trust.partnersText}</p>
            <ul className="abx-logos">
              {trust.partners.map((p) => (
                <li key={p.name} className="abx-logo">
                  {p.logo ? <Image src={p.logo} alt={p.name} width={120} height={40} className="abx-logo-img" /> : <span>{p.name}</span>}
                </li>
              ))}
            </ul>
            <div className="abx-includes">
              <p className="abx-includes-title">
                <Zap size={18} aria-hidden="true" />
                {trust.includesTitle}
              </p>
              <ul className="abx-includes-list">
                {packagesPage.compare.features.map((f) => (
                  <li key={f}>
                    <Check size={16} strokeWidth={2.6} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={trust.includesLink.href} className="abx-includes-link">
                {trust.includesLink.label} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Values */}
      <section className="section section-tint abx-band" aria-labelledby="values-title">
        <div className="container">
          <Heading {...values} id="values-title" />
          <ul className="abx-values">
            {values.items.map((v, i) => (
              <li key={v.title} className="abx-card abx-value" data-reveal style={delay(i * 90)}>
                <span className="abx-icon">
                  <FeatureIcon name={v.icon} size={22} />
                </span>
                <h3 className="abx-h3">{v.title}</h3>
                <p className="abx-small">{v.text}</p>
                <p className="abx-proof">
                  <Check size={15} aria-hidden="true" />
                  {v.proof}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Team */}
      <section className="section container abx-team" id={team.id} aria-labelledby="team-title">
        <Heading {...team} id="team-title" />
        <ul className="abx-team-grid">
          {team.members.map((m, i) => (
            <li key={m.role} className="abx-card abx-member" data-reveal style={delay(i * 90)}>
              <Avatar photo={m.photo} initials={m.initials} alt={`${m.name}, ${m.role}`} size={72} />
              <h3 className="abx-h3">{m.name}</h3>
              <p className="abx-role">{m.role}</p>
              <p className="abx-small">{m.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 8. Comparison */}
      <section className="section section-tint abx-band" aria-labelledby="compare-title">
        <div className="container">
          <Heading {...comparison} id="compare-title" />
          <div className="abx-table-wrap" role="region" aria-labelledby="compare-title" tabIndex={0} data-reveal>
            <table className="abx-table">
              <caption className="sr-only">{comparison.caption}</caption>
              <thead>
                <tr>
                  <th scope="col">{comparison.columns.feature}</th>
                  <th scope="col">{comparison.columns.typical}</th>
                  <th scope="col" className="is-us">
                    {comparison.columns.sunara}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((r) => (
                  <tr key={r.feature}>
                    <th scope="row">{r.feature}</th>
                    <td>
                      <CompareCell value={r.typical} />
                    </td>
                    <td className="is-us">
                      <CompareCell value={r.sunara} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. Local */}
      <section className="section container" aria-labelledby="local-title">
        <Heading {...local} id="local-title" />
        <div className="abx-local">
          {local.offices.map((o, i) => (
            <article key={o.city} className="abx-card abx-office" data-reveal style={delay(i * 90)}>
              <h3 className="abx-h3">{o.city}</h3>
              <p className="abx-office-row">
                <MapPin size={18} aria-hidden="true" />
                <span>{o.address}</span>
              </p>
              <p className="abx-office-row">
                <Clock size={18} aria-hidden="true" />
                <span>{o.hours}</span>
              </p>
            </article>
          ))}
          {local.notes.map((n, i) => {
            const Icon = noteIcons[n.icon as keyof typeof noteIcons];
            return (
              <div key={n.title} className="abx-note" data-reveal style={delay(180 + i * 90)}>
                <span className="abx-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="abx-h4">{n.title}</h3>
                  <p className="abx-small">{n.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. Closing CTA */}
      <section className="section container" aria-labelledby="cta-title">
        <div className="abx-cta" data-reveal>
          <Sunburst className="abx-cta-sun" rays={16} />
          <Eyebrow>{cta.eyebrow}</Eyebrow>
          <h2 id="cta-title" className="section-title">
            {cta.title} <Accent>{cta.accent}</Accent>
          </h2>
          <p className="section-text">{cta.text}</p>
          <div className="abx-cta-actions">
            <Button href={cta.primary.href}>{cta.primary.label}</Button>
            <Button href={cta.secondary.href} variant="secondary" arrow="right">
              {cta.secondary.label}
            </Button>
            <WhatsAppButton label={cta.whatsapp.label} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
