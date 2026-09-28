import { describe, expect, it } from "vitest";
import { calculateSaju } from "@/lib/saju/calculator";
import { getEightCharFromSolar } from "@/lib/saju/lunarBridge";

function expectedFromLunar(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
) {
  const ec = getEightCharFromSolar(year, month, day, hour, minute);
  return {
    year: { stem: ec.getYear()[0], branch: ec.getYear()[1] },
    month: { stem: ec.getMonth()[0], branch: ec.getMonth()[1] },
    day: { stem: ec.getDay()[0], branch: ec.getDay()[1] },
    hour: { stem: ec.getTime()[0], branch: ec.getTime()[1] },
  };
}

describe("calculateSaju vs lunar-javascript", () => {
  it("matches reference 1984-04-15 14:30", () => {
    const input = {
      calendarType: "solar" as const,
      year: 1984,
      month: 4,
      day: 15,
      birthTimeKnown: true,
      hour: 14,
      minute: 30,
      gender: "female" as const,
      birthCountry: "KR",
    };
    const result = calculateSaju(input);
    const expected = expectedFromLunar(1984, 4, 15, 14, 30);
    expect(result.pillars.year).toEqual({
      stem: expected.year.stem,
      branch: expected.year.branch,
    });
    expect(result.pillars.month).toEqual({
      stem: expected.month.stem,
      branch: expected.month.branch,
    });
    expect(result.pillars.day).toEqual({
      stem: expected.day.stem,
      branch: expected.day.branch,
    });
    expect(result.pillars.hour).toEqual({
      stem: expected.hour.stem,
      branch: expected.hour.branch,
    });
  });

  it("returns partial when birth time unknown", () => {
    const result = calculateSaju({
      calendarType: "solar",
      year: 1984,
      month: 4,
      day: 15,
      birthTimeKnown: false,
      gender: "female",
      birthCountry: "KR",
    });
    expect(result.pillars.hour).toBeNull();
    expect(result.metadata.calculationCompleteness).toBe("PARTIAL");
  });
});
