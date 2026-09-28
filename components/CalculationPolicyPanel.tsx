import type { SajuData } from "@/lib/saju/types";

export function CalculationPolicyPanel({ data }: { data: SajuData }) {
  const policy = data.calculationPolicy;
  return (
    <details className="card" style={{ marginTop: 16 }}>
      <summary style={{ cursor: "pointer", fontWeight: 500 }}>계산 기준 보기</summary>
      <ul style={{ margin: "16px 0 0", paddingLeft: 20, color: "var(--text-secondary)", fontSize: 14 }}>
        <li>연주: 입춘 절입 기준 ({policy.yearBoundary})</li>
        <li>월주: 12절 절입 시각 기준</li>
        <li>일주 날짜 변경: 자정(00:00) 기준</li>
        <li>시주: 2시간 단위 시진 (23시 이후 시두는 익일 일간 기준)</li>
        <li>시간: 출생 당시 현지 표준시 ({policy.timeCorrection})</li>
        <li>진태양시 보정: 사용하지 않음</li>
        <li>엔진 버전: {data.metadata.engineVersion}</li>
        <li>
          완성도: {data.metadata.calculationCompleteness === "FULL" ? "전체" : "시주 제외(부분)"}
        </li>
      </ul>
    </details>
  );
}
