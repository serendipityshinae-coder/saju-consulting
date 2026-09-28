export type CalendarType = "solar" | "lunar";
export type Gender = "male" | "female";

export interface BirthInput {
  calendarType: CalendarType;
  year: number;
  month: number;
  day: number;
  isLeapMonth?: boolean;
  birthTimeKnown: boolean;
  hour?: number;
  minute?: number;
  gender: Gender;
  birthCountry: string;
  birthCity?: string;
  timezone?: string;
}

export interface Pillar {
  stem: string;
  branch: string;
}

export interface SajuTrace {
  inputDateTime?: string;
  solarDate: string;
  timezone: string;
  ipchun?: string;
  beforeIpchun?: boolean;
  sajuYear?: number;
  monthSolarTerm?: string;
  dayPillarIndex?: number;
  hourBranch?: string;
}

export interface MajorLuckPeriod {
  startAge: number;
  pillar: string;
}

export interface AnnualLuckYear {
  year: number;
  pillar: string;
}

export interface SajuData {
  input: {
    calendarType: string;
    originalBirthDate: string;
    birthTimeKnown: boolean;
    originalBirthTime?: string;
    birthCountry: string;
    birthCity?: string;
    timezone: string;
  };
  normalized: {
    solarDate: string;
    localDateTime?: string;
    correctedDateTime?: string;
  };
  calculationPolicy: {
    yearBoundary: "IPCHUN";
    monthBoundary: "SOLAR_TERMS";
    dayBoundary: "MIDNIGHT" | "ZI_HOUR_23";
    timeCorrection: "STANDARD_TIME" | "LOCAL_MEAN_TIME" | "TRUE_SOLAR_TIME";
  };
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
  };
  dayMaster: string;
  fiveElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  hiddenStems: Record<string, string[]>;
  tenGods: {
    yearStem: string;
    monthStem: string;
    dayStem: string;
    hourStem?: string;
    branches: Record<string, string[]>;
  };
  relationships: {
    stemCombinations: string[];
    branchCombinations: string[];
    clashes: string[];
    punishments: string[];
    harms: string[];
    breaks: string[];
  };
  majorLuck?: MajorLuckPeriod[];
  annualLuck?: AnnualLuckYear[];
  metadata: {
    engineVersion: string;
    calculationCompleteness: "FULL" | "PARTIAL";
  };
  trace?: SajuTrace;
}
