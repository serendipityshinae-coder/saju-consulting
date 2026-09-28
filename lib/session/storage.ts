"use client";

import type { SessionState } from "./types";
import { SESSION_KEY } from "./types";

export function readSession(): SessionState {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SessionState;
  } catch {
    return {};
  }
}

export function writeSession(partial: Partial<SessionState>) {
  const next = { ...readSession(), ...partial };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  return next;
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
