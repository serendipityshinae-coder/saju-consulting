export const HEAVENLY_STEMS = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
] as const;

export const EARTHLY_BRANCHES = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
] as const;

export const STEM_ELEMENT: Record<string, "wood" | "fire" | "earth" | "metal" | "water"> = {
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

export const BRANCH_ELEMENT: Record<string, "wood" | "fire" | "earth" | "metal" | "water"> = {
  子: "water",
  丑: "earth",
  寅: "wood",
  卯: "wood",
  辰: "earth",
  巳: "fire",
  午: "fire",
  未: "earth",
  申: "metal",
  酉: "metal",
  戌: "earth",
  亥: "water",
};

export const HIDDEN_STEMS: Record<string, string[]> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "戊", "庚"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

/** 12절(節) — 월주 경계 */
export const JIE_QI_NAMES = [
  "小寒",
  "立春",
  "惊蛰",
  "清明",
  "立夏",
  "芒种",
  "小暑",
  "立秋",
  "白露",
  "寒露",
  "立冬",
  "大雪",
] as const;

/** 절기 구간 → 월지 */
export const JIE_QI_TO_MONTH_BRANCH = [
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
  "子",
] as const;

export const DAY_PILLAR_ANCHOR = {
  date: "1984-04-15",
  index: 15,
};

export const MONTH_STEM_START: Record<number, number> = {
  0: 2,
  1: 4,
  2: 6,
  3: 8,
  4: 0,
  5: 2,
  6: 4,
  7: 6,
  8: 8,
  9: 0,
};

export const HOUR_STEM_START: Record<number, number> = {
  0: 0,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 0,
  6: 2,
  7: 4,
  8: 6,
  9: 8,
};
