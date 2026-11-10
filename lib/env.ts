// Public, optional settings from env vars (Vercel project settings or .env.local).
// Kept out of lib/content.ts because that file exports a `process` section object,
// which shadows the global `process` there. Empty values are hidden on the site.

export const publicEnv = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "", // digits only, e.g. 923001234567
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  socials: {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "",
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "",
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? "",
  },
};
