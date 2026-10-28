import type { Metadata } from "next";
import { legalPages } from "@/lib/content";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: `${legalPages.terms.title} — SUNARA` };

export default function TermsPage() {
  return <LegalPage {...legalPages.terms} />;
}
