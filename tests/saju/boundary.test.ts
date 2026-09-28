import { describe, expect, it } from "vitest";
import { calculateSaju } from "@/lib/saju/calculator";
import { getEightCharFromSolar } from "@/lib/saju/lunarBridge";
import { getJieQiTableForYear } from "@/lib/saju/lunarBridge";

describe("boundary cases", () => {
  it("changes year pillar across ipchun", () => {
    const table = getJieQiTableForYear(2026);
    const ipchun = table["立春"];
    const before = calculateSaju({
      calendarType: "solar",
      year: ipchun.year,
      month: ipchun.month,
      day: ipchun.day,
      birthTimeKnown: true,
      hour: Math.max(0, ipchun.hour - 1),
      minute: ipchun.minute,
      gender: "male",
      birthCountry: "KR",
    });
    const after = calculateSaju({
      calendarType: "solar",
      year: ipchun.year,
      month: ipchun.month,
      day: ipchun.day,
      birthTimeKnown: true,
      hour: ipchun.hour,
      minute: Math.min(59, ipchun.minute + 1),
      gender: "male",
      birthCountry: "KR",
    });
    expect(before.pillars.year).not.toEqual(after.pillars.year);
  });

  it("hour branch at 23:00 matches lunar-javascript", () => {
    const result = calculateSaju({
      calendarType: "solar",
      year: 1984,
      month: 4,
      day: 15,
      birthTimeKnown: true,
      hour: 23,
      minute: 30,
      gender: "male",
      birthCountry: "KR",
    });
    const ec = getEightCharFromSolar(1984, 4, 15, 23, 30);
    expect(result.pillars.hour?.stem).toBe(ec.getTime()[0]);
    expect(result.pillars.hour?.branch).toBe(ec.getTime()[1]);
  });
});
