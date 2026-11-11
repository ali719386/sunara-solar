// Solar calculator settings. Every number here is an estimate; edit freely.

export type CurrencyCode = "USD" | "GBP" | "AUD" | "EUR" | "AED" | "PKR" | "INR";

/** Key for the location tip used by the AI advice and the local fallback text. */
export type TipKey = "ca" | "tx" | "fl" | "uk" | "au" | "pk" | "in" | "gen";

export type CurrencyConfig = {
  code: CurrencyCode;
  /** Printed before the amount, including any trailing space. */
  symbol: string;
  /** Monthly bill slider range and default. */
  bill: { min: number; max: number; step: number; default: number };
  /** Installed cost per watt in this currency when no preset matches. */
  costPerWatt: number;
  /** Rate step for the per kWh input. */
  rateStep: number;
  /** Typical rate per kWh used by the chat assistant when the place has no preset and no rate is given. */
  defaultRate: number;
};

export type Preset = {
  name: string;
  /** Lowercase keywords matched exactly against the typed location. */
  keywords: string[];
  currency: CurrencyCode;
  rate: number;
  sunHours: number;
  /** Highest share of the bill solar can realistically remove (fixed charges, night use). */
  offsetCap: number;
  costPerWatt: number;
  tip: TipKey;
};

export const currencies: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", bill: { min: 50, max: 800, step: 5, default: 200 }, costPerWatt: 2.8, rateStep: 0.01, defaultRate: 0.17 },
  GBP: { code: "GBP", symbol: "£", bill: { min: 40, max: 600, step: 5, default: 150 }, costPerWatt: 1.5, rateStep: 0.01, defaultRate: 0.27 },
  AUD: { code: "AUD", symbol: "A$", bill: { min: 80, max: 900, step: 5, default: 250 }, costPerWatt: 1.1, rateStep: 0.01, defaultRate: 0.33 },
  EUR: { code: "EUR", symbol: "€", bill: { min: 50, max: 700, step: 5, default: 150 }, costPerWatt: 1.6, rateStep: 0.01, defaultRate: 0.25 },
  AED: { code: "AED", symbol: "AED ", bill: { min: 200, max: 3000, step: 10, default: 800 }, costPerWatt: 3, rateStep: 0.01, defaultRate: 0.38 },
  PKR: { code: "PKR", symbol: "Rs ", bill: { min: 5000, max: 150000, step: 1000, default: 40000 }, costPerWatt: 130, rateStep: 1, defaultRate: 50 },
  INR: { code: "INR", symbol: "₹", bill: { min: 500, max: 30000, step: 100, default: 5000 }, costPerWatt: 55, rateStep: 0.5, defaultRate: 7 },
};

export const currencyCodes = Object.keys(currencies) as CurrencyCode[];

export const presets: Preset[] = [
  {
    name: "California",
    keywords: ["california", "los angeles", "san francisco", "san diego"],
    currency: "USD", rate: 0.32, sunHours: 5.5, offsetCap: 0.8, costPerWatt: 3.0, tip: "ca",
  },
  {
    name: "Texas",
    keywords: ["texas", "austin", "houston", "dallas"],
    currency: "USD", rate: 0.15, sunHours: 5.2, offsetCap: 0.9, costPerWatt: 2.6, tip: "tx",
  },
  {
    name: "Florida",
    keywords: ["florida", "miami", "orlando", "tampa"],
    currency: "USD", rate: 0.16, sunHours: 5.3, offsetCap: 0.9, costPerWatt: 2.7, tip: "fl",
  },
  {
    name: "UK",
    keywords: ["london", "uk", "united kingdom", "england"],
    currency: "GBP", rate: 0.27, sunHours: 2.8, offsetCap: 0.85, costPerWatt: 1.5, tip: "uk",
  },
  {
    name: "Australia",
    keywords: ["australia", "sydney", "melbourne", "brisbane", "perth"],
    currency: "AUD", rate: 0.33, sunHours: 4.5, offsetCap: 0.8, costPerWatt: 1.1, tip: "au",
  },
  {
    name: "Pakistan",
    keywords: ["pakistan", "lahore", "faisalabad", "karachi", "islamabad"],
    currency: "PKR", rate: 50, sunHours: 4.5, offsetCap: 0.8, costPerWatt: 130, tip: "pk",
  },
  {
    name: "India",
    keywords: ["india", "delhi", "mumbai", "bangalore", "pune", "hyderabad"],
    currency: "INR", rate: 7, sunHours: 5, offsetCap: 0.9, costPerWatt: 55, tip: "in",
  },
];

