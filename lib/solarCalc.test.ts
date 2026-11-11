import { describe, expect, it } from "vitest";
import { calculateSolar, type SolarResult } from "./solarCalc";

const allFinite = (r: SolarResult) =>
  Object.values(r).every((v) => typeof v === "boolean" || (Number.isFinite(v) && v >= 0));

describe("calculateSolar", () => {
  it("sizes a normal California home", () => {
    // 200 / 0.32 = 625 kWh; 625 / (30 * 5.5 * 0.8) * 1000 = 4,735 W, rounds to 4,700 W.
    const r = calculateSolar({ bill: 200, rate: 0.32, sunHours: 5.5, roofSqFt: 1500, offsetCap: 0.8, costPerWatt: 3 });
    expect(r.monthlyKwh).toBeCloseTo(625);
    expect(r.systemWatts).toBe(4700);
    expect(r.panels).toBe(12);
    expect(r.roofLimited).toBe(false);
    expect(r.maxPanels).toBe(42); // 1500 * 0.6 * 19 = 17,100 W / 400
    // Production 620.4 kWh * 0.32 = 198.5, capped at 80% of the bill = 160.
    expect(r.monthlySavings).toBeCloseTo(160);
    expect(r.newBill).toBeCloseTo(40);
    expect(r.yearlySavings).toBeCloseTo(1920);
    expect(r.estimatedCost).toBe(14100);
    expect(r.paybackYears).toBeCloseTo(14100 / 1920);
    expect(r.billOffsetPercent).toBeCloseTo(0.8);
    expect(allFinite(r)).toBe(true);
  });

  it("limits the system to what fits on a small roof", () => {
    const r = calculateSolar({ bill: 800, rate: 0.15, sunHours: 3, roofSqFt: 300, offsetCap: 0.9, costPerWatt: 2.6 });
    // Roof max: 300 * 0.6 * 19 = 3,420 W, rounds to 3,400 W.
    expect(r.roofLimited).toBe(true);
    expect(r.systemWatts).toBe(3400);
    expect(r.panels).toBe(9);
    expect(r.maxPanels).toBe(9);
    expect(r.monthlySavings).toBeLessThan(800 * 0.9);
    expect(allFinite(r)).toBe(true);
  });

  it("never returns NaN or negatives for zero or empty input", () => {
    for (const input of [{}, { bill: 0, rate: 0, sunHours: 0, roofSqFt: 0 }, { bill: NaN, rate: -5, sunHours: Infinity }]) {
      const r = calculateSolar(input);
      expect(allFinite(r)).toBe(true);
      expect(r.monthlySavings).toBe(0);
      expect(r.paybackYears).toBe(0);
      expect(r.systemWatts).toBe(400);
      expect(r.panels).toBe(1);
    }
  });
});
