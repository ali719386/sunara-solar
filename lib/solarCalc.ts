import { currencies, findPreset, inputLimits, solarConstants, tips, type CurrencyCode, type TipKey } from "./solarConfig";

export type SolarInput = {
  bill: number;
  rate: number;
  sunHours: number;
  roofSqFt: number;
  offsetCap: number;
  costPerWatt: number;
};

export type SolarResult = {
  monthlyKwh: number;
  neededWatts: number;
  roofMaxWatts: number;
  systemWatts: number;
  panels: number;
  maxPanels: number;
  monthlyProductionKwh: number;
  monthlySavings: number;
  newBill: number;
  yearlySavings: number;
  estimatedCost: number;
  /** 0 when there are no savings to pay the system back. */
  paybackYears: number;
  co2TonsPerYear: number;
  roofLimited: boolean;
  /** 0 to 1. */
  billOffsetPercent: number;
};

/** Finite, non negative number or the fallback. */
const num = (v: unknown, fallback = 0) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Pure estimate. Inputs are clamped, so the result never holds NaN, Infinity or negatives. */
export function calculateSolar(input: Partial<SolarInput>): SolarResult {
  const { derate, panelWatts, usableRoofRatio, wattsPerSqFtOfPanel, minSystemWatts, co2TonsPerKwh } = solarConstants;
  const bill = num(input.bill);
  const rate = clamp(num(input.rate, inputLimits.rate.min), inputLimits.rate.min, inputLimits.rate.max);
  const sunHours = clamp(num(input.sunHours, inputLimits.sunHours.min), inputLimits.sunHours.min, inputLimits.sunHours.max);
  const roofSqFt = clamp(num(input.roofSqFt, inputLimits.roof.min), inputLimits.roof.min, inputLimits.roof.max);
  const offsetCap = clamp(num(input.offsetCap, solarConstants.defaultOffsetCap), 0, 1);
  const costPerWatt = num(input.costPerWatt);

  const monthlyKwh = bill / rate;
  const neededWatts = (monthlyKwh / (30 * sunHours * derate)) * 1000;
  const roofMaxWatts = roofSqFt * usableRoofRatio * wattsPerSqFtOfPanel;
  const systemWatts = Math.max(minSystemWatts, Math.round(Math.min(neededWatts, roofMaxWatts) / 100) * 100);
  const panels = Math.ceil(systemWatts / panelWatts);
  const maxPanels = Math.max(panels, Math.floor(roofMaxWatts / panelWatts));
  const monthlyProductionKwh = (systemWatts / 1000) * sunHours * 30 * derate;
  const monthlySavings = Math.max(0, Math.min(monthlyProductionKwh * rate, bill * offsetCap));
  const newBill = Math.max(0, bill - monthlySavings);
  const yearlySavings = monthlySavings * 12;
  const estimatedCost = systemWatts * costPerWatt;
  const paybackYears = yearlySavings > 0 ? estimatedCost / yearlySavings : 0;
  const co2TonsPerYear = monthlyProductionKwh * 12 * co2TonsPerKwh;
  const roofLimited = neededWatts > roofMaxWatts;
  const billOffsetPercent = bill > 0 ? monthlySavings / bill : 0;

  return {
    monthlyKwh,
    neededWatts,
    roofMaxWatts,
    systemWatts,
    panels,
    maxPanels,
    monthlyProductionKwh,
    monthlySavings,
    newBill,
    yearlySavings,
    estimatedCost,
    paybackYears,
    co2TonsPerYear,
    roofLimited,
    billOffsetPercent,
  };
}

const wholeNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** "$1,920", "Rs 40,000", "AED 800". Non finite or negative values print as 0. */
export function formatMoney(amount: number, currency: CurrencyCode) {
  return `${currencies[currency].symbol}${wholeNumber.format(num(amount))}`;
}

export const formatKw = (watts: number) => `${(num(watts) / 1000).toFixed(1)} kW`;

export type AdviceFacts = {
  location: string;
  currency: CurrencyCode;
  systemWatts: number;
  panels: number;
  newBill: number;
  yearlySavings: number;
  tip: TipKey;
};

/** Three sentence advice built from the numbers; shown when the AI route is unavailable. */
export function localAdvice(f: AdviceFacts) {
  const place = f.location.trim() || "your area";
  return [
    `A ${formatKw(f.systemWatts)} system with ${f.panels} panels suits a home like yours in ${place}.`,
    `It could bring your bill down to about ${formatMoney(f.newBill, f.currency)} a month and save around ${formatMoney(f.yearlySavings, f.currency)} a year.`,
    tips[f.tip],
  ].join(" ");
}

export type EstimateRequest = {
  location: string;
  currency: CurrencyCode;
  monthlyBill: number;
  roofSqFt: number;
  ratePerKwh?: number;
  sunHours?: number;
};

export type EstimateSummary = {
  location: string;
  currency: CurrencyCode;
  /** True when typical rates came from a location preset. */
  presetUsed: boolean;
  ratePerKwh: number;
  sunHours: number;
  systemWatts: number;
  systemKw: number;
  panels: number;
  monthlySavings: number;
  yearlySavings: number;
  newBill: number;
  paybackYears: number;
  roofLimited: boolean;
};

/**
 * One estimate from a place name, using the calculator presets (or the currency defaults when
 * the place has no preset). Shared by the chat assistant's tool and its offline estimate form.
 */
export function estimateFor(req: EstimateRequest): EstimateSummary {
  const cur = currencies[req.currency] ?? currencies.PKR;
  const preset = findPreset(req.location);
  const presetActive = !!preset && preset.currency === cur.code;
  const rate = num(req.ratePerKwh) > 0 ? num(req.ratePerKwh) : presetActive ? preset.rate : cur.defaultRate;
  const sunHours = num(req.sunHours) > 0 ? num(req.sunHours) : presetActive ? preset.sunHours : solarConstants.defaultSunHours;
  const roofSqFt = clamp(num(req.roofSqFt, inputLimits.roof.default) || inputLimits.roof.default, inputLimits.roof.min, inputLimits.roof.max);
  const r = calculateSolar({
    bill: clamp(num(req.monthlyBill), 0, cur.bill.max * 3),
    rate,
    sunHours,
    roofSqFt,
    offsetCap: presetActive ? preset.offsetCap : solarConstants.defaultOffsetCap,
    costPerWatt: presetActive ? preset.costPerWatt : cur.costPerWatt,
  });
  const round = (n: number) => Math.round(n);
  return {
    location: req.location.trim().slice(0, 60),
    currency: cur.code,
    presetUsed: presetActive,
    ratePerKwh: clamp(rate, inputLimits.rate.min, inputLimits.rate.max),
    sunHours: clamp(sunHours, inputLimits.sunHours.min, inputLimits.sunHours.max),
    systemWatts: r.systemWatts,
    systemKw: Math.round(r.systemWatts / 100) / 10,
    panels: r.panels,
    monthlySavings: round(r.monthlySavings),
    yearlySavings: round(r.yearlySavings),
    newBill: round(r.newBill),
    paybackYears: Math.round(r.paybackYears * 10) / 10,
    roofLimited: r.roofLimited,
  };
}
