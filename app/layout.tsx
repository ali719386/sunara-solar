import type { Metadata, Viewport } from "next";
import { Anton, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const inter = Inter({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({
  weight: "500",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SUNARA - Premium solar for homes, businesses and industry",
  description:
    "High performance solar for homes, businesses and industry. Free roof assessment, custom design, expert installation and monitoring.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

// Runs before paint: applies the saved theme (light by default, never follows the OS),
// marks JS as available for reveal styles, and resolves the motion preference.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');var t='light';try{var s=localStorage.getItem('sunara-theme');if(s==='dark'||s==='light')t=s;}catch(e){}d.setAttribute('data-theme',t);try{localStorage.removeItem('sunara-motion');}catch(e){}var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;d.setAttribute('data-motion',r?'off':'on');})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-motion="on"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${anton.variable} ${inter.variable} ${playfair.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <MotionProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          {/* Shared across pages, so they stay mounted during client-side navigation. */}
          <Navbar />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
