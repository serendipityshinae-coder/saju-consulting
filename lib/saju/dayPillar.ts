import { DAY_PILLAR_ANCHOR, EARTHLY_BRANCHES, HEAVENLY_STEMS } from "./constants";
import { gregorianToJdn, parseDateParts } from "./jdn";
import type { Pillar } from "./types";

export function calculateDayPillar(
  year: number,
  month: number,
  day: number,
): { pillar: Pillar; dayPillarIndex: number } {
  const targetJdn = gregorianToJdn(year, month, day);
  const anchor = parseDateParts(DAY_PILLAR_ANCHOR.date);
  const anchorJdn = gregorianToJdn(anchor.year, anchor.month, anchor.day);

  const index = mod(targetJdn - anchorJdn + DAY_PILLAR_ANCHOR.index, 60);
  const stemIndex = index % 10;
  const branchIndex = index % 12;

  return {
    pillar: {
      stem: HEAVENLY_STEMS[stemIndex],
      branch: EARTHLY_BRANCHES[branchIndex],
    },
    dayPillarIndex: index,
  };
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
