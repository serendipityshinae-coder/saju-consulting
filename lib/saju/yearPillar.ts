import { EARTHLY_BRANCHES, HEAVENLY_STEMS } from "./constants";
import type { Pillar } from "./types";

export function calculateYearPillar(sajuYear: number): Pillar {
  const stemIndex = mod(sajuYear - 4, 10);
  const branchIndex = mod(sajuYear - 4, 12);
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  };
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
