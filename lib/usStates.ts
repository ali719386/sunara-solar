// US states and DC with their own electricity figures for the savings calculator.
//
// Rate, monthly use and bill: US Energy Information Administration (EIA), "2024 Average Monthly
// Bill - Residential" (Table 5A, forms EIA-861), https://www.eia.gov/electricity/sales_revenue_price/
// rate = average residential price in USD per kWh, bill = average monthly residential bill in USD.
//
// Sun hours: annual average peak sun hours per day, from Unbound Solar's state table based on
// NREL PVWatts / NSRDB data, https://unboundsolar.com/solar-information/sun-hours-us-map
//
// Update these numbers when EIA publishes a newer year.

export type UsState = {
  name: string;
  code: string;
  /** Average residential price, USD per kWh (EIA 2024). */
  rate: number;
  /** Average residential use, kWh per month (EIA 2024). */
  monthlyKwh: number;
  /** Average residential bill, USD per month (EIA 2024). */
  bill: number;
  /** Annual average peak sun hours per day (NREL based). */
  sunHours: number;
};

export const US_DATA_YEAR = 2024;

export const usStates: UsState[] = [
  { name: "Alabama", code: "AL", rate: 0.1518, monthlyKwh: 1143, bill: 173.50, sunHours: 4.6 },
  { name: "Alaska", code: "AK", rate: 0.2482, monthlyKwh: 578, bill: 143.54, sunHours: 3.0 },
  { name: "Arizona", code: "AZ", rate: 0.1491, monthlyKwh: 1075, bill: 160.24, sunHours: 6.5 },
  { name: "Arkansas", code: "AR", rate: 0.1232, monthlyKwh: 1048, bill: 129.13, sunHours: 4.5 },
  { name: "California", code: "CA", rate: 0.3197, monthlyKwh: 503, bill: 160.86, sunHours: 5.6 },
  { name: "Colorado", code: "CO", rate: 0.1492, monthlyKwh: 674, bill: 100.57, sunHours: 5.5 },
  { name: "Connecticut", code: "CT", rate: 0.2875, monthlyKwh: 695, bill: 199.66, sunHours: 4.2 },
  { name: "Delaware", code: "DE", rate: 0.1657, monthlyKwh: 911, bill: 150.87, sunHours: 4.4 },
  { name: "District of Columbia", code: "DC", rate: 0.1771, monthlyKwh: 639, bill: 113.23, sunHours: 4.4 },
  { name: "Florida", code: "FL", rate: 0.1414, monthlyKwh: 1104, bill: 156.09, sunHours: 5.3 },
  { name: "Georgia", code: "GA", rate: 0.1408, monthlyKwh: 1074, bill: 151.25, sunHours: 4.8 },
  { name: "Hawaii", code: "HI", rate: 0.4286, monthlyKwh: 495, bill: 212.12, sunHours: 5.8 },
  { name: "Idaho", code: "ID", rate: 0.1152, monthlyKwh: 944, bill: 108.73, sunHours: 4.9 },
  { name: "Illinois", code: "IL", rate: 0.1587, monthlyKwh: 693, bill: 109.99, sunHours: 4.3 },
  { name: "Indiana", code: "IN", rate: 0.1477, monthlyKwh: 901, bill: 133.06, sunHours: 4.2 },
  { name: "Iowa", code: "IA", rate: 0.1340, monthlyKwh: 832, bill: 111.54, sunHours: 4.4 },
  { name: "Kansas", code: "KS", rate: 0.1415, monthlyKwh: 876, bill: 123.90, sunHours: 5.0 },
  { name: "Kentucky", code: "KY", rate: 0.1279, monthlyKwh: 1047, bill: 133.81, sunHours: 4.3 },
  { name: "Louisiana", code: "LA", rate: 0.1173, monthlyKwh: 1202, bill: 140.96, sunHours: 4.7 },
  { name: "Maine", code: "ME", rate: 0.2429, monthlyKwh: 550, bill: 133.60, sunHours: 4.2 },
  { name: "Maryland", code: "MD", rate: 0.1786, monthlyKwh: 929, bill: 165.87, sunHours: 4.4 },
  { name: "Massachusetts", code: "MA", rate: 0.2935, monthlyKwh: 570, bill: 167.20, sunHours: 4.2 },
  { name: "Michigan", code: "MI", rate: 0.1930, monthlyKwh: 618, bill: 119.31, sunHours: 4.0 },
  { name: "Minnesota", code: "MN", rate: 0.1545, monthlyKwh: 712, bill: 110.06, sunHours: 4.3 },
  { name: "Mississippi", code: "MS", rate: 0.1339, monthlyKwh: 1156, bill: 154.83, sunHours: 4.6 },
  { name: "Missouri", code: "MO", rate: 0.1291, monthlyKwh: 1001, bill: 129.18, sunHours: 4.6 },
  { name: "Montana", code: "MT", rate: 0.1266, monthlyKwh: 852, bill: 107.91, sunHours: 4.7 },
  { name: "Nebraska", code: "NE", rate: 0.1153, monthlyKwh: 956, bill: 110.28, sunHours: 4.8 },
  { name: "Nevada", code: "NV", rate: 0.1500, monthlyKwh: 930, bill: 139.39, sunHours: 6.4 },
  { name: "New Hampshire", code: "NH", rate: 0.2340, monthlyKwh: 619, bill: 144.87, sunHours: 4.2 },
  { name: "New Jersey", code: "NJ", rate: 0.1934, monthlyKwh: 662, bill: 128.13, sunHours: 4.3 },
  { name: "New Mexico", code: "NM", rate: 0.1420, monthlyKwh: 654, bill: 92.88, sunHours: 6.5 },
  { name: "New York", code: "NY", rate: 0.2443, monthlyKwh: 571, bill: 139.53, sunHours: 4.0 },
  { name: "North Carolina", code: "NC", rate: 0.1413, monthlyKwh: 1015, bill: 143.50, sunHours: 4.7 },
  { name: "North Dakota", code: "ND", rate: 0.1151, monthlyKwh: 1029, bill: 118.38, sunHours: 4.5 },
  { name: "Ohio", code: "OH", rate: 0.1599, monthlyKwh: 846, bill: 135.16, sunHours: 4.1 },
  { name: "Oklahoma", code: "OK", rate: 0.1224, monthlyKwh: 1079, bill: 132.05, sunHours: 5.1 },
  { name: "Oregon", code: "OR", rate: 0.1470, monthlyKwh: 882, bill: 129.62, sunHours: 4.2 },
  { name: "Pennsylvania", code: "PA", rate: 0.1777, monthlyKwh: 817, bill: 145.17, sunHours: 4.1 },
  { name: "Rhode Island", code: "RI", rate: 0.2865, monthlyKwh: 567, bill: 162.40, sunHours: 4.2 },
  { name: "South Carolina", code: "SC", rate: 0.1423, monthlyKwh: 1050, bill: 149.51, sunHours: 4.8 },
  { name: "South Dakota", code: "SD", rate: 0.1286, monthlyKwh: 994, bill: 127.81, sunHours: 4.7 },
  { name: "Tennessee", code: "TN", rate: 0.1242, monthlyKwh: 1154, bill: 143.32, sunHours: 4.4 },
  { name: "Texas", code: "TX", rate: 0.1494, monthlyKwh: 1096, bill: 163.72, sunHours: 5.3 },
  { name: "Utah", code: "UT", rate: 0.1222, monthlyKwh: 774, bill: 94.57, sunHours: 5.5 },
  { name: "Vermont", code: "VT", rate: 0.2190, monthlyKwh: 574, bill: 125.66, sunHours: 4.0 },
  { name: "Virginia", code: "VA", rate: 0.1441, monthlyKwh: 1032, bill: 148.77, sunHours: 4.5 },
  { name: "Washington", code: "WA", rate: 0.1190, monthlyKwh: 955, bill: 113.68, sunHours: 3.8 },
  { name: "West Virginia", code: "WV", rate: 0.1507, monthlyKwh: 1027, bill: 154.76, sunHours: 4.1 },
  { name: "Wisconsin", code: "WI", rate: 0.1718, monthlyKwh: 645, bill: 110.87, sunHours: 4.2 },
  { name: "Wyoming", code: "WY", rate: 0.1247, monthlyKwh: 863, bill: 107.65, sunHours: 5.2 },
];

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

