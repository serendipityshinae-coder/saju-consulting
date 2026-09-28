import { calculateAnnualLuck } from "./annualLuck";
import { formatIsoDate, normalizeToSolar } from "./calendar";
import { ENGINE_VERSION, SAJU_CONFIG } from "./config";
import { calculateMajorLuck } from "./daewoon";
import { calculateDayPillar } from "./dayPillar";
import { calculateFiveElements } from "./fiveElements";
import { calculateHiddenStems } from "./hiddenStems";
import { calculateHourPillar, getHourBranchIndex } from "./hourPillar";
import { EARTHLY_BRANCHES } from "./constants";
import { calculateMonthPillar } from "./monthPillar";
import { calculateRelationships } from "./relationships";
import { getIpchunInstant, getMonthBranchBySolarTerms } from "./solarTerms";
import { calculateTenGods } from "./tenGods";
import type { BirthInput, SajuData } from "./types";
import { calculateYearPillar } from "./yearPillar";

const DEFAULT_TIMEZONE = "Asia/Seoul";

export function calculateSaju(input: BirthInput): SajuData {
  const timezone = input.timezone ?? DEFAULT_TIMEZONE;
  const solar = normalizeToSolar(input);

  const hour = input.birthTimeKnown ? (input.hour ?? 0) : 0;
  const minute = input.birthTimeKnown ? (input.minute ?? 0) : 0;

  const birthMs = new Date(
    solar.year,
    solar.month - 1,
    solar.day,
    hour,
    minute,
    0,
  ).getTime();

  const { ipchun, sajuYear, beforeIpchun } = getIpchunInstant(birthMs);
  const yearPillar = calculateYearPillar(sajuYear);
  const { monthSolarTerm, monthBranchIndex } = getMonthBranchBySolarTerms(birthMs);
  const monthPillar = calculateMonthPillar(yearPillar.stem, monthBranchIndex);
  const { pillar: dayPillar, dayPillarIndex } = calculateDayPillar(
    solar.year,
    solar.month,
    solar.day,
  );

  let hourPillar = null;
  if (input.birthTimeKnown) {
    let dayStemForHour = dayPillar.stem;
    if (hour >= 23) {
      const nextDay = new Date(solar.year, solar.month - 1, solar.day + 1);
      dayStemForHour = calculateDayPillar(
        nextDay.getFullYear(),
        nextDay.getMonth() + 1,
        nextDay.getDate(),
      ).pillar.stem;
    }
    hourPillar = calculateHourPillar(dayStemForHour, hour);
  }

  const pillars = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };

  const hiddenStems = calculateHiddenStems(pillars);
  const fiveElements = calculateFiveElements(pillars);
  const dayMaster = dayPillar.stem;
  const tenGods = calculateTenGods(dayMaster, pillars);
  const relationships = calculateRelationships(pillars);

  const solarDate = formatIsoDate(solar.year, solar.month, solar.day);
  const originalBirthDate = formatIsoDate(input.year, input.month, input.day);
  const localDateTime = input.birthTimeKnown
    ? `${solarDate} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    : undefined;

  let majorLuck: SajuData["majorLuck"];
  let annualLuck: SajuData["annualLuck"];

  if (input.birthTimeKnown) {
    majorLuck = calculateMajorLuck(solar.year, solar.month, solar.day, hour, minute, input.gender);
    annualLuck = calculateAnnualLuck(new Date().getFullYear());
  } else {
    annualLuck = calculateAnnualLuck(new Date().getFullYear());
  }

  const hourBranchIndex = input.birthTimeKnown ? getHourBranchIndex(hour) : undefined;

  return {
    input: {
      calendarType: input.calendarType,
      originalBirthDate,
      birthTimeKnown: input.birthTimeKnown,
      originalBirthTime: input.birthTimeKnown
        ? `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        : undefined,
      birthCountry: input.birthCountry,
      birthCity: input.birthCity,
      timezone,
    },
    normalized: {
      solarDate,
      localDateTime,
      correctedDateTime: localDateTime,
    },
    calculationPolicy: {
      yearBoundary: SAJU_CONFIG.yearBoundary,
      monthBoundary: SAJU_CONFIG.monthBoundary,
      dayBoundary: SAJU_CONFIG.dayBoundary,
      timeCorrection: SAJU_CONFIG.timeCorrection,
    },
    pillars,
    dayMaster,
    fiveElements,
    hiddenStems,
    tenGods,
    relationships,
    majorLuck,
    annualLuck,
    metadata: {
      engineVersion: ENGINE_VERSION,
      calculationCompleteness: input.birthTimeKnown ? "FULL" : "PARTIAL",
    },
    trace: {
      inputDateTime: localDateTime,
      solarDate,
      timezone,
      ipchun: `${ipchun.dateTime.year}-${String(ipchun.dateTime.month).padStart(2, "0")}-${String(ipchun.dateTime.day).padStart(2, "0")} ${String(ipchun.dateTime.hour).padStart(2, "0")}:${String(ipchun.dateTime.minute).padStart(2, "0")}`,
      beforeIpchun,
      sajuYear,
      monthSolarTerm,
      dayPillarIndex,
      hourBranch: hourBranchIndex !== undefined ? EARTHLY_BRANCHES[hourBranchIndex] : undefined,
    },
  };
}
