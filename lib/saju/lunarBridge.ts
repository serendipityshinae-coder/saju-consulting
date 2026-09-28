/* eslint-disable @typescript-eslint/no-require-imports */
const { Lunar, Solar } = require("lunar-javascript");

export interface SolarDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export function getJieQiTableForYear(year: number): Record<string, SolarDateTime> {
  const lunar = Lunar.fromYmd(year, 6, 1);
  const table = lunar.getJieQiTable() as Record<
    string,
    { toYmdHms: () => string; getYear: () => number; getMonth: () => number; getDay: () => number; getHour: () => number; getMinute: () => number; getSecond: () => number }
  >;

  const result: Record<string, SolarDateTime> = {};
  for (const [name, solar] of Object.entries(table)) {
    if (!solar?.toYmdHms) continue;
    result[name] = {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
      hour: solar.getHour(),
      minute: solar.getMinute(),
      second: solar.getSecond(),
    };
  }
  return result;
}

export function toDateTimeMs(dt: SolarDateTime): number {
  return new Date(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second).getTime();
}

/** lunar-javascript EightChar — 교차 검증 및 대운 래퍼용 */
export function getEightCharFromSolar(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
) {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  return solar.getLunar().getEightChar();
}
