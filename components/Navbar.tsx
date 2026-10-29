"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/content";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./Button";

/** "/" matches only the home page; other links also match their sub-paths. */
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className={`nav-wrap ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="nav" aria-label="Primary">
        <Link href="/" className="nav-logo" aria-label="SUNARA home">
          <Logo />
        </Link>
        <ul className="nav-links">
          {nav.links.map((l) => {
            const current = isActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`nav-link ${current ? "is-active" : ""}`}
                  aria-current={current ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="nav-actions">
          <ThemeToggle />
          <Button href={nav.cta.href} className="nav-cta">
            <span className="nav-cta-full">{nav.cta.label}</span>
            <span className="nav-cta-compact">{nav.cta.compact}</span>
          </Button>
          <button
            ref={menuBtn}
            type="button"
            className="icon-btn nav-menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>
      <div id="mobile-menu" className={`nav-dropdown ${open ? "is-open" : ""}`} hidden={!open}>
        <ul>
          {nav.links.map((l) => {
            const current = isActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={current ? "is-active" : undefined}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link href={nav.cta.href} className="nav-dropdown-cta" onClick={() => setOpen(false)}>
              {nav.cta.label}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
