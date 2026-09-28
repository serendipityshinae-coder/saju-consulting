"use client";

import { readSession, writeSession } from "@/lib/session/storage";
import type { SajuData } from "@/lib/saju/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MESSAGES = [
  "태어난 시간을 기준으로 사주를 계산하고 있어요.",
  "당신의 오행 흐름을 살펴보고 있어요.",
  "사주에서 중요한 특징을 찾고 있어요.",
  "분석이 거의 끝났어요.",
];

export default function AnalyzingPage() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const session = readSession();
    const birthInput = session.birthInput;
    if (!birthInput) {
      router.replace("/input");
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/saju/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(birthInput),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "계산 실패");
        }
        if (cancelled) return;
        writeSession({ sajuData: data as SajuData });
        router.replace("/summary");
      } catch {
        if (!cancelled) router.replace("/input");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="fade-in" style={{ minHeight: "50vh", display: "flex", alignItems: "center" }}>
      <div>
        <h2 style={{ fontSize: 22 }}>사주를 분석하고 있습니다</h2>
        <p key={messageIndex} className="fade-in">
          {MESSAGES[messageIndex]}
        </p>
      </div>
    </main>
  );
}
