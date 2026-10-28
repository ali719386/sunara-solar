import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { contact, footer, pageMeta } from "@/lib/content";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { SocialIcon } from "@/components/SocialIcon";

export const metadata: Metadata = pageMeta.contact;

type Card = { key: string; icon: LucideIcon; label: string; value: string; href?: string; external?: boolean };

export default function ContactPage() {
  const d = contact.details;
  const l = contact.labels;

  // Only the details that have been filled in are shown.
  const cards: Card[] = [
    d.phone && { key: "phone", icon: Phone, label: l.phone, value: d.phone, href: `tel:${d.phone.replace(/\s+/g, "")}` },
    d.whatsapp && {
      key: "whatsapp",
      icon: MessageCircle,
      label: l.whatsapp,
      value: `+${d.whatsapp}`,
      href: `https://wa.me/${d.whatsapp}`,
      external: true,
    },
    d.email && { key: "email", icon: Mail, label: l.email, value: d.email, href: `mailto:${d.email}` },
    d.address && {
      key: "address",
      icon: MapPin,
      label: l.address,
      value: d.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`,
      external: true,
    },
    d.hours && { key: "hours", icon: Clock, label: l.hours, value: d.hours },
  ].filter(Boolean) as Card[];

  return (
    <PageShell>
      <PageHero {...contact.hero} />

      <section className="section section-tight container" aria-label="Contact details and form">
        <div className="contact-grid">
          <div className="contact-side" data-reveal>
            {cards.length > 0 ? (
              <ul className="contact-cards">
                {cards.map(({ key, icon: Icon, label, value, href, external }) => {
                  const body = (
                    <>
                      <span className="benefit-icon">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <span>
                        <span className="contact-card-label">{label}</span>
                        <span className="contact-card-value">{value}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={key}>
                      {href ? (
                        <a
                          href={href}
                          className="contact-card"
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {body}
                        </a>
                      ) : (
                        <div className="contact-card">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="contact-card contact-fallback">{l.fallback}</p>
            )}

            <div className="contact-socials">
              <p className="footer-col-title">{l.socials}</p>
              <ul className="footer-socials">
                {footer.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="footer-social">
                      <SocialIcon name={s.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
            <ContactForm />
          </div>
        </div>

        {d.address && (
          <div className="contact-map" data-reveal>
            <iframe
              title={`Map: ${d.address}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(d.address)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </section>
    </PageShell>
  );
}