/**
 * The state named in a location such as "Texas", "TX", "Texas, USA" or "Austin, Texas".
 * Returns undefined when no US state is named.
 */
export function findUsState(location: string): UsState | undefined {
  const parts = location.split(",").map(norm).filter(Boolean);
  for (const p of parts) {
    const hit = usStates.find((s) => norm(s.name) === p || s.code.toLowerCase() === p || (s.code === "DC" && (p === "washington dc" || p === "washington d.c." || p === "dc")));
    if (hit) return hit;
  }
  return undefined;
}

/** States for the dropdown: all of them when empty, else names (or codes) that match what was typed. */
export function searchUsStates(query: string): UsState[] {
  const q = norm(query).replace(/,\s*(usa|us|united states)$/, "");
  if (!q || q === "usa" || q === "us" || q === "united states" || q === "america") return usStates;
  const starts = usStates.filter((s) => norm(s.name).startsWith(q) || s.code.toLowerCase() === q);
  const words = usStates.filter((s) => !starts.includes(s) && norm(s.name).split(" ").some((w) => w.startsWith(q)));
  return [...starts, ...words];
}

/**
 * Most populous city in each state, where the monthly sun pattern is measured (that is where
 * most homes are). Used only for the month by month chart; the annual figure is the state average.
 */
