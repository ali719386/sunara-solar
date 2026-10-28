import type { Metadata } from "next";
import { ArrowRight, Calculator, Check, Minus } from "lucide-react";
import { formatUsd, packagesPage, pageMeta, unitsForKw, usdBillForKw } from "@/lib/content";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { Eyebrow } from "@/components/Eyebrow";
import { Accent } from "@/components/Accent";
import { Button } from "@/components/Button";
import { FeatureIcon } from "@/components/FeatureIcon";
import { QuoteCta } from "@/components/QuoteCta";

export const metadata: Metadata = pageMeta.packages;

const unitsFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export default function PackagesPage() {
  const p = packagesPage;
  const b = p.business;

  return (
    <PageShell>
      <PageHero {...p.hero} />

      <section className="section section-tight container" aria-label="Residential solar packages">
        <ul className="pkg-grid">
          {p.residential.map((item, i) => (
            <li
              key={item.kw}
              id={`pkg-${item.kw}`}
              className={`pkg pkg-${item.tone} ${item.featured ? "is-featured" : ""}`}
              data-reveal
              style={{ "--d": `${i * 100}ms` } as React.CSSProperties}
            >
              {/* Coloured header band */}
              <div className="pkg-head">
                <div className="pkg-head-top">
                  <p className="pkg-tag">{item.tag}</p>
                  {item.featured && "featuredLabel" in item && <span className="pkg-flag">{item.featuredLabel}</span>}
                </div>
                <h2 className="pkg-size">
                  {item.kw}
                  <span className="pkg-unit">kW</span>
                </h2>
                <p className="pkg-for">{item.for}</p>
              </div>

              <div className="pkg-body">
                {/* Investment box */}
                <div className="pkg-invest">
                  <span className="pkg-invest-label">{p.priceLabel}</span>
                  <span className="pkg-invest-value">{item.price || p.priceOnRequest}</span>
                  <span className="pkg-invest-note">
                    {p.billLabel} {formatUsd(usdBillForKw(item.kw))} · ~{unitsFormat.format(unitsForKw(item.kw))}{" "}
                    {p.unitsSuffix}/month
                  </span>
                </div>

                <ul className="pkg-list">
                  {item.included.map((inc) => (
                    <li key={inc}>
                      <Check size={17} strokeWidth={2.6} aria-hidden="true" />
                      {inc}
                    </li>
                  ))}
                </ul>

                <Button href="/contact" arrow="right" className="pkg-btn">
                  {item.cta}
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <div className="pkg-business" data-reveal>
          <div className="pkg-business-main">
            <Eyebrow>{b.eyebrow}</Eyebrow>
            <h2 className="pkg-business-title">{b.name}</h2>
            <p className="pkg-business-text">{b.text}</p>
          </div>
          <ul className="pkg-list pkg-business-list">
            {b.included.map((inc) => (
              <li key={inc}>
                <Check size={15} strokeWidth={2.4} aria-hidden="true" />
                {inc}
              </li>
            ))}
          </ul>
          <div className="pkg-business-cta">
            <p className="pkg-business-from">
              {b.kw}
              <span className="pkg-unit">kW+</span>
            </p>
            <Button href={b.cta.href}>{b.cta.label}</Button>
          </div>
        </div>

        <ul className="pkg-trust">
          {p.trust.map((t, i) => (
            <li key={t.title} data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
              <span className="benefit-icon">
                <FeatureIcon name={t.icon} />
              </span>
              <div>
                <p className="pkg-trust-title">{t.title}</p>
                <p className="pkg-trust-text">{t.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section section-tint" aria-labelledby="compare-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <Eyebrow>{p.compare.eyebrow}</Eyebrow>
            <h2 id="compare-title" className="section-title">
              {p.compare.title} <Accent>{p.compare.accent}</Accent>
            </h2>
          </div>

          <p className="compare-hint" aria-hidden="true">
            {p.compare.swipe}
            <ArrowRight size={14} />
          </p>
          <div className="compare-wrap" data-reveal>
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">Feature</span>
                  </th>
                  {p.residential.map((item) => (
                    <th key={item.kw} scope="col" className={item.featured ? "is-featured" : undefined}>
                      {item.featured && <span className="compare-flag">{p.compare.recommended}</span>}
                      <span className="compare-name">{item.name}</span>
                      <span className="compare-size">{item.kw} kW</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{p.compare.unitsRow}</th>
                  {p.residential.map((item) => (
                    <td key={item.kw} className={item.featured ? "is-featured" : undefined}>
                      ~{unitsFormat.format(unitsForKw(item.kw))} {p.unitsSuffix}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">{p.compare.billRow}</th>
                  {p.residential.map((item) => (
                    <td key={item.kw} className={item.featured ? "is-featured" : undefined}>
                      {formatUsd(usdBillForKw(item.kw))}
                    </td>
                  ))}
                </tr>
                {p.compare.features.map((f) => (
                  <tr key={f}>
                    <th scope="row">{f}</th>
                    {p.residential.map((item) => {
                      const has = (item.included as readonly string[]).includes(f);
                      return (
                        <td key={item.kw} className={item.featured ? "is-featured" : undefined}>
                          {has ? (
                            <Check size={18} strokeWidth={2.4} className="compare-yes" aria-label="Included" />
                          ) : (
                            <Minus size={18} className="compare-no" aria-label="Not included" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="pkg-note">{p.note}</p>

          <div className="package-help" data-reveal>
            <span className="benefit-icon" aria-hidden="true">
              <Calculator size={20} />
            </span>
            <div>
              <h2 className="package-help-title">{p.help.title}</h2>
              <p className="package-help-text">{p.help.text}</p>
            </div>
            <a href={p.help.link.href} className="text-link package-help-link">
              {p.help.link.label}
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <QuoteCta />
    </PageShell>
  );
}
