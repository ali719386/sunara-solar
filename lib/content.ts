// All brand copy, figures and media live here so the site can be re-skinned
// without touching components. Keep stats, rating and testimonial in line with real company data.

export type PropertyType = "Home" | "Business" | "Industry";
export type ServiceType = "Installation" | "Maintenance" | "Repair";

export const brand = {
  name: "SUNARA",
  tagline: ["Good energy", "For a brighter everyday"],
};

export const currency = {
  locale: "en-PK",
  symbol: "Rs",
};

export const images = {
  // Transparent, trimmed version of /images/logo.webp (white background removed).
  logo: { src: "/images/logo-mark.png", width: 172, height: 88 },
  hero: { src: "/images/hero.jpg", width: 1672, height: 941, alt: "Terracotta roof with black solar panels under a bright blue sky, green countryside beyond" },
  residential: { src: "/images/residential.jpg", alt: "Stone family home with black solar panels on a tiled roof, garden and pool in front" },
  commercial: { src: "/images/commercial.jpg", alt: "Modern office building at sunset with solar carports beside it" },
  industry: { src: "/images/industry.jpg", alt: "Aerial view of a large logistics warehouse with a solar array across its roof" },
  benefits: { src: "/images/benefits.jpg", alt: "Close view of solar panels on a terracotta tiled roof" },
  // Services page, numbered in display order (1 = hero, 2–4 = service blocks).
  servicesHero: {
    src: "/images/services-1-hero.webp",
    alt: "Technicians in hard hats and safety vests inspecting a solar panel array",
    position: "80% 50%", // keeps all three technicians in frame when cropped
  },
  serviceInstall: { src: "/images/services-2-install.webp", alt: "Installer in orange workwear checking plans beside rooftop solar panels" },
  serviceMaintenance: { src: "/images/services-3-maintenance.webp", alt: "Technician cleaning rooftop solar panels with a long brush" },
  serviceRepair: { src: "/images/services-4-repair.webp", alt: "Gloved hands holding a wrench over a solar panel during repair" },
};

// Image-specific roof mask for /images/hero.jpg (1672 × 941), traced along the tile
// edge so letters disappear exactly at the roofline. Re-trace if the photo changes.
export const heroRoofClip =
  "polygon(32.89% 82.47%, 51.44% 53.56%, 58.97% 41.23%, 75.36% 32.52%, 100% 18.49%, 100% 100%, 32.89% 100%)";

export const nav = {
  links: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Packages", href: "/packages" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: "Get a Free Quote", compact: "Quote", href: "/contact" },
};

// Browser titles and descriptions for each page.
export const pageMeta = {
  services: {
    title: "Solar Services — Installation, Maintenance & Repair | SUNARA",
    description: "Our own team installs, cleans, maintains and repairs solar systems for homes, businesses and industry.",
  },
  packages: {
    title: "Solar Packages — 3 kW to 15 kW+ | SUNARA",
    description: "Compare solar system sizes and find the package that fits your monthly electricity bill.",
  },
  projects: {
    title: "Projects | SUNARA",
    description: "Solar installations completed by our team for homes, businesses and industry.",
  },
  about: {
    title: "About Us | SUNARA",
    description: "Who we are, how we work and the team behind every SUNARA solar installation.",
  },
  contact: {
    title: "Contact Us | SUNARA",
    description: "Get a free quote, book a service or talk to our team about solar for your property.",
  },
};

export const hero = {
  word: "SOLAR",
  eyebrow: "A brighter way forward",
  title: { before: "Sustainable energy for a ", accent: "brighter", after: " tomorrow" },
  text: "High performance solar for homes, businesses and industry",
  primary: { label: "Get a Free Quote", href: "#quote" },
  secondary: { label: "Explore solutions", href: "#solutions" },
};

export const intro = {
  text: "Built around the power of the sun",
  link: { label: "Discover your potential savings", href: "#savings" },
};

export const about = {
  eyebrow: "Who we are",
  lead: ["Better energy", "A better everyday"],
  statement: "We design solar systems that quietly pay for themselves.",
  statementMuted:
    "For homes, businesses and industry, built for the long run and engineered to perform from day one.",
  rating: { value: "4.9 / 5", label: "Customer rating" },
  stats: [
    { value: 10, suffix: "K+", label: "Happy customers" },
    { value: 250, suffix: "MW+", label: "Solar installed" },
    { value: 1, suffix: "M+", label: "Tonnes of CO₂ reduced" },
    { value: 15, suffix: "+", label: "Years of experience" },
  ],
};

