import { HIDDEN_STEMS } from "./constants";
import type { Pillar } from "./types";

export function calculateHiddenStems(pillars: {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
}): Record<string, string[]> {
  const result: Record<string, string[]> = {
    year: [...HIDDEN_STEMS[pillars.year.branch]],
    month: [...HIDDEN_STEMS[pillars.month.branch]],
    day: [...HIDDEN_STEMS[pillars.day.branch]],
  };
  if (pillars.hour) {
    result.hour = [...HIDDEN_STEMS[pillars.hour.branch]];
  }
  return result;
}
