import type { Metadata } from "next";
import { Calculator, Check } from "lucide-react";
import { billForKw, formatMoney, packagesPage, pageMeta } from "@/lib/content";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { QuoteCta } from "@/components/QuoteCta";

export const metadata: Metadata = pageMeta.packages;

const unitsFormat = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

export default function PackagesPage() {
  const p = packagesPage;
  return (
    <PageShell>
      <PageHero {...p.hero} />

      <section className="section section-tight container" aria-label="Solar packages">
        <ul className="package-grid">
          {p.items.map((item, i) => {
            const plus = "plus" in item && item.plus;
            const bill = formatMoney(billForKw(item.kw));
            return (
              <li
                key={item.kw}
                className={`package-card ${item.featured ? "is-featured" : ""}`}
                data-reveal
                style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              >
                {item.featured && "featuredLabel" in item && <span className="package-flag">{item.featuredLabel}</span>}
                <p className="package-size">
                  {item.kw}
                  <span className="package-unit">kW{plus ? "+" : ""}</span>
                </p>
                <h2 className="package-name">{item.name}</h2>
                <p className="package-for">{item.for}</p>

                <dl className="package-facts">
                  <div>
                    <dt>{p.billLabel}</dt>
                    <dd>
                      {bill}
                      {plus ? "+" : ""}
                    </dd>
                  </div>
                  <div>
                    <dt>{p.unitsLabel}</dt>
                    <dd>
                      ~{unitsFormat.format(item.kw * 135)}
                      {plus ? "+" : ""}
                    </dd>
                  </div>
                </dl>

                <p className="package-included-label">{p.includedLabel}</p>
                <ul className="check-list check-list-sm">
                  {item.included.map((inc) => (
                    <li key={inc}>
                      <span className="check-dot" aria-hidden="true">
                        <Check size={12} strokeWidth={2.6} />
                      </span>
                      {inc}
                    </li>
                  ))}
                </ul>

                <div className="package-foot">
                  <p className="package-price">{item.price || p.priceOnRequest}</p>
                  <Button href="/contact" variant={item.featured ? "primary" : "secondary"} className="package-btn">
                    {p.cta}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="package-help" data-reveal>
          <span className="benefit-icon" aria-hidden="true">
            <Calculator size={20} />
          </span>
          <div>
            <h2 className="package-help-title">{p.help.title}</h2>
            <p className="package-help-text">{p.help.text}</p>
          </div>
          <Button href={p.help.link.href} variant="secondary" arrow="right">
            {p.help.link.label}
          </Button>
        </div>
      </section>

      <QuoteCta />
    </PageShell>
  );
}
