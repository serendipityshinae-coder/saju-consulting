import { describe, expect, it } from "vitest";
import { getTenGod } from "@/lib/saju/tenGods";

describe("tenGods", () => {
  it("returns 日主 for day master comparison in calculator", () => {
    expect(getTenGod("甲", "乙")).toBe("劫财");
    expect(getTenGod("甲", "丙")).toBe("食神");
  });
});
