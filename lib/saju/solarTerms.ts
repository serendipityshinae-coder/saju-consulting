import { JIE_QI_NAMES } from "./constants";
import { getJieQiTableForYear, toDateTimeMs, type SolarDateTime } from "./lunarBridge";

export interface JieQiInstant {
  name: string;
  dateTime: SolarDateTime;
  ms: number;
}

function collectJieQiForYear(year: number): JieQiInstant[] {
  const table = getJieQiTableForYear(year);
  return JIE_QI_NAMES.map((name) => {
    const dateTime = table[name];
    if (!dateTime) {
      throw new Error(`절기 데이터를 찾을 수 없습니다: ${year} ${name}`);
    }
    return { name, dateTime, ms: toDateTimeMs(dateTime) };
  }).sort((a, b) => a.ms - b.ms);
}

export function getIpchunInstant(birthMs: number): {
  ipchun: JieQiInstant;
  sajuYear: number;
  beforeIpchun: boolean;
} {
  const birthDate = new Date(birthMs);
  const calendarYear = birthDate.getFullYear();

  const current = collectJieQiForYear(calendarYear).find((j) => j.name === "立春");
  const previousYear = collectJieQiForYear(calendarYear - 1).find((j) => j.name === "立春");

  if (!current || !previousYear) {
    throw new Error("입춘 절기 데이터를 찾을 수 없습니다.");
  }

  let ipchun = current;
  let sajuYear = calendarYear;
  let beforeIpchun = false;

  if (birthMs < current.ms) {
    if (birthMs >= previousYear.ms) {
      ipchun = previousYear;
      sajuYear = calendarYear - 1;
      beforeIpchun = true;
    } else {
      ipchun = previousYear;
      sajuYear = calendarYear - 1;
      beforeIpchun = true;
    }
  }

  return { ipchun, sajuYear, beforeIpchun };
}

export function getMonthBranchBySolarTerms(birthMs: number): {
  monthSolarTerm: string;
  monthBranchIndex: number;
} {
  const birthDate = new Date(birthMs);
  const years = [birthDate.getFullYear() - 1, birthDate.getFullYear(), birthDate.getFullYear() + 1];
  const allJie = years
    .flatMap((y) => collectJieQiForYear(y))
    .sort((a, b) => a.ms - b.ms);

  let active = allJie[0];
  for (const jie of allJie) {
    if (jie.ms <= birthMs) {
      active = jie;
    } else {
      break;
    }
  }

  const monthBranchIndex = JIE_QI_NAMES.indexOf(active.name as (typeof JIE_QI_NAMES)[number]);
  if (monthBranchIndex < 0) {
    throw new Error(`월주 절기를 결정할 수 없습니다: ${active.name}`);
  }

  return { monthSolarTerm: active.name, monthBranchIndex };
}
