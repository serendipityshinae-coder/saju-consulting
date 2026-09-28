import type { ConsultationType, CounselorPersonality } from "@/lib/session/types";

export const CONSULTATION_META: Record<
  ConsultationType,
  { title: string; subtitle: string; description: string }
> = {
  basic: {
    title: "내 사주",
    subtitle: "나는 어떤 사람일까?",
    description: "내 성향과 삶의 패턴을 사주로 깊게 살펴봅니다.",
  },
  love: {
    title: "연애 상담",
    subtitle: "나는 사랑에서 어떤 사람일까?",
    description: "사랑과 관계에서 반복되는 나의 패턴을 살펴봅니다.",
  },
  career: {
    title: "성공운",
    subtitle: "나는 어떻게 성공하는 사람일까?",
    description: "일, 돈, 커리어에서 나의 강점을 살펴봅니다.",
  },
};

export const COUNSELOR_META: Record<
  CounselorPersonality,
  { title: string; tagline: string; tags: string[]; description: string; symbol: string }
> = {
  analyst: {
    title: "냉철한 명리 분석가",
    tagline: "듣고 싶은 말보다 필요한 말을 합니다.",
    tags: ["분석", "논리", "직설적"],
    description: "사주 구조를 중심으로 장점과 한계를 명확하게 분석합니다.",
    symbol: "ANALYST",
  },
  counselor: {
    title: "공감형 명리 상담가",
    tagline: "운명을 판단하기보다 당신의 이야기를 듣습니다.",
    tags: ["공감", "대화", "따뜻함"],
    description: "당신의 고민을 먼저 듣고 사주를 통해 상황을 함께 이해합니다.",
    symbol: "COUNSELOR",
  },
};

export const SUGGESTED_QUESTIONS: Record<ConsultationType, string[]> = {
  basic: [
    "나는 어떤 사람인가요?",
    "내가 가진 가장 큰 장점은 무엇인가요?",
    "내가 반복해서 겪기 쉬운 문제는 무엇인가요?",
    "어떤 환경에서 능력을 잘 발휘하나요?",
  ],
  love: [
    "저는 어떤 사람에게 끌리는 편인가요?",
    "연애에서 반복되는 패턴이 있나요?",
    "저는 관계에서 어떤 것을 중요하게 생각하나요?",
    "지금 만나고 있는 사람과의 관계를 상담하고 싶어요.",
  ],
  career: [
    "저는 조직생활과 사업 중 어느 쪽이 더 잘 맞나요?",
    "저는 어떤 방식으로 돈을 벌 때 강점이 있나요?",
    "제 커리어에서 가장 중요한 장점은 무엇인가요?",
    "새로운 일을 시작하기 좋은 흐름인가요?",
  ],
};
