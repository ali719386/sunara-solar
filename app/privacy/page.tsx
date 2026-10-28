import type { Metadata } from "next";
import { legalPages } from "@/lib/content";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: `${legalPages.privacy.title} — SUNARA` };

export default function PrivacyPage() {
  return <LegalPage {...legalPages.privacy} />;
}
