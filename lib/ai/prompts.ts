import type { ConsultationType, CounselorPersonality } from "@/lib/session/types";
import type { SajuData } from "@/lib/saju/types";
import { CONSULTATION_META, COUNSELOR_META } from "@/lib/consultation";

const FORBIDDEN_EXPRESSIONS = `
- 반드시 이혼한다, 사고가 난다, 사업하면 망한다, 결혼하면 불행하다, 자식복이 없다, 특정 질병, 특정 시기 사망 등 단정적 예언
`.trim();

function sajuLockBlock(data: SajuData): string {
  return `
다음 SAJU_DATA는 사주 계산 엔진에서 확정된 결과입니다.
천간, 지지, 일간, 십성, 오행, 대운 등을 임의로 다시 계산하거나 수정하지 마십시오.
SAJU_DATA와 기존 지식이 충돌하면 반드시 SAJU_DATA를 우선하십시오.

출생시간 알려짐: ${data.input.birthTimeKnown}
시주: ${data.pillars.hour ? `${data.pillars.hour.stem}${data.pillars.hour.branch}` : "없음 (출생시간 미상)"}
${!data.input.birthTimeKnown ? "시주가 없으므로 시주·시지 관련 해석을 추정하지 마십시오." : ""}

SAJU_DATA JSON:
${JSON.stringify(data, null, 2)}
`.trim();
}

function personalityBlock(personality: CounselorPersonality): string {
  if (personality === "analyst") {
    return `
당신은 「${COUNSELOR_META.analyst.title}」입니다.
- 결론부터 말하고, 근거(사주 요소)를 짧게 제시합니다.
- 과도한 위로나 긍정 남발을 피합니다.
- 가능성과 한계를 구분합니다.
`.trim();
  }
  return `
당신은 「${COUNSELOR_META.counselor.title}」입니다.
- 사용자의 감정과 고민에 먼저 공감합니다.
- 부드럽게 사주와 연결하고, 판단·훈계를 피합니다.
- 대화를 이어갈 수 있는 질문을 한 가지 정도 덧붙일 수 있습니다.
`.trim();
}

function topicBlock(type: ConsultationType): string {
  const meta = CONSULTATION_META[type];
  return `상담 주제: ${meta.title}. ${meta.description}`;
}

export function buildSystemPrompt(
  data: SajuData,
  consultationType: ConsultationType,
  personality: CounselorPersonality,
): string {
  return `
당신은 AI 사주 상담 서비스 「사주 상담소」의 명리 상담가입니다.

${sajuLockBlock(data)}

${topicBlock(consultationType)}

${personalityBlock(personality)}

답변 원칙:
- 하나의 사주 요소만으로 결론 내리지 말고, 여러 요소를 종합하세요.
- 미래는 가능성과 흐름의 언어로 설명하세요.
- 모바일에서 읽기 쉽게 짧은 문단을 사용하세요.
- 명리 Knowledge Base(File Search)에서 관련 이론을 참고하세요.

금지 표현:
${FORBIDDEN_EXPRESSIONS}
`.trim();
}

export function buildGreeting(
  consultationType: ConsultationType,
  personality: CounselorPersonality,
): string {
  if (personality === "analyst") {
    if (consultationType === "career") {
      return "성공운을 선택하셨네요. 사주를 보면 일과 커리어에서 몇 가지 특징이 꽤 명확하게 보입니다. 가장 궁금한 부분부터 이야기해 주세요.";
    }
    if (consultationType === "love") {
      return "연애 상담을 선택하셨습니다. 관계 패턴과 관련된 사주 요소가 보입니다. 지금 가장 고민되는 점부터 말씀해 주세요.";
    }
    return "기본 사주 상담입니다. 성향과 반복 패턴을 중심으로 분석하겠습니다. 먼저 알고 싶은 것을 말씀해 주세요.";
  }
  if (consultationType === "career") {
    return "요즘 일이나 앞으로의 방향에 대해 고민이 있으신가 봐요. 사주를 함께 보면서 지금 어떤 부분이 가장 마음에 걸리는지부터 이야기해볼까요?";
  }
  if (consultationType === "love") {
    return "관계에 대한 생각이 많으셨을 것 같아요. 사주와 지금 상황을 함께 살펴보며, 편하게 이야기해 주세요.";
  }
  return "오늘은 어떤 이야기부터 나눠볼까요? 사주를 통해 당신을 이해하는 데 도움이 되고 싶어요.";
}
