import { EARTHLY_BRANCHES, HEAVENLY_STEMS, HOUR_STEM_START } from "./constants";
import type { Pillar } from "./types";

export function getHourBranchIndex(hour: number): number {
  return Math.floor(((hour + 1) % 24) / 2) % 12;
}

export function calculateHourPillar(dayStem: string, hour: number): Pillar {
  const branchIndex = getHourBranchIndex(hour);
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem as (typeof HEAVENLY_STEMS)[number]);
  const ziStemStart = HOUR_STEM_START[dayStemIndex];
  const stemIndex = mod(ziStemStart + branchIndex, 10);

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  };
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
