import { describe, expect, it } from "vitest";
import { normalizeToSolar } from "@/lib/saju/calendar";

describe("lunar conversion", () => {
  it("converts lunar date to solar", () => {
    const solar = normalizeToSolar({
      calendarType: "lunar",
      year: 1990,
      month: 5,
      day: 10,
      isLeapMonth: false,
      birthTimeKnown: false,
      gender: "female",
      birthCountry: "KR",
    });
    expect(solar.year).toBeGreaterThan(1989);
    expect(solar.month).toBeGreaterThan(0);
    expect(solar.day).toBeGreaterThan(0);
  });
});
