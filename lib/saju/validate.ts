import { z } from "zod";
import type { BirthInput } from "./types";

export const birthInputSchema = z
  .object({
    calendarType: z.enum(["solar", "lunar"]),
    year: z.number().int().min(1900).max(2100),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
    isLeapMonth: z.boolean().optional(),
    birthTimeKnown: z.boolean(),
    hour: z.number().int().min(0).max(23).optional(),
    minute: z.number().int().min(0).max(59).optional(),
    gender: z.enum(["male", "female"]),
    birthCountry: z.string().min(1),
    birthCity: z.string().optional(),
    timezone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.birthTimeKnown) {
      if (data.hour === undefined || data.minute === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "출생 시간을 입력해주세요.",
          path: ["hour"],
        });
      }
    }
  });

export function parseBirthInput(raw: unknown): BirthInput {
  return birthInputSchema.parse(raw) as BirthInput;
}
