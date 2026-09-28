import type { SajuData } from "@/lib/saju/types";

const ELEMENTS = [
  { key: "wood" as const, label: "木", color: "var(--wood)" },
  { key: "fire" as const, label: "火", color: "var(--fire)" },
  { key: "earth" as const, label: "土", color: "var(--earth)" },
  { key: "metal" as const, label: "金", color: "var(--metal)" },
  { key: "water" as const, label: "水", color: "var(--water)" },
];

export function FiveElementsBar({
  data,
  showCounts = false,
}: {
  data: SajuData;
  showCounts?: boolean;
}) {
  const max = Math.max(...Object.values(data.fiveElements), 1);

  return (
    <div className="card">
      <h2 style={{ fontSize: 18, marginBottom: 16 }}>내 사주의 균형</h2>
      <p style={{ fontSize: 14, marginBottom: 20 }}>오행 구성 (상대적 비율)</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ELEMENTS.map(({ key, label, color }) => {
          const value = data.fiveElements[key];
          const width = `${Math.round((value / max) * 100)}%`;
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: showCounts ? 52 : 24, fontSize: 14, textAlign: "right" }}>
                {label}
                {showCounts ? ` ${value}` : ""}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 10,
                  background: "var(--beige)",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width,
                    minWidth: value > 0 ? 8 : 0,
                    height: "100%",
                    background: color,
                    borderRadius: 6,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
