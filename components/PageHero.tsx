import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Eyebrow } from "./Eyebrow";
import { Accent } from "./Accent";
import { Button } from "./Button";

type Props = {
  crumb: string;
  eyebrow: string;
  title: string;
  accent?: string;
  text: string;
  image?: { src: string; alt: string; blur?: string; position?: string };
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Centre the copy (used for pricing-style pages without a photo). */
  centered?: boolean;
  /** Optional content layered over the photo (e.g. a glass info card). */
  overlay?: React.ReactNode;
  /** Extra class on the section, for page-specific tweaks. */
  className?: string;
};

/** Header for inner pages: breadcrumb, eyebrow, headline with accent, intro and optional photo. */
export function PageHero({ crumb, eyebrow, title, accent, text, image, primary, secondary, centered, overlay, className = "" }: Props) {
  return (
    <section
      className={`page-hero container ${image ? "has-image" : ""} ${centered ? "is-centered" : ""} ${className}`}
      aria-labelledby="page-title"
    >
      <div className="page-hero-copy" data-reveal>
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">{crumb}</span>
        </nav>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 id="page-title" className="page-title">
          {title}
          {accent && (
            <>
              {" "}
              <Accent>{accent}</Accent>
            </>
          )}
        </h1>
        <p className="page-hero-text">{text}</p>
        {(primary || secondary) && (
          <div className="page-hero-actions">
            {primary && <Button href={primary.href}>{primary.label}</Button>}
            {secondary && (
              <Button href={secondary.href} variant="secondary" arrow="right">
                {secondary.label}
              </Button>
            )}
          </div>
        )}
      </div>
      {image && (
        <div className="page-hero-media" data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 46vw"
            placeholder={image.blur ? "blur" : "empty"}
            blurDataURL={image.blur}
            className="page-hero-img"
            style={image.position ? { objectPosition: image.position } : undefined}
          />
          {overlay}
        </div>
      )}
    </section>
  );
}