export const solutions = {
  eyebrow: "Our solutions",
  title: { lines: ["Power for every", "kind of "], accent: "roof" },
  text: "From your first home to your next big venture, make space for a brighter energy future",
  more: { label: "View all services", href: "/services" },
  items: [
    {
      id: "home",
      property: "Home" as PropertyType,
      label: "01 / For homes",
      title: "Save more, live greener",
      text: "More comfort, less dependence on the grid",
      image: images.residential,
    },
    {
      id: "business",
      property: "Business" as PropertyType,
      label: "02 / For businesses",
      title: "Power your growth",
      text: "Put your roof to work for your business",
      image: images.commercial,
    },
    {
      id: "industry",
      property: "Industry" as PropertyType,
      label: "03 / For industry",
      title: "Big roofs, bigger possibilities",
      text: "Energy designed around your operation",
      image: images.industry,
    },
  ],
};

export const process = {
  eyebrow: "Simple from the start",
  title: ["From sunlight to savings", "In four steps"],
  text: ["We take care of the details", "You look forward to the difference"],
  steps: [
    { n: "01", title: "Free assessment", text: "We start with your roof, your bill and your goals" },
    { n: "02", title: "Custom design", text: "A solar system shaped around the way you use energy" },
    { n: "03", title: "Expert install", text: "Thoughtful installation, with care at every step" },
    { n: "04", title: "Monitor & save", text: "See what you generate and make every sunny day count" },
  ],
};

export const estimator = {
  eyebrow: "Your roof has potential",
  title: { lines: ["See the sunny", "side of your "], accent: "bill" },
  label: "Your monthly electricity bill",
  min: 5000,
  max: 150000,
  step: 1000,
  defaultBill: 40000,
  card: {
    title: "Your solar snapshot",
    system: "Recommended system size",
    savings: "Estimated yearly savings",
    co2: "Estimated CO₂ avoided per year",
    cta: { label: "Let’s explore your roof", href: "#quote" },
  },
  note: "Based on Rs 50 per unit, 4.5 sun hours a day and 90% bill savings. Your free roof assessment confirms the exact figures for your home or site.",
};

export function estimate(bill: number) {
  const units = bill / 50;
  const systemKw = Math.max(1, Math.round((units / 135) * 10) / 10);
  const yearlySavings = Math.round((bill * 12 * 0.9) / 1000) * 1000;
  const co2Tons = ((systemKw * 135 * 12 * 0.45) / 1000).toFixed(1);
  return { units, systemKw, yearlySavings, co2Tons };
}

const numberFormat = new Intl.NumberFormat(currency.locale, { maximumFractionDigits: 0 });
export function formatMoney(n: number) {
  return `${currency.symbol} ${numberFormat.format(n)}`;
}

export const benefits = {
  eyebrow: "More than lower bills",
  title: { before: "Clean energy", accent: "Real", after: " impact" },
  items: [
    { icon: "bolt", title: "Lower electricity bills", text: "Generate your own power and rely less on the grid" },
    { icon: "leaf", title: "Cleaner environment", text: "Make more of the energy that arrives naturally" },
    { icon: "house", title: "A future-ready home", text: "Invest in an energy system built around your life" },
  ] as const,
  warranty: { value: "25 yr", label: "Panel performance warranty" },
  image: images.benefits,
  video: { src: "/videos/panels.mp4", poster: images.benefits.src },
};

export const testimonial = {
  eyebrow: "A brighter everyday",
  quote:
    "Our bill dropped by more than half in the first month. The team was precise, fast and spotless.",
  // Replace with a real customer's name and details before launch.
  name: "Homeowner",
  role: "Residential solar installation",
  initials: "H",
};

export const faq = {
  eyebrow: "A little clarity",
  title: ["Good questions", "Clear answers"],
  text: "Everything starts with a conversation",
  link: { label: "Talk to our team", href: "#quote" },
  items: [
    {
      q: "How long does installation take?",
      a: "Most home systems are installed in one to three days once the design is approved. Larger commercial and industrial projects are scheduled in phases, and we agree a timeline with you before work begins.",
    },
    {
      q: "Do solar panels work on cloudy days?",
      a: "Yes, panels still generate from diffuse daylight, though output is lower than on a clear day. Your system is sized around typical sunshine across the whole year, not a single day.",
    },
    {
      q: "What maintenance will my system need?",
      a: "Very little. Occasional panel cleaning to remove dust, plus a periodic inspection of wiring and the inverter, keeps performance steady. Monitoring helps flag anything unusual early.",
    },
    {
      q: "Can I add battery storage later?",
      a: "In most cases, yes. We can plan a battery-ready inverter and layout from the start, so adding storage later is simpler. Compatibility depends on the equipment you choose.",
    },
  ],
};

