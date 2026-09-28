import { FiveElementsBar } from "@/components/FiveElementsBar";
import { PillarCards } from "@/components/PillarCards";
import { TenGodHint } from "@/components/TenGodHint";
import { DAY_MASTER_META } from "@/lib/dayMasterMeta";
import {
  branchElementKo,
  formatPillar,
  PILLAR_ROLE,
  stemElementKo,
} from "@/lib/saju/pillarMeta";
import { buildSummaryFeatures } from "@/lib/saju/summaryFeatures";
import type { SajuData } from "@/lib/saju/types";

const PILLAR_KEYS = ["year", "month", "day", "hour"] as const;

function collectRelationships(data: SajuData): string[] {
  const r = data.relationships;
  return [
    ...r.stemCombinations,
    ...r.branchCombinations,
    ...r.clashes,
    ...r.punishments,
    ...r.harms,
    ...r.breaks,
  ];
}

function formatBirthSummary(data: SajuData): string {
  const cal = data.input.calendarType === "lunar" ? "음력" : "양력";
  const parts = [
    `${cal} ${data.input.originalBirthDate}`,
    data.input.birthTimeKnown && data.input.originalBirthTime
      ? `출생 ${data.input.originalBirthTime}`
      : "출생시간 미상",
    data.normalized.solarDate !== data.input.originalBirthDate
      ? `(양력 ${data.normalized.solarDate})`
      : null,
    data.input.birthCity === "Seoul" ? "서울" : data.input.birthCity,
  ].filter(Boolean);
  return parts.join(" · ");
}

export function SajuAnalysisSections({ data }: { data: SajuData }) {
  const meta = DAY_MASTER_META[data.dayMaster];
  const features = buildSummaryFeatures(data);
  const relations = collectRelationships(data);

  const stemTenGod: Record<string, string | undefined> = {
    year: data.tenGods.yearStem,
    month: data.tenGods.monthStem,
    day: data.tenGods.dayStem,
    hour: data.tenGods.hourStem,
  };

  return (
    <>
      <section className="card summary-intro">
        <p className="label">입력 정보</p>
        <p style={{ margin: 0, color: "var(--text)", fontSize: 15 }}>{formatBirthSummary(data)}</p>
        {data.trace?.monthSolarTerm && (
          <p style={{ margin: "10px 0 0", fontSize: 13 }}>
            월주 기준 절기: <strong>{data.trace.monthSolarTerm}</strong>
            {data.trace.sajuYear ? ` · 사주 연도 ${data.trace.sajuYear}년` : ""}
          </p>
        )}
      </section>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>사주팔자</h2>
        <PillarCards data={data} />
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>기둥별 상세</h2>
        <div className="summary-pillar-list">
          {PILLAR_KEYS.map((key) => {
            const pillar = key === "hour" ? data.pillars.hour : data.pillars[key];
            const role = PILLAR_ROLE[key];
            if (!pillar) {
              return (
                <div key={key} className="summary-pillar-row summary-pillar-row--muted">
                  <div>
                    <strong>{role.title}</strong>
                    <p>{role.hint}</p>
                  </div>
                  <span>출생시간 미상</span>
                </div>
              );
            }
            const hidden = data.hiddenStems[key] ?? [];
            const branchGods = data.tenGods.branches[key] ?? [];
            return (
              <div key={key} className="summary-pillar-row">
                <div className="summary-pillar-row__head">
                  <strong>{role.title}</strong>
                  <span className="summary-pillar-row__gz">{formatPillar(pillar.stem, pillar.branch)}</span>
                </div>
                <p className="summary-pillar-row__hint">{role.hint}</p>
                <dl className="summary-dl">
                  <div>
                    <dt>천간</dt>
                    <dd>
                      {pillar.stem} · {stemElementKo(pillar.stem)}
                      {stemTenGod[key] && (
                        <>
                          {" · "}
                          <TenGodHint name={stemTenGod[key]!} />
                        </>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>지지</dt>
                    <dd>
                      {pillar.branch} · {branchElementKo(pillar.branch)}
                    </dd>
                  </div>
                  <div>
                    <dt>지장간</dt>
                    <dd>
                      {hidden.join(" ")}
                      {branchGods.length > 0 && (
                        <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                          {" "}
                          (
                          {branchGods.map((g, i) => (
                            <span key={`${g}-${i}`}>
                              {i > 0 ? ", " : ""}
                              <TenGodHint name={g} />
                            </span>
                          ))}
                          )
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </section>

      {meta && (
        <section className="card" style={{ marginTop: 16 }}>
          <p className="label">나를 나타내는 기운 (일간)</p>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>{meta.hanja}</h2>
          <p style={{ color: "var(--text)", fontWeight: 500, marginBottom: 8 }}>{meta.title}</p>
          <p style={{ margin: "0 0 12px" }}>{meta.description}</p>
          <p style={{ margin: 0, fontSize: 14 }}>
            일간 오행: <strong>{stemElementKo(data.dayMaster)}</strong> — 사주 전체 해석의 기준점이
            됩니다.
          </p>
        </section>
      )}

      <section style={{ marginTop: 16 }}>
        <FiveElementsBar data={data} showCounts />
      </section>

      {relations.length > 0 && (
        <section className="card" style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>원국 내 관계</h2>
          <p style={{ fontSize: 14, marginBottom: 12 }}>
            네 기둥 사이에서 드러나는 합·충·형·파·해입니다. 하나만으로 성격을 단정하지 않습니다.
          </p>
          <ul className="summary-tag-list">
            {relations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {data.majorLuck && data.majorLuck.length > 0 && (
        <section className="card" style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>대운 (10년 흐름)</h2>
          <p style={{ fontSize: 14, marginBottom: 16 }}>
            약 {data.majorLuck[0]?.startAge}세부터 시작하는 10년 단위 운의 흐름입니다.
          </p>
          <div className="summary-luck-grid">
            {data.majorLuck.map((luck) => (
              <div key={`${luck.startAge}-${luck.pillar}`} className="summary-luck-item">
                <span className="summary-luck-item__age">{luck.startAge}세~</span>
                <span className="summary-luck-item__pillar">{luck.pillar}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.annualLuck && data.annualLuck.length > 0 && (
        <section className="card" style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>세운 (연도별 간지)</h2>
          <div className="summary-luck-grid">
            {data.annualLuck.map((y) => (
              <div key={y.year} className="summary-luck-item">
                <span className="summary-luck-item__age">{y.year}년</span>
                <span className="summary-luck-item__pillar">{y.pillar}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: 24 }}>
        <h2>핵심 특징</h2>
        <p style={{ fontSize: 14, marginBottom: 16 }}>
          계산된 사주를 바탕으로 한 요약입니다. 자세한 해석은 AI 상담에서 이어갈 수 있습니다.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {features.map((text, i) => (
            <div key={`${i}-${text.slice(0, 12)}`} className="card">
              <span style={{ fontSize: 13, color: "var(--purple)" }}>{String(i + 1).padStart(2, "0")}</span>
              <p style={{ margin: "8px 0 0", color: "var(--text)" }}>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
