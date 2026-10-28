import { ArrowUp, BadgeCheck, Globe } from "lucide-react";
import { brand, footer } from "@/lib/content";
import { Logo } from "./Logo";
import { SocialIcon } from "./SocialIcon";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="container footer-wrap">
      <div className="footer">
        <span className="footer-glow" aria-hidden="true" />

        <div className="footer-main" data-reveal>
          <div className="footer-brand">
            <a href="/" aria-label={`${brand.name} home`} className="footer-logo">
              <Logo className="logo-lg" />
            </a>
            <p className="footer-about">{footer.about}</p>

            <ul className="footer-socials" aria-label="Social media">
              {footer.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="footer-social">
                    <SocialIcon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>

            <ul className="footer-badges">
              {footer.badges.map((b) => (
                <li key={b}>
                  <BadgeCheck size={14} aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer-cols" aria-label="Footer">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <p className="footer-col-title">{col.title}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="footer-link">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} {brand.name}. {footer.rights}
          </p>
          <ul className="footer-legal">
            {footer.legal.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
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
