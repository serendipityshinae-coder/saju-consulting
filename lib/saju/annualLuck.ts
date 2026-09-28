import { calculateYearPillar } from "./yearPillar";
import type { AnnualLuckYear } from "./types";

export function calculateAnnualLuck(fromYear: number, count = 8): AnnualLuckYear[] {
  const result: AnnualLuckYear[] = [];
  for (let i = 0; i < count; i++) {
    const year = fromYear + i;
    const pillar = calculateYearPillar(year);
    result.push({ year, pillar: `${pillar.stem}${pillar.branch}` });
  }
  return result;
}
