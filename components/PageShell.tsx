import { RevealManager } from "./RevealManager";

/**
 * Page content frame: main landmark plus scroll reveals. The skip link, navbar and
 * footer live in the root layout so they persist (and don't re-animate) between pages.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main">{children}</main>
      <RevealManager />
    </>
  );
}
