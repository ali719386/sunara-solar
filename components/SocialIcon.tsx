type Name = "facebook" | "instagram" | "linkedin" | "youtube";

/** Minimal monochrome social glyphs (currentColor), sized by the parent. */
export function SocialIcon({ name }: { name: Name }) {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", "aria-hidden": true, focusable: false } as const;
  switch (name) {
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M6.9 8.8H4V20h2.9V8.8zM5.4 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM20 13.6c0-3-1.6-4.9-4.2-4.9-1.3 0-2.3.7-2.8 1.4V8.8h-2.8V20h2.9v-5.8c0-1.5.7-2.5 2-2.5s1.9.9 1.9 2.5V20H20v-6.4z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} fill="currentColor">
          <path d="M21.6 7.6a2.6 2.6 0 0 0-1.8-1.8C18.2 5.4 12 5.4 12 5.4s-6.2 0-7.8.4a2.6 2.6 0 0 0-1.8 1.8C2 9.2 2 12 2 12s0 2.8.4 4.4a2.6 2.6 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-4.4.4-4.4s0-2.8-.4-4.4zM10 15V9l5.2 3L10 15z" />
        </svg>
      );
  }
}
