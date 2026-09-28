import { getEightCharFromSolar } from "./lunarBridge";
import type { Gender, MajorLuckPeriod } from "./types";

export function calculateMajorLuck(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  gender: Gender,
): MajorLuckPeriod[] {
  const ec = getEightCharFromSolar(year, month, day, hour, minute);
  const yun = ec.getYun(gender === "male" ? 1 : 0);
  const daYun = yun.getDaYun() as Array<{ getStartAge: () => number; getGanZhi: () => string }>;

  return daYun
    .slice(1, 9)
    .map((d) => ({
      startAge: d.getStartAge(),
      pillar: d.getGanZhi(),
    }))
    .filter((d) => d.pillar);
}
