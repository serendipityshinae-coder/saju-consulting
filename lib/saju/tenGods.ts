import { HEAVENLY_STEMS, HIDDEN_STEMS } from "./constants";
import type { Pillar } from "./types";

const TEN_GOD_NAMES = [
  "比肩",
  "劫财",
  "食神",
  "伤官",
  "偏财",
  "正财",
  "七杀",
  "正官",
  "偏印",
  "正印",
] as const;

const ELEMENT_ORDER = ["wood", "fire", "earth", "metal", "water"] as const;

const STEM_TO_ELEMENT: Record<string, (typeof ELEMENT_ORDER)[number]> = {
  甲: "wood",
  乙: "wood",
  丙: "fire",
  丁: "fire",
  戊: "earth",
  己: "earth",
  庚: "metal",
  辛: "metal",
  壬: "water",
  癸: "water",
};

function isYang(stem: string): boolean {
  return HEAVENLY_STEMS.indexOf(stem as (typeof HEAVENLY_STEMS)[number]) % 2 === 0;
}

function elementGenerates(from: string, to: string): boolean {
  const fi = ELEMENT_ORDER.indexOf(STEM_TO_ELEMENT[from]);
  const ti = ELEMENT_ORDER.indexOf(STEM_TO_ELEMENT[to]);
  return (fi + 1) % 5 === ti;
}

function elementControls(from: string, to: string): boolean {
  const fi = ELEMENT_ORDER.indexOf(STEM_TO_ELEMENT[from]);
  const ti = ELEMENT_ORDER.indexOf(STEM_TO_ELEMENT[to]);
  return (fi + 2) % 5 === ti;
}

export function getTenGod(dayMaster: string, targetStem: string): string {
  if (dayMaster === targetStem) {
    return isYang(dayMaster) === isYang(targetStem) ? TEN_GOD_NAMES[0] : TEN_GOD_NAMES[1];
  }

  const sameElement = STEM_TO_ELEMENT[dayMaster] === STEM_TO_ELEMENT[targetStem];
  if (sameElement) {
    return isYang(dayMaster) === isYang(targetStem) ? TEN_GOD_NAMES[0] : TEN_GOD_NAMES[1];
  }
  if (elementGenerates(dayMaster, targetStem)) {
    return isYang(dayMaster) === isYang(targetStem) ? TEN_GOD_NAMES[2] : TEN_GOD_NAMES[3];
  }
  if (elementGenerates(targetStem, dayMaster)) {
    return isYang(dayMaster) === isYang(targetStem) ? TEN_GOD_NAMES[8] : TEN_GOD_NAMES[9];
  }
  if (elementControls(dayMaster, targetStem)) {
    return isYang(dayMaster) === isYang(targetStem) ? TEN_GOD_NAMES[6] : TEN_GOD_NAMES[7];
  }
  if (elementControls(targetStem, dayMaster)) {
    return isYang(dayMaster) === isYang(targetStem) ? TEN_GOD_NAMES[4] : TEN_GOD_NAMES[5];
  }
  return TEN_GOD_NAMES[0];
}

export function calculateTenGods(
  dayMaster: string,
  pillars: { year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null },
) {
  const branches: Record<string, string[]> = {
    year: HIDDEN_STEMS[pillars.year.branch].map((s) => getTenGod(dayMaster, s)),
    month: HIDDEN_STEMS[pillars.month.branch].map((s) => getTenGod(dayMaster, s)),
    day: HIDDEN_STEMS[pillars.day.branch].map((s) => getTenGod(dayMaster, s)),
  };

  const result: {
    yearStem: string;
    monthStem: string;
    dayStem: string;
    hourStem?: string;
    branches: Record<string, string[]>;
  } = {
    yearStem: getTenGod(dayMaster, pillars.year.stem),
    monthStem: getTenGod(dayMaster, pillars.month.stem),
    dayStem: "日主",
    branches,
  };

  if (pillars.hour) {
    result.hourStem = getTenGod(dayMaster, pillars.hour.stem);
    branches.hour = HIDDEN_STEMS[pillars.hour.branch].map((s) => getTenGod(dayMaster, s));
  }

  return result;
}
