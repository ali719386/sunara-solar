import { PageShell } from "@/components/PageShell";
import { Hero } from "@/components/Hero";
import { IntroStrip } from "@/components/IntroStrip";
import { About } from "@/components/About";
import { Solutions } from "@/components/Solutions";
import { Process } from "@/components/Process";
import { Estimator } from "@/components/Estimator";
import { Benefits } from "@/components/Benefits";
import { Testimonial } from "@/components/Testimonial";
import { Faq } from "@/components/Faq";
import { QuoteCta } from "@/components/QuoteCta";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <IntroStrip />
      <About />
      <Solutions />
      <Process />
      <Estimator />
      <Benefits />
      <Testimonial />
      <Faq />
      <QuoteCta />
    </PageShell>
  );
}
