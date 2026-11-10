// Public, optional settings from env vars (Vercel project settings or .env.local).
// Kept out of lib/content.ts because that file exports a `process` section object,
// which shadows the global `process` there. Empty values are hidden on the site.

export const publicEnv = {
  // Business WhatsApp (0305 7707321). NEXT_PUBLIC_WHATSAPP_NUMBER overrides it; digits only, country code first.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923057707321",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  socials: {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "",
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "",
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? "",
  },
};