export const quote = {
  eyebrow: "Your next chapter starts here",
  title: { lines: ["Ready to power", "your "], accent: "tomorrow?" },
  text: "Tell us where to reach you and we’ll find the possibilities on your roof",
  properties: ["Home", "Business", "Industry"] as PropertyType[],
  services: ["Installation", "Maintenance", "Repair"] as ServiceType[],
  button: "Get Started",
  note: "We’ll only use your email to get in touch about your quote",
  success: "Thank you! Our team will be in touch shortly",
  invalid: "Please enter a valid email address",
};

export const footer = {
  about:
    "Clean, reliable solar for homes, businesses and industry, designed, installed and monitored by one dedicated team",
  // Replace each href with the company's real profile URL.
  socials: [
    { label: "Facebook", icon: "facebook", href: "https://www.facebook.com/" },
    { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/" },
    { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/" },
    { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/" },
  ] as const,
  badges: ["Free roof assessment", "Residential · Commercial · Industrial"],
  columns: [
    {
      title: "Services",
      links: [
        { label: "Solar installation", href: "/services#installation" },
        { label: "Maintenance & cleaning", href: "/services#maintenance" },
        { label: "Repair & support", href: "/services#repair" },
        { label: "Free assessment", href: "/contact" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Solar packages", href: "/packages" },
        { label: "Homes", href: "/#solutions" },
        { label: "Businesses", href: "/#solutions" },
        { label: "Industry", href: "/#solutions" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About us", href: "/about" },
        { label: "Projects", href: "/projects" },
        { label: "Customer stories", href: "/#stories" },
        { label: "Savings calculator", href: "/#savings" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQs", href: "/#faq" },
        { label: "Get a quote", href: "/contact" },
        { label: "Contact us", href: "/contact" },
      ],
    },
  ],
  rights: "All rights reserved.",
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  region: "Pakistan (EN)",
  backToTop: "Back to top",
};

export const legalPages = {
  privacy: {
    title: "Privacy Policy",
    text: "Our full privacy policy is being finalised. If you have any questions about how we handle your information, please get in touch with our team.",
  },
  terms: {
    title: "Terms of Service",
    text: "Our full terms of service are being finalised. If you have any questions in the meantime, please get in touch with our team.",
  },
  back: "Back to home",
};

/* ───────────────────────── Inner pages ───────────────────────── */

export type FaqData = {
  eyebrow: string;
  title: readonly string[];
  text: string;
  link: { label: string; href: string };
  items: { q: string; a: string }[];
};

export const servicesPage = {
  hero: {
    crumb: "Services",
    eyebrow: "Our services",
    title: "Installation, maintenance and repair,",
    accent: "all by one team",
    text: "Our own trained team comes to your home, business or site to install your solar system, keep it clean and running, and fix it if anything goes wrong",
    image: images.servicesHero,
    primary: { label: "Book a service", href: "#quote" },
    secondary: { label: "View packages", href: "/packages" },
  },
  intro: {
    eyebrow: "What we do",
    title: "Everything your solar system needs,",
    accent: "from day one",
    text: "One team handles the full life of your system, so you always know who to call",
  },
  bookLabel: "Book this service",
  includedLabel: "What’s included",
  items: [
    {
      id: "installation",
      service: "Installation" as ServiceType,
      icon: "install",
      n: "01",
      title: "Solar installation",
      text: "From the first roof survey to switching your system on, our installation team handles every step on site, safely and neatly",
      included: [
        "Site survey and roof assessment",
        "System design sized to your usage",
        "Mounting structure and panel fitting",
        "Inverter, wiring and protection setup",
        "Testing, handover and monitoring setup",
      ],
      image: images.serviceInstall,
    },
    {
      id: "maintenance",
      service: "Maintenance" as ServiceType,
      icon: "clean",
      n: "02",
      title: "Maintenance & cleaning",
      text: "Dust and wear slowly reduce output. Regular cleaning and check-ups keep your panels producing as much power as they can",
      included: [
        "Panel cleaning without harsh chemicals",
        "Wiring, connector and earthing inspection",
        "Inverter health and settings check",
        "Mounting structure tightness check",
        "Performance report after every visit",
      ],
      image: images.serviceMaintenance,
    },
    {
      id: "repair",
      service: "Repair" as ServiceType,
      icon: "repair",
      n: "03",
      title: "Repair & support",
      text: "If output drops or something stops working, our technicians find the fault and fix it, whether we installed the system or not",
      included: [
        "On-site fault diagnosis",
        "Inverter and wiring repairs",
        "Damaged panel and connector replacement",
        "System re-testing after every repair",
        "Ongoing support from the same team",
      ],
      image: images.serviceRepair,
    },
  ],
  why: {
    eyebrow: "Why our team",
    title: "Care you can see",
    accent: "on every visit",
    items: [
      { icon: "team", title: "Trained installers", text: "Our own technicians do the work, not unknown subcontractors" },
      { icon: "safety", title: "Safety first", text: "Proper protection, earthing and safe working at height on every job" },
      { icon: "clean", title: "Clean worksite", text: "We tidy up after ourselves and leave your property as we found it" },
      { icon: "support", title: "After-sales support", text: "The same team stays with you long after the system is switched on" },
    ],
  },
  faq: {
    eyebrow: "Service questions",
    title: ["Before we visit", "Good to know"],
    text: "Still have questions? Our team is happy to help",
    link: { label: "Contact our team", href: "/contact" },
    items: [
      {
        q: "How often should solar panels be cleaned?",
        a: "It depends on dust and weather in your area. Many systems benefit from cleaning every one to three months, and we can suggest a schedule after looking at your site.",
      },
      {
        q: "Do you service systems installed by another company?",
        a: "Yes. Our team can inspect, clean and repair most systems, wherever they were installed. We check the setup first and explain what we find before any work starts.",
      },
      {
        q: "How long does a maintenance visit take?",
        a: "Most home visits take a few hours, depending on system size and roof access. Larger commercial sites are planned with you in advance.",
      },
      {
        q: "What happens if my system stops producing power?",
        a: "Contact us with your system details. We will arrange a visit, diagnose the fault on site and explain the repair options before fixing it.",
      },
    ],
  } satisfies FaqData,
};

// Monthly bill a system size suits, using the same assumptions as the savings estimator
// (Rs 50 per unit, ~135 units per kW per month).
export function billForKw(kw: number) {
  return Math.round((kw * 135 * 50) / 1000) * 1000;
}

export const packagesPage = {
  hero: {
    crumb: "Packages",
    eyebrow: "Solar packages",
    title: "Find the system size",
    accent: "that fits your bill",
    text: "Every package is designed, installed and supported by our own team. Final sizing is confirmed after a free roof assessment",
  },
  billLabel: "Suits monthly bills up to",
  unitsLabel: "units generated per month (approx.)",
  includedLabel: "Included",
  // Leave price empty to show "Get a custom quote".
  priceOnRequest: "Get a custom quote",
  cta: "Get this package",
  items: [
    {
      kw: 3,
      name: "Starter Home",
      for: "Small homes and apartments with lights, fans and a fridge",
      price: "",
      featured: false,
      included: ["Solar panels and mounting structure", "Inverter", "Wiring, protection and earthing", "Installation and commissioning"],
    },
    {
      kw: 5,
      name: "Family Home",
      for: "Family homes running one air conditioner and daily appliances",
      price: "",
      featured: true,
      featuredLabel: "Ideal for family homes",
      included: ["Solar panels and mounting structure", "Inverter", "Wiring, protection and earthing", "Installation and commissioning", "Monitoring setup"],
    },
    {
      kw: 10,
      name: "Large Home",
      for: "Larger homes with several air conditioners or small offices",
      price: "",
      featured: false,
      included: ["Solar panels and mounting structure", "Inverter", "Wiring, protection and earthing", "Installation and commissioning", "Monitoring setup"],
    },
    {
      kw: 15,
      plus: true,
      name: "Business & Industry",
      for: "Shops, offices, factories and other commercial sites",
      price: "",
      featured: false,
      included: ["Site survey and custom engineering", "Commercial-grade inverters", "Structural and electrical design", "Installation and commissioning", "Monitoring and maintenance plan"],
    },
  ],
  help: {
    title: "Not sure which size you need?",
    text: "Move the slider in our savings calculator to see a recommended system size for your monthly bill",
    link: { label: "Open the savings calculator", href: "/#savings" },
  },
};

export const projectsPage = {
  hero: {
    crumb: "Projects",
    eyebrow: "Our work",
    title: "Solar systems we’ve",
    accent: "brought to life",
    text: "A look at installations completed by our team for homes, businesses and industry",
  },
  filters: ["All", "Home", "Business", "Industry"] as const,
  // TODO: replace these placeholders with real projects (photo, location, size).
  // Leave location or size empty to hide them.
  items: [
    { title: "Family home rooftop", type: "Home" as PropertyType, location: "", size: "", image: images.residential },
    { title: "Tiled roof installation", type: "Home" as PropertyType, location: "", size: "", image: images.hero },
    { title: "Office building system", type: "Business" as PropertyType, location: "", size: "", image: images.commercial },
    { title: "Warehouse rooftop array", type: "Industry" as PropertyType, location: "", size: "", image: images.industry },
    { title: "Panel maintenance visit", type: "Home" as PropertyType, location: "", size: "", image: images.benefits },
  ],
  empty: "No projects in this category yet",
};

export const aboutPage = {
  hero: {
    crumb: "About",
    eyebrow: "About us",
    title: "Solar done properly,",
    accent: "by people who care",
    text: "We design, install and look after solar systems for homes, businesses and industry, with one team responsible from start to finish",
    image: images.commercial,
  },
  // TODO: replace with the company's own story.
  story: {
    eyebrow: "Our story",
    title: "Built on doing",
    accent: "the job right",
    paragraphs: [
      "SUNARA started with a simple idea: solar should be clear, reliable and properly looked after. Too many systems are installed and then forgotten, losing output to dust, loose wiring or faults nobody notices.",
      "That is why we handle everything ourselves, from the first roof survey to installation, cleaning and repairs. Our customers always know who to call, and our team takes responsibility for the work it does.",
    ],
  },
  values: {
    eyebrow: "What we stand for",
    title: "Our",
    accent: "values",
    items: [
      { icon: "quality", title: "Quality", text: "Careful design and neat, durable installation on every project" },
      { icon: "safety", title: "Safety", text: "Safe working practices and proper electrical protection, always" },
      { icon: "clear", title: "Transparency", text: "Clear advice, honest sizing and no hidden surprises" },
      { icon: "support", title: "Long-term support", text: "Maintenance and repairs from the same team that installed your system" },
    ],
  },
  team: {
    eyebrow: "Our team",
    title: "The people",
    accent: "behind the work",
    text: "Every project is handled by our own specialists",
    // TODO: add real team members (name, role, photo) when available.
    items: [
      { icon: "design", title: "Engineering & design", text: "Survey your site and design a system around your energy use" },
      { icon: "install", title: "Installation crew", text: "Fit panels, inverters and wiring safely and neatly on site" },
      { icon: "support", title: "Maintenance & support", text: "Clean, inspect and repair systems to keep them performing" },
    ],
  },
};

export const contact = {
  hero: {
    crumb: "Contact",
    eyebrow: "Contact us",
    title: "Let’s talk about",
    accent: "your solar",
    text: "Ask for a free quote, book a service or simply ask a question. Our team will get back to you",
  },
  // TODO: fill in the real company details. Empty fields are hidden.
  details: {
    phone: "",
    whatsapp: "", // international format without + or spaces, e.g. 923001234567
    email: "",
    address: "",
    hours: "",
  },
  labels: {
    phone: "Call us",
    whatsapp: "WhatsApp",
    email: "Email",
    address: "Visit us",
    hours: "Working hours",
    socials: "Follow us",
    fallback: "Send us a message using the form and our team will get back to you",
  },
  form: {
    title: "Send us a message",
    name: "Full name",
    phone: "Phone number",
    email: "Email address",
    property: "Property type",
    service: "I’m interested in",
    services: ["New installation", "Maintenance & cleaning", "Repair & support", "Solar package", "Something else"],
    message: "Message",
    messagePlaceholder: "Tell us about your property, your monthly bill or the issue you’re facing",
    button: "Send message",
    note: "We’ll only use your details to reply to your enquiry",
    success: "Thank you! Our team will get back to you shortly",
    errors: {
      name: "Please enter your name",
      email: "Please enter a valid email address",
      phone: "Please enter a valid phone number",
    },
  },
};
