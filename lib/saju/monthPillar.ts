import {
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  JIE_QI_TO_MONTH_BRANCH,
  MONTH_STEM_START,
} from "./constants";
import type { Pillar } from "./types";

export function calculateMonthPillar(yearStem: string, monthBranchIndex: number): Pillar {
  const branch = JIE_QI_TO_MONTH_BRANCH[monthBranchIndex];
  const branchIndex = EARTHLY_BRANCHES.indexOf(branch as (typeof EARTHLY_BRANCHES)[number]);

  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearStem as (typeof HEAVENLY_STEMS)[number]);
  const yinMonthStemStart = MONTH_STEM_START[yearStemIndex];
  const stemOffset = mod(branchIndex - 2, 12);
  const stemIndex = mod(yinMonthStemStart + stemOffset, 10);

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch,
  };
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
