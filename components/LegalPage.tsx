import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { legalPages } from "@/lib/content";
import { PageShell } from "./PageShell";

export function LegalPage({ title, text }: { title: string; text: string }) {
  return (
    <PageShell>
      <section className="container legal-main">
        <h1 className="section-title">{title}</h1>
        <p className="section-text legal-text">{text}</p>
        <Link href="/" className="legal-back">
          <ArrowLeft size={16} aria-hidden="true" />
          {legalPages.back}
        </Link>
      </section>
    </PageShell>
  );
}
