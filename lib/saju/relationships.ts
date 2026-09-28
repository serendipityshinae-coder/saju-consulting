import type { Pillar } from "./types";

const BRANCH_CLASH: Record<string, string> = {
  子: "午",
  午: "子",
  丑: "未",
  未: "丑",
  寅: "申",
  申: "寅",
  卯: "酉",
  酉: "卯",
  辰: "戌",
  戌: "辰",
  巳: "亥",
  亥: "巳",
};

const BRANCH_COMBINE: Record<string, string> = {
  子: "丑",
  丑: "子",
  寅: "亥",
  亥: "寅",
  卯: "戌",
  戌: "卯",
  辰: "酉",
  酉: "辰",
  巳: "申",
  申: "巳",
  午: "未",
  未: "午",
};

const BRANCH_HARM: Record<string, string> = {
  子: "未",
  未: "子",
  丑: "午",
  午: "丑",
  寅: "巳",
  巳: "寅",
  卯: "辰",
  辰: "卯",
  申: "亥",
  亥: "申",
  酉: "戌",
  戌: "酉",
};

const BRANCH_BREAK: Record<string, string> = {
  子: "酉",
  酉: "子",
  丑: "辰",
  辰: "丑",
  寅: "亥",
  亥: "寅",
  卯: "午",
  午: "卯",
  巳: "申",
  申: "巳",
  未: "戌",
  戌: "未",
};

const PUNISH_GROUPS = [
  ["寅", "巳", "申"],
  ["丑", "戌", "未"],
  ["子", "卯"],
  ["辰", "辰"],
  ["午", "午"],
  ["酉", "酉"],
  ["亥", "亥"],
];

function collectBranches(pillars: {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
}): string[] {
  const list = [pillars.year.branch, pillars.month.branch, pillars.day.branch];
  if (pillars.hour) list.push(pillars.hour.branch);
  return list;
}

export function calculateRelationships(pillars: {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
}) {
  const branches = collectBranches(pillars);
  const clashes: string[] = [];
  const branchCombinations: string[] = [];
  const harms: string[] = [];
  const breaks: string[] = [];
  const punishments: string[] = [];

  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const a = branches[i];
      const b = branches[j];
      if (BRANCH_CLASH[a] === b) clashes.push(`${a}${b}冲`);
      if (BRANCH_COMBINE[a] === b) branchCombinations.push(`${a}${b}合`);
      if (BRANCH_HARM[a] === b) harms.push(`${a}${b}害`);
      if (BRANCH_BREAK[a] === b) breaks.push(`${a}${b}破`);
    }
  }

  for (const group of PUNISH_GROUPS) {
    const hits = branches.filter((b) => group.includes(b));
    if (group.length === 3 && new Set(hits).size >= 2) {
      punishments.push(`${hits.join("")}刑`);
    }
    if (group.length === 2 && hits.length >= 2) {
      punishments.push(`${group.join("")}刑`);
    }
  }

  const stemCombinations: string[] = [];
  const stems = [pillars.year.stem, pillars.month.stem, pillars.day.stem];
  if (pillars.hour) stems.push(pillars.hour.stem);
  const stemPairs: Record<string, string> = {
    甲: "己",
    己: "甲",
    乙: "庚",
    庚: "乙",
    丙: "辛",
    辛: "丙",
    丁: "壬",
    壬: "丁",
    戊: "癸",
    癸: "戊",
  };
  for (let i = 0; i < stems.length; i++) {
    for (let j = i + 1; j < stems.length; j++) {
      if (stemPairs[stems[i]] === stems[j]) {
        stemCombinations.push(`${stems[i]}${stems[j]}合`);
      }
    }
  }

  return {
    stemCombinations,
    branchCombinations,
    clashes,
    punishments: [...new Set(punishments)],
    harms,
    breaks,
  };
}
