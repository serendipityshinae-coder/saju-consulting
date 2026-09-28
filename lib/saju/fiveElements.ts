import { BRANCH_ELEMENT, STEM_ELEMENT } from "./constants";
import type { Pillar } from "./types";

export function calculateFiveElements(pillars: {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
}) {
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  const add = (element: keyof typeof counts) => {
    counts[element] += 1;
  };

  for (const pillar of [pillars.year, pillars.month, pillars.day, pillars.hour]) {
    if (!pillar) continue;
    add(STEM_ELEMENT[pillar.stem]);
    add(BRANCH_ELEMENT[pillar.branch]);
  }

  return counts;
}
