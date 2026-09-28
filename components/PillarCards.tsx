import type { SajuData } from "@/lib/saju/types";

const LABELS = [
  { key: "year" as const, label: "년주" },
  { key: "month" as const, label: "월주" },
  { key: "day" as const, label: "일주" },
  { key: "hour" as const, label: "시주" },
];

export function PillarCards({ data }: { data: SajuData }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 12,
      }}
    >
      {LABELS.map(({ key, label }) => {
        const pillar = key === "hour" ? data.pillars.hour : data.pillars[key];
        const highlight = key === "day";
        return (
          <div
            key={key}
            className="card"
            style={{
              textAlign: "center",
              borderColor: highlight ? "var(--navy)" : undefined,
            }}
          >
            <p className="label" style={{ marginBottom: 12 }}>
              {label}
              {highlight && (
                <span style={{ display: "block", fontSize: 12, marginTop: 4 }}>
                  당신의 중심이 되는 기운
                </span>
              )}
            </p>
            {pillar ? (
              <>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{pillar.stem}</div>
                <div style={{ fontSize: 28, color: "var(--text-secondary)" }}>{pillar.branch}</div>
              </>
            ) : (
              <div style={{ fontSize: 14, color: "var(--text-secondary)", padding: "24px 0" }}>
                출생시간 미상
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
