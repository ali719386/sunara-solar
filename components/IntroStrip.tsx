import { ArrowDown, Sun } from "lucide-react";
import { intro } from "@/lib/content";

export function IntroStrip() {
  return (
    <div className="intro-strip container">
      <p className="intro-left">
        <Sun size={18} className="intro-sun" aria-hidden="true" />
        <span>{intro.text}</span>
      </p>
      <a href={intro.link.href} className="intro-link">
        {intro.link.label}
        <ArrowDown size={15} aria-hidden="true" />
      </a>
    </div>
  );
}