export const LARGEST_CITY: Record<string, string> = {
  AL: "Huntsville", AK: "Anchorage", AZ: "Phoenix", AR: "Little Rock", CA: "Los Angeles", CO: "Denver",
  CT: "Bridgeport", DE: "Wilmington", DC: "Washington", FL: "Jacksonville", GA: "Atlanta", HI: "Honolulu",
  ID: "Boise", IL: "Chicago", IN: "Indianapolis", IA: "Des Moines", KS: "Wichita", KY: "Louisville",
  LA: "New Orleans", ME: "Portland", MD: "Baltimore", MA: "Boston", MI: "Detroit", MN: "Minneapolis",
  MS: "Jackson", MO: "Kansas City", MT: "Billings", NE: "Omaha", NV: "Las Vegas", NH: "Manchester",
  NJ: "Newark", NM: "Albuquerque", NY: "New York", NC: "Charlotte", ND: "Fargo", OH: "Columbus",
  OK: "Oklahoma City", OR: "Portland", PA: "Philadelphia", RI: "Providence", SC: "Charleston", SD: "Sioux Falls",
  TN: "Nashville", TX: "Houston", UT: "Salt Lake City", VT: "Burlington", VA: "Virginia Beach", WA: "Seattle",
  WV: "Charleston", WI: "Milwaukee", WY: "Cheyenne",
};

/** Lowest and highest state averages, for the intensity meter (Alaska and Arizona / New Mexico). */
export const SUN_RANGE = {
  min: Math.min(...usStates.map((s) => s.sunHours)),
  max: Math.max(...usStates.map((s) => s.sunHours)),
};

export type SunLevel = { label: "Excellent" | "Good" | "Fair" | "Low"; note: string };

/** Plain language band for annual peak sun hours, as commonly used for rooftop solar. */
export function sunLevel(hours: number): SunLevel {
  if (hours >= 5.5) return { label: "Excellent", note: "Among the sunniest places in the US for solar." };
  if (hours >= 4.5) return { label: "Good", note: "Solid sun for rooftop solar all year." };
  if (hours >= 3.5) return { label: "Fair", note: "Solar works well; a slightly larger system covers the same bill." };
  return { label: "Low", note: "Less sun, so more panels are needed for the same savings." };
}
