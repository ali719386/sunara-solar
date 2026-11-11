import { describe, expect, it } from "vitest";
import { findUsState, LARGEST_CITY, searchUsStates, SUN_RANGE, sunLevel, usStates } from "./usStates";
import { stateSun } from "./stateSun";

describe("usStates data", () => {
  it("has all 50 states and DC, each once", () => {
    expect(usStates).toHaveLength(51);
    expect(new Set(usStates.map((s) => s.code)).size).toBe(51);
  });

  it("keeps the published EIA 2024 figures", () => {
    const ca = findUsState("California")!;
    expect(ca).toMatchObject({ code: "CA", rate: 0.3197, bill: 160.86, sunHours: 5.6 });
    expect(findUsState("Hawaii")).toMatchObject({ rate: 0.4286, bill: 212.12 });
    expect(findUsState("Texas")).toMatchObject({ rate: 0.1494, bill: 163.72, sunHours: 5.3 });
  });

  it("has sane values for every state", () => {
    for (const s of usStates) {
      expect(s.rate).toBeGreaterThan(0.05);
      expect(s.rate).toBeLessThan(0.6);
      expect(s.bill).toBeGreaterThan(50);
      expect(s.sunHours).toBeGreaterThanOrEqual(1);
      expect(s.sunHours).toBeLessThanOrEqual(8);
    }
  });
});

describe("findUsState", () => {
  it("matches names, codes and comma separated places", () => {
    expect(findUsState("texas")?.code).toBe("TX");
    expect(findUsState("NY")?.code).toBe("NY");
    expect(findUsState("Austin, Texas")?.code).toBe("TX");
    expect(findUsState("Ohio, United States")?.code).toBe("OH");
    expect(findUsState("Washington DC")?.code).toBe("DC");
  });

  it("returns undefined for places outside the US", () => {
    expect(findUsState("Lahore")).toBeUndefined();
    expect(findUsState("London")).toBeUndefined();
    expect(findUsState("")).toBeUndefined();
  });
});

describe("searchUsStates", () => {
  it("lists every state for an empty query or for usa", () => {
    expect(searchUsStates("")).toHaveLength(51);
    expect(searchUsStates("usa")).toHaveLength(51);
  });

  it("filters by the start of the name, then by any word", () => {
    expect(searchUsStates("new").map((s) => s.code)).toEqual(["NH", "NJ", "NM", "NY"]);
    expect(searchUsStates("car").map((s) => s.code)).toEqual(["NC", "SC"]);
    expect(searchUsStates("zzz")).toEqual([]);
  });
});

describe("sun intensity helpers", () => {
  it("has a largest city for every state", () => {
    for (const s of usStates) expect(LARGEST_CITY[s.code], s.name).toBeTruthy();
  });

  it("spans the least and most sunny states", () => {
    expect(SUN_RANGE).toEqual({ min: 3.0, max: 6.5 });
  });

  it("bands sun hours into plain levels", () => {
    expect(sunLevel(6.5).label).toBe("Excellent");
    expect(sunLevel(5.5).label).toBe("Excellent");
    expect(sunLevel(5.3).label).toBe("Good");
    expect(sunLevel(4.0).label).toBe("Fair");
    expect(sunLevel(3.0).label).toBe("Low");
  });
});

describe("bundled monthly sun data", () => {
  it("has 12 sane months for every state, measured in its largest city", () => {
    for (const s of usStates) {
      const d = stateSun[s.code];
      expect(d, s.name).toBeTruthy();
      expect(d.city).toBe(LARGEST_CITY[s.code]);
      expect(d.monthly).toHaveLength(12);
      for (const v of d.monthly) {
        expect(v).toBeGreaterThan(0);
        expect(v).toBeLessThan(10);
      }
    }
  });
});
