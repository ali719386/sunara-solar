import { ProgressBar } from "./ProgressBar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { RevealManager } from "./RevealManager";

/** Shared frame for every page: skip link, progress bar, navbar, main content and footer. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ProgressBar />
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <RevealManager />
    </>
  );
}
