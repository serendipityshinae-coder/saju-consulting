declare module "korean-lunar-calendar" {
  export default class KoreanLunarCalendar {
    setLunarDate(
      lunarYear: number,
      lunarMonth: number,
      lunarDay: number,
      isLeapMonth: boolean,
    ): boolean;
    setSolarDate(solarYear: number, solarMonth: number, solarDay: number): boolean;
    getSolarCalendar(): { year: number; month: number; day: number };
    getLunarCalendar(): {
      year: number;
      month: number;
      day: number;
      isLeapMonth: boolean;
    };
  }
}
