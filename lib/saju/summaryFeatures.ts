import { stemElementKo } from "./pillarMeta";
import type { SajuData } from "./types";

const elementLabel: Record<string, string> = {
  wood: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)",
};

const TEN_GOD_HINT: Record<string, string> = {
  比肩: "주체성·동료·자립의 기운이 강조될 수 있습니다.",
  劫财: "경쟁·분배·속도감 있는 결정 패턴이 나타날 수 있습니다.",
  食神: "표현·창의·여유로운 성취 방식과 연결됩니다.",
  伤官: "예민한 감각·비판·개혁적 표현 경향이 있을 수 있습니다.",
  偏财: "기회·유동적 수입·대인 관계를 통한 확장과 연결됩니다.",
  正财: "안정·책임·꾸준한 관리 방식과 잘 맞는 편입니다.",
  七杀: "압박·경쟁 속에서 추진력을 발휘하는 면이 있습니다.",
  正官: "규칙·책임·조직·신뢰를 중시하는 패턴이 드러날 수 있습니다.",
  偏印: "독특한 학습·직관·혼자만의 시간이 필요할 수 있습니다.",
  正印: "배움·보호·안정적 지원을 통해 성장하는 타입입니다.",
};

export function buildSummaryFeatures(data: SajuData): string[] {
  const features: string[] = [];
  const elements = data.fiveElements;
  const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  const [topKey, topVal] = sorted[0];
  const [secondKey, secondVal] = sorted[1];
  const [lowKey, lowVal] = sorted[sorted.length - 1];

  features.push(
    `일간 ${data.dayMaster}(${stemElementKo(data.dayMaster)})을 중심으로 사주가 구성되어 있습니다. ` +
      `성향·관계·일의 방식은 모두 이 일간과의 관계(십성)로 읽습니다.`,
  );

  if (topVal >= 3) {
    features.push(
      `${elementLabel[topKey]} 기운이 ${topVal}회로 가장 많이 등장합니다. ` +
        `다만 ‘많다’가 곧 ‘강하다’는 뜻은 아니며, 삶에서 해당 테마가 자주 거론되는 편일 수 있습니다.`,
    );
  } else if (topVal === secondVal) {
    features.push(
      `${elementLabel[topKey]}와 ${elementLabel[secondKey]}가 고르게 나타납니다. ` +
        `상황에 따라 기질을 바꿔 가며 균형을 맞추는 편일 수 있습니다.`,
    );
  } else {
    features.push(
      "오행이 한쪽으로 극단적으로 치우치지 않아, 상황에 따라 다른 기운을 꺼내 쓰는 유연함이 있습니다.",
    );
  }

  const monthGod = data.tenGods.monthStem;
  if (TEN_GOD_HINT[monthGod]) {
    features.push(`월간(사회·직장) 십성은 ${monthGod}입니다. ${TEN_GOD_HINT[monthGod]}`);
  }

  if (data.pillars.hour && data.tenGods.hourStem && TEN_GOD_HINT[data.tenGods.hourStem]) {
    features.push(`시간(시주) 십성은 ${data.tenGods.hourStem}입니다. ${TEN_GOD_HINT[data.tenGods.hourStem]}`);
  } else if (!data.input.birthTimeKnown) {
    features.push(
      "출생시간이 없어 시주·시간대 십성은 제외되었습니다. 말년·실행 방식 해석은 상담에서 일주·월주 중심으로 진행하는 것이 좋습니다.",
    );
  }

  if (lowVal <= 1 && topKey !== lowKey) {
    features.push(
      `${elementLabel[lowKey]} 기운은 상대적으로 적게 나타납니다. ` +
        `의식적으로 해당 영역(예: 휴식, 표현, 정리 등)을 챙기면 균형에 도움이 됩니다.`,
    );
  }

  const relCount =
    data.relationships.clashes.length +
    data.relationships.branchCombinations.length +
    data.relationships.stemCombinations.length;
  if (relCount > 0) {
    features.push(
      `원국에 합·충 등 관계가 ${relCount}건 있습니다. ` +
        `내면·관계에서 특정 주제가 반복되거나, 변화의 계기가 되는 지점으로 읽을 수 있습니다.`,
    );
  }

  return features.slice(0, 6);
}
