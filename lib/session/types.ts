import type { BirthInput, SajuData } from "@/lib/saju/types";

export type ConsultationType = "basic" | "love" | "career";
export type CounselorPersonality = "analyst" | "counselor";

export interface SessionState {
  birthInput?: BirthInput;
  sajuData?: SajuData;
  consultationType?: ConsultationType;
  counselorPersonality?: CounselorPersonality;
}

export const SESSION_KEY = "saju-consulting-session";
