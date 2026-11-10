import Link from "next/link";
import { ArrowUp, ArrowUpRight, BadgeCheck, Clock, Globe, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { brand, contact, footer, images } from "@/lib/content";
import { Logo } from "./Logo";
import { SocialIcon } from "./SocialIcon";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { ContactStatus } from "./ContactStatus";

export function Footer() {
  const year = new Date().getFullYear();
  const { details: d, labels: l, advisor, openingHours } = contact;
  // Only the contact details that have been filled in are shown.
  const channels = [
    d.phone && { key: "phone", icon: Phone, label: d.phone, href: `tel:${d.phone.replace(/\s+/g, "")}` },
    d.whatsapp && { key: "whatsapp", icon: WhatsAppIcon, label: `+${d.whatsapp}`, href: `https://wa.me/${d.whatsapp}`, external: true },
    d.email && { key: "email", icon: Mail, label: d.email, href: `mailto:${d.email}` },
  ].filter(Boolean) as { key: string; icon: LucideIcon | typeof WhatsAppIcon; label: string; href: string; external?: boolean }[];
  // Social profiles are set via env vars; unset ones are hidden.
  const socials = footer.socials.filter((s) => s.href);

  return (
    <footer className="container footer-wrap">
      <div className="footer">
        <span className="footer-glow" aria-hidden="true" />
        <span className="footer-grid" aria-hidden="true" />

        {/* Brand + contact card. */}
        <div className="footer-top" data-reveal>
          <div className="footer-brand">
            <Link href="/" aria-label={`${brand.name} home`} className="footer-logo">
              <Logo className="logo-lg" />
            </Link>
            <p className="footer-about">{footer.about}</p>

            <ul className="footer-badges">
              {footer.badges.map((b) => (
                <li key={b}>
                  <BadgeCheck size={14} aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>

            {socials.length > 0 && (
              <div className="footer-follow">
                <p className="footer-col-title">{l.socials}</p>
                <ul className="footer-socials" aria-label="Social media">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="footer-social">
                        <SocialIcon name={s.icon} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="footer-contact">
            <div className="footer-advisor">
              <span className="footer-avatar" aria-hidden="true">
                <Image src={images.logo.src} alt="" width={images.logo.width} height={images.logo.height} className="footer-avatar-logo" />
              </span>
              <div>
                <p className="footer-col-title">{contact.hero.eyebrow}</p>
                <p className="footer-advisor-title">{advisor.title}</p>
                <ContactStatus />
              </div>
            </div>

            <div className="footer-reach">
              {channels.length > 0 ? (
                <ul>
                  {channels.map((c) => (
                    <li key={c.key}>
                      <a
                        href={c.href}
                        className="footer-reach-link"
                        {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        <c.icon size={16} aria-hidden="true" />
                        <span>{c.label}</span>
                        <ArrowUpRight size={15} className="footer-reach-arrow" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="footer-reach-text">{l.fallback}</p>
              )}
              {d.address && (
                <p className="footer-reach-text footer-address">
                  <MapPin size={16} aria-hidden="true" />
                  {d.address}
                </p>
              )}
            </div>

            <div className="footer-hours">
              <p className="footer-col-title">
                <Clock size={13} aria-hidden="true" />
                {openingHours.eyebrow}
              </p>
              <table>
                <tbody>
                  {openingHours.rows.map((r) => (
                    <tr key={r.label}>
                      <th scope="row">{r.label}</th>
                      <td>{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Link columns. */}
        <nav className="footer-cols" aria-label="Footer" data-reveal>
          {footer.columns.map((col) => (
            <div key={col.title}>
              <p className="footer-col-title">{col.title}</p>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} {brand.name}. {footer.rights}
          </p>
          <ul className="footer-legal">
            {footer.legal.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <div className="footer-meta">
            <span className="footer-region">
              <Globe size={14} aria-hidden="true" />
              {footer.region}
            </span>
            <a href="#main" className="footer-top-link" aria-label={footer.backToTop}>
              <ArrowUp size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
