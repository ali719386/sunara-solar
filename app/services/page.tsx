import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { pageMeta, servicesPage } from "@/lib/content";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { Eyebrow } from "@/components/Eyebrow";
import { Accent } from "@/components/Accent";
import { FeatureIcon } from "@/components/FeatureIcon";
import { BookServiceButton } from "@/components/BookServiceButton";
import { Process } from "@/components/Process";
import { Faq } from "@/components/Faq";
import { QuoteCta } from "@/components/QuoteCta";

export const metadata: Metadata = pageMeta.services;

export default function ServicesPage() {
  const { hero, intro, items, why } = servicesPage;
  return (
    <PageShell>
      <PageHero {...hero} />

      <section className="section container" aria-labelledby="services-title">
        <div className="section-head split-head" data-reveal>
          <div>
            <Eyebrow>{intro.eyebrow}</Eyebrow>
            <h2 id="services-title" className="section-title">
              {intro.title} <Accent>{intro.accent}</Accent>
            </h2>
          </div>
          <p className="section-text">{intro.text}</p>
        </div>

        <div className="service-list">
          {items.map((s, i) => (
            <article
              key={s.id}
              id={s.id}
              className={`service-block ${i % 2 === 1 ? "is-reversed" : ""}`}
              aria-labelledby={`${s.id}-title`}
            >
              <div className="service-media" data-reveal>
                <Image
                  src={s.image.src}
                  alt={s.image.alt}
                  fill
                  quality={90}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="service-img"
                />
              </div>
              <div className="service-copy" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
                <span className="service-icon">
                  <FeatureIcon name={s.icon} size={22} />
                </span>
                <h3 id={`${s.id}-title`} className="service-title">
                  {s.title}
                </h3>
                <p className="service-text">{s.text}</p>
                <p className="service-included-label">{servicesPage.includedLabel}</p>
                <ul className="check-list">
                  {s.included.map((item) => (
                    <li key={item}>
                      <span className="check-dot" aria-hidden="true">
                        <Check size={13} strokeWidth={2.6} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <BookServiceButton service={s.service} label={servicesPage.bookLabel} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <Process />

      <section className="section container" aria-labelledby="why-title">
        <div className="why-panel" data-reveal>
          <div className="why-head">
            <Eyebrow>{why.eyebrow}</Eyebrow>
            <h2 id="why-title" className="section-title">
              {why.title} <Accent>{why.accent}</Accent>
            </h2>
            <p className="section-text">{why.text}</p>
          </div>
          <ul className="why-list">
            {why.items.map((f) => (
              <li key={f.title} className="why-item">
                <span className="why-icon">
                  <FeatureIcon name={f.icon} />
                </span>
                <div>
                  <h3 className="why-title">{f.title}</h3>
                  <p className="why-text">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq data={servicesPage.faq} />
      <QuoteCta withService />
    </PageShell>
  );
}