/** Suggestions in the location datalist. Users can still type any place. */
export const locationSuggestions = [
  "California", "Texas", "Miami", "Florida", "London", "Australia",
  "Sydney", "Pakistan", "Lahore", "Faisalabad", "India", "Delhi",
];

export const solarConstants = {
  /** Real world losses: inverter, wiring, heat, dust. */
  derate: 0.8,
  panelWatts: 400,
  /** Share of the roof that can actually hold panels. */
  usableRoofRatio: 0.6,
  wattsPerSqFtOfPanel: 19,
  /** Offset cap used when the location has no preset. */
  defaultOffsetCap: 0.85,
  /** Tonnes of CO2 avoided per kWh of solar. */
  co2TonsPerKwh: 0.0004,
  minSystemWatts: 400,
  /** Sun hours used by the chat assistant when the place has no preset and none are given. */
  defaultSunHours: 4.5,
};

export const inputLimits = {
  roof: { min: 300, max: 6000, step: 50, default: 1500 },
  sunHours: { min: 1, max: 8, step: 0.1 },
  rate: { min: 0.01, max: 1000 },
};

/** One practical tip per location, used when the AI advice is unavailable. */
export const tips: Record<TipKey, string> = {
  ca: "In California, a time of use rate plan and a home battery let you use solar power during the pricey evening hours.",
  tx: "In Texas, summer air conditioning drives your peak use, so panels facing south or west cover it best.",
  fl: "In Florida, cooling runs all year, and hurricane rated mounting keeps your panels secure in storm season.",
  uk: "In the UK, winter output is low, so a battery helps you store summer and daytime power for later.",
  au: "In Australia, export payments are low, so using your solar power yourself and adding a battery saves the most.",
  pk: "In Pakistan, exported units earn less than the units you buy, so running appliances in the daytime saves the most.",
  in: "In India, ask about rooftop solar subsidy schemes, which can lower your upfront cost.",
  gen: "Confirm your local rate and sun hours at your free assessment so the figures match your home.",
};

export const defaultLocation ={ name: "California", currency: "USD" as CurrencyCode };

/** Parts of "Punjab, Pakistan", most specific first: ["punjab, pakistan", "punjab", "pakistan"]. */
function locationKeys(location: string) {
  const full = location.trim().toLowerCase();
  if (!full) return [];
  const parts = full.split(",").map((p) => p.trim()).filter(Boolean);
  return [...new Set([full, ...parts])];
}

/**
 * Lowercase exact keyword match on the whole text or on any comma separated part, most specific
 * first, so "California, United States" finds California and "Sindh, Pakistan" finds Pakistan.
 * Returns undefined when the place has no preset.
 */
export function findPreset(location: string): Preset | undefined {
  for (const key of locationKeys(location)) {
    const hit = presets.find((p) => p.keywords.includes(key) || p.name.toLowerCase() === key);
    if (hit) return hit;
  }
  return undefined;
}

/** Eurozone countries, so any of them switches the calculator to EUR. */
const EURO_COUNTRIES = [
  "austria", "belgium", "croatia", "cyprus", "estonia", "finland", "france", "germany", "greece", "ireland",
  "italy", "latvia", "lithuania", "luxembourg", "malta", "netherlands", "portugal", "slovakia", "slovenia", "spain",
];
const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  "united states": "USD", usa: "USD", us: "USD", america: "USD",
  "united kingdom": "GBP", uk: "GBP", england: "GBP", scotland: "GBP", wales: "GBP",
  australia: "AUD",
  "united arab emirates": "AED", uae: "AED",
  pakistan: "PKR",
  india: "INR",
  ...Object.fromEntries(EURO_COUNTRIES.map((c) => [c, "EUR" as const])),
};

/** Currency for a place without a preset, e.g. "Ohio, United States" gives USD. */
export function currencyForLocation(location: string): CurrencyCode | undefined {
  for (const key of locationKeys(location).reverse()) {
    if (COUNTRY_CURRENCY[key]) return COUNTRY_CURRENCY[key];
  }
  return undefined;
}
