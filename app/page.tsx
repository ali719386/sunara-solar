import { PageShell } from "@/components/PageShell";
import { Hero } from "@/components/Hero";
import { IntroStrip } from "@/components/IntroStrip";
import { About } from "@/components/About";
import { Solutions } from "@/components/Solutions";
import { Process } from "@/components/Process";
import { Estimator } from "@/components/Estimator";
import { Benefits } from "@/components/Benefits";
import { Emi } from "@/components/Emi";
import { Testimonial } from "@/components/Testimonial";
import { Faq } from "@/components/Faq";
import { HomeCta } from "@/components/HomeCta";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WhatsAppDock } from "@/components/WhatsAppDock";
import { faq, whatsapp } from "@/lib/content";

// FAQPage structured data built from the same items the accordion shows.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Home() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Hero />
      <IntroStrip />
      <About />
      <Solutions />
      <Process />
      <Estimator />
      <Benefits />
      <Emi />
      <Testimonial />
      <Faq action={<WhatsAppButton label={whatsapp.ask} />} />
      <HomeCta />
      <WhatsAppDock />
    </PageShell>
  );
}
