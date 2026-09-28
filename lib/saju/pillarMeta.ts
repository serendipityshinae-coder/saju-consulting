import { BRANCH_ELEMENT, STEM_ELEMENT } from "./constants";

export const STEM_READING: Record<string, string> = {
  甲: "갑",
  乙: "을",
  丙: "병",
  丁: "정",
  戊: "무",
  己: "기",
  庚: "경",
  辛: "신",
  壬: "임",
  癸: "계",
};

export const BRANCH_READING: Record<string, string> = {
  子: "자",
  丑: "축",
  寅: "인",
  卯: "묘",
  辰: "진",
  巳: "사",
  午: "오",
  未: "미",
  申: "신",
  酉: "유",
  戌: "술",
  亥: "해",
};

export const ELEMENT_KO: Record<string, string> = {
  wood: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)",
};

export const PILLAR_ROLE: Record<string, { title: string; hint: string }> = {
  year: {
    title: "년주 · 뿌리",
    hint: "가문·유년기·사회적 배경과 연결되는 기운입니다.",
  },
  month: {
    title: "월주 · 환경",
    hint: "성장 환경·직장·사회생활에서 드러나는 패턴과 연결됩니다.",
  },
  day: {
    title: "일주 · 본인",
    hint: "나 자신의 중심(일간)과 배우자궁(일지)을 담습니다.",
  },
  hour: {
    title: "시주 · 미래",
    hint: "말년·자녀·내면의 목소리·실행 방식과 연결됩니다.",
  },
};

export function formatPillar(stem: string, branch: string): string {
  return `${STEM_READING[stem] ?? ""}${BRANCH_READING[branch] ?? ""} (${stem}${branch})`;
}

export function stemElementKo(stem: string): string {
  return ELEMENT_KO[STEM_ELEMENT[stem]] ?? "";
}

export function branchElementKo(branch: string): string {
  return ELEMENT_KO[BRANCH_ELEMENT[branch]] ?? "";
}

export const TEN_GOD_KO: Record<string, string> = {
  比肩: "비견",
  劫财: "겁재",
  食神: "식신",
  伤官: "상관",
  偏财: "편재",
  正财: "정재",
  七杀: "편관",
  正官: "정관",
  偏印: "편인",
  正印: "정인",
  日主: "일주",
};
