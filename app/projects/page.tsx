import type { Metadata } from "next";
import { pageMeta, projectsPage } from "@/lib/content";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { ProjectsGallery } from "@/components/ProjectsGallery";
import { QuoteCta } from "@/components/QuoteCta";

export const metadata: Metadata = pageMeta.projects;

export default function ProjectsPage() {
  return (
    <PageShell>
      <PageHero {...projectsPage.hero} className="page-hero-lg-meta" />
      <section className="section section-tight container" aria-label="Project gallery">
        <ProjectsGallery />
      </section>
      <QuoteCta />
    </PageShell>
  );
}
