import { describe, expect, it } from "vitest";
import reference from "../reference-saju.json";
import { calculateSaju } from "@/lib/saju/calculator";

describe("reference-saju.json", () => {
  for (const item of reference) {
    it(item.description, () => {
      const [y, m, d] = item.birthDate.split("-").map(Number);
      const [hour, minute] = item.birthTime.split(":").map(Number);
      const result = calculateSaju({
        calendarType: "solar",
        year: y,
        month: m,
        day: d,
        birthTimeKnown: true,
        hour,
        minute,
        gender: item.gender as "male" | "female",
        birthCountry: "KR",
        timezone: item.timezone,
      });

      const fmt = (stem: string, branch: string) => `${stem}${branch}`;
      expect(fmt(result.pillars.year.stem, result.pillars.year.branch)).toBe(
        item.expected.year,
      );
      expect(fmt(result.pillars.month.stem, result.pillars.month.branch)).toBe(
        item.expected.month,
      );
      expect(fmt(result.pillars.day.stem, result.pillars.day.branch)).toBe(item.expected.day);
      expect(fmt(result.pillars.hour!.stem, result.pillars.hour!.branch)).toBe(
        item.expected.hour,
      );
    });
  }
});
