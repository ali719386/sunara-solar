// All About page copy lives here so names, numbers and addresses can be edited
// without touching components. Every claim marked TODO must be verified before launch.
// Avoid the em dash character in copy.

import { images } from "@/lib/content";
import { publicEnv } from "@/lib/env";

/** Optional public links, set in the Vercel project (or .env.local). Empty values are hidden. */
export const env = publicEnv;

export type Stat = { value: number; suffix: string; label: string; decimals?: number };

export const aboutContent = {
  meta: {
    title: "About Us | SUNARA",
    description:
      "Meet the SUNARA team: one local team that designs, installs, monitors and repairs solar for homes, businesses and industry in Faisalabad and Lahore.",
  },

  hero: {
    crumb: "About us",
    eyebrow: "About SUNARA",
    title: "Solar done properly,",
    accent: "by people who care",
    lead: "One team designs, installs and looks after your system, from the first roof survey to the last repair.",
    primary: { label: "Book a free roof assessment", href: "/contact" },
    secondary: { label: "Meet the team", href: "#team" },
    image: images.aboutHero,
  },

  story: {
    eyebrow: "Our story",
    title: "Built on doing",
    accent: "the job right",
    text: "Too many solar systems are installed and then forgotten, slowly losing output to dust, loose wiring and faults nobody notices. We started SUNARA to fix that. We look after everything ourselves, from design and installation to cleaning, monitoring and repairs, so you always know who to call.",
    // TODO: verify founder name, role and quote. Add a photo path (e.g. "/images/founder.webp") when available.
    founder: {
      name: "Founder name",
      role: "Founder and Managing Director",
      quote: "We only put our name on systems we would be proud to look after for the next 25 years.",
      photo: "",
      initials: "SN",
    },
  },

  // TODO: confirm milestones against company history.
  timeline: {
    eyebrow: "Our journey",
    title: "Fifteen years of",
    accent: "steady growth",
    items: [
      { year: "2011", title: "Founded", text: "Started with a small team of engineers and installers" },
      { year: "2016", title: "50 MW installed", text: "Crossed 50 MW across homes, businesses and industry" },
      { year: "2021", title: "Live monitoring", text: "Every new system connected to live performance monitoring" },
      { year: "Today", title: "10K+ homes", text: "Trusted by more than ten thousand families and businesses" },
    ],
  },

  // TODO: confirm all figures against company data.
  stats: [
    { value: 10, suffix: "K+", label: "Happy customers" },
    { value: 250, suffix: "MW+", label: "Solar installed" },
    { value: 15, suffix: "+", label: "Years of experience" },
    { value: 4.9, suffix: "/5", label: "Customer rating", decimals: 1 },
  ] satisfies Stat[],

  trust: {
    eyebrow: "Why you can trust us",
    title: "Approved, certified and",
    accent: "properly equipped",
    approvalsTitle: "Approvals and standards",
    // TODO: verify each approval. Set show: false to hide any that are not yet confirmed.
    approvals: [
      { label: "NEPRA net metering", detail: "Approved for net metering applications", show: true },
      { label: "AEDB registered", detail: "Registered solar installer", show: true },
      { label: "ISO 9001", detail: "Quality management system", show: true },
      { label: "IEC compliant", detail: "Panels and inverters to IEC standards", show: true },
    ],
    warranty: { value: "25 yr", label: "Panel performance warranty", text: "Backed by the manufacturer and supported by our team" },
    partnersTitle: "Equipment partners",
    partnersText: "We install tier one equipment from brands we trust",
    // TODO: confirm partner brands. Add a logo path (e.g. "/images/partners/jinko.svg") once real logos are approved.
    partners: [
      { name: "Jinko", logo: "" },
      { name: "Longi", logo: "" },
      { name: "Canadian Solar", logo: "" },
      { name: "Huawei", logo: "" },
      { name: "Growatt", logo: "" },
      { name: "Solis", logo: "" },
    ],
  },

  values: {
    eyebrow: "What we stand for",
    title: "Our",
    accent: "values",
    items: [
      // TODO: verify the "40 point check" claim.
      { icon: "quality", title: "Quality", text: "Careful design and neat, durable installation on every roof", proof: "40 point check before every handover" },
      // TODO: verify the "zero lost time incidents" claim.
      { icon: "safety", title: "Safety", text: "Safe working practices and proper electrical protection, always", proof: "Zero lost time incidents on site" },
      { icon: "clear", title: "Transparency", text: "Clear advice, honest sizing and no hidden surprises", proof: "Itemised quote before any work starts" },
      { icon: "support", title: "Long-term support", text: "Maintenance and repairs from the team that installed your system", proof: "One number to call for the life of your system" },
    ],
  },

  team: {
    id: "team",
    eyebrow: "Our team",
    title: "The people",
    accent: "behind the work",
    text: "Every project is handled by our own specialists, never subcontracted",
    // TODO: replace with real team names, roles and photos (e.g. "/images/team/ali.webp").
    members: [
      { name: "Team member", role: "Head of Engineering", text: "Surveys your site and designs a system around your energy use", photo: "", initials: "HE" },
      { name: "Team member", role: "Installation Lead", text: "Leads the crew that fits panels, inverters and wiring", photo: "", initials: "IL" },
      { name: "Team member", role: "Service Manager", text: "Keeps every system clean, inspected and performing", photo: "", initials: "SM" },
      { name: "Team member", role: "Customer Advisor", text: "Your first call for quotes, paperwork and questions", photo: "", initials: "CA" },
    ],
  },

  comparison: {
    eyebrow: "The difference",
    title: "Typical installer vs",
    accent: "SUNARA",
    caption: "How SUNARA compares with a typical solar installer",
    columns: { feature: "What you get", typical: "Typical installer", sunara: "SUNARA" },
    // typical: true = included, false = not included, "partial" = sometimes or at extra cost.
    rows: [
      { feature: "One team for design, installation and repair", typical: false, sunara: true },
      { feature: "Live monitoring included", typical: "partial", sunara: true },
      { feature: "Scheduled cleaning and inspection", typical: false, sunara: true },
      { feature: "Itemised quote before work starts", typical: "partial", sunara: true },
      { feature: "25 year warranty support", typical: "partial", sunara: true },
    ] as { feature: string; typical: boolean | "partial"; sunara: boolean | "partial" }[],
    labels: { yes: "Included", no: "Not included", partial: "Sometimes, or at extra cost" },
  },

  local: {
    eyebrow: "Local to you",
    title: "Two offices,",
    accent: "one team",
    // TODO: verify office addresses and opening hours.
    offices: [
      { city: "Faisalabad", address: "Office address, Faisalabad", region: "Punjab", hours: "Mon to Sat, 9:00 am to 6:00 pm" },
      { city: "Lahore", address: "Office address, Lahore", region: "Punjab", hours: "Mon to Sat, 9:00 am to 6:00 pm" },
    ],
    notes: [
      { icon: "zap", title: "Built for load shedding", text: "We size batteries and hybrid inverters so your essentials keep running during outages." },
      { icon: "file", title: "Net metering paperwork handled", text: "We prepare and follow up your net metering application with the distribution company for you." },
    ],
  },

  cta: {
    eyebrow: "Your next chapter starts here",
    title: "Ready to power",
    accent: "your tomorrow?",
    text: "Book a free roof assessment and get a clear, honest plan for your property.",
    primary: { label: "Book a free assessment", href: "/contact" },
    secondary: { label: "Meet our team", href: "#team" },
    whatsapp: { label: "Chat on WhatsApp" },
  },
};
