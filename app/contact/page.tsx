import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Mail, Phone, PhoneCall, Sun, type LucideIcon } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { contact, pageMeta } from "@/lib/content";
import { PageShell } from "@/components/PageShell";
import { Eyebrow } from "@/components/Eyebrow";
import { FeatureIcon } from "@/components/FeatureIcon";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = pageMeta.contact;

type Channel = { key: string; icon: LucideIcon | typeof WhatsAppIcon; quick: string; href: string; external?: boolean };

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function ContactPage() {
  const { hero, details: d, quick, form, cta, servicesStrip } = contact;

  // Only the details that have been filled in are shown.
  const channels = [
    d.phone && { key: "phone", icon: Phone, quick: quick.phone, href: `tel:${d.phone.replace(/\s+/g, "")}` },
    d.whatsapp && {
      key: "whatsapp",
      icon: WhatsAppIcon,
      quick: quick.whatsapp,
      href: `https://wa.me/${d.whatsapp}`,
      external: true,
    },
    d.email && { key: "email", icon: Mail, quick: quick.email, href: `mailto:${d.email}` },
  ].filter(Boolean) as Channel[];

  const ext = (c: { external?: boolean }) => (c.external ? { target: "_blank", rel: "noopener noreferrer" } : {});

  return (
    <PageShell>
      <div className="ct-page">
        {/* 1. Header with the quote form right beside the copy. */}
        <section className="ct-hero" aria-labelledby="page-title">
          <div className="ct-hero-copy" data-reveal>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
            <h1 id="page-title" className="ct-title">
              {hero.title} <span className="ct-title-accent">{hero.accent}</span>
            </h1>
            <p className="ct-lead">{hero.text}</p>
            <ul className="ct-perks">
              {form.perks.map((perk) => (
                <li key={perk}>
                  <span className="ct-perk-icon">
                    <Check size={14} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
            {channels.length > 0 && (
              <ul className="ct-pills">
                {channels.map((c) => (
                  <li key={c.key}>
                    <a href={c.href} className="ct-pill" {...ext(c)}>
                      <c.icon size={17} aria-hidden="true" />
                      {c.quick}
                      {c.key === "whatsapp" && <span className="ct-dot pkg-teal" aria-hidden="true" />}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="ct-form-card" id="quote" data-reveal style={delay(120)}>
            <ContactForm />
          </div>
        </section>

        {/* 2. CTA banner. */}
        <section className="ct-cta" aria-labelledby="cta-title" data-reveal>
          <Sun className="ct-cta-sun" size={260} strokeWidth={1} aria-hidden="true" />
          <div className="ct-cta-copy">
            <p className="ct-cta-eyebrow">{cta.eyebrow}</p>
            <h2 id="cta-title" className="ct-cta-title">
              {cta.title} <span className="ct-cta-accent">{cta.accent}</span>
            </h2>
            <p className="ct-cta-text">{cta.text}</p>
          </div>
          <div className="ct-cta-actions">
            <a href={channels[0]?.href ?? "#quote"} className="ct-cta-btn" {...(channels[0] ? ext(channels[0]) : {})}>
              <PhoneCall size={18} aria-hidden="true" />
              {cta.button}
            </a>
            <a href="#quote" className="ct-cta-link">
              {cta.secondary}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* 3. Services strip. */}
        <nav className="ct-services" aria-label={servicesStrip.label} data-reveal>
          <ul>
            {servicesStrip.items.map((s) => (
              <li key={s.label}>
                <Link href={s.href} className="ct-service">
                  <span className="ct-service-icon">
                    <FeatureIcon name={s.icon} size={18} />
                  </span>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </PageShell>
  );
}
