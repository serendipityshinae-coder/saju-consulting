import KoreanLunarCalendar from "korean-lunar-calendar";
import type { BirthInput } from "./types";

export interface NormalizedSolarDate {
  year: number;
  month: number;
  day: number;
  originalCalendar: "solar" | "lunar";
}

export function normalizeToSolar(input: BirthInput): NormalizedSolarDate {
  if (input.calendarType === "solar") {
    return {
      year: input.year,
      month: input.month,
      day: input.day,
      originalCalendar: "solar",
    };
  }

  const calendar = new KoreanLunarCalendar();
  const ok = calendar.setLunarDate(
    input.year,
    input.month,
    input.day,
    input.isLeapMonth ?? false,
  );

  if (!ok) {
    throw new Error("유효하지 않은 음력 날짜입니다.");
  }

  const solar = calendar.getSolarCalendar();
  return {
    year: solar.year,
    month: solar.month,
    day: solar.day,
    originalCalendar: "lunar",
  };
}

export function formatIsoDate(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}
