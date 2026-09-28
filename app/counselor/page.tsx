"use client";

import { COUNSELOR_META } from "@/lib/consultation";
import { readSession, writeSession } from "@/lib/session/storage";
import type { CounselorPersonality } from "@/lib/session/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ORDER: CounselorPersonality[] = ["analyst", "counselor"];

export default function CounselorPage() {
  const router = useRouter();

  useEffect(() => {
    const session = readSession();
    if (!session.sajuData) router.replace("/input");
    if (!session.consultationType) router.replace("/topics");
  }, [router]);

  function select(personality: CounselorPersonality) {
    writeSession({ counselorPersonality: personality });
  }

  return (
    <main className="fade-in">
      <h1>누구와 이야기하시겠어요?</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
        {ORDER.map((key) => {
          const meta = COUNSELOR_META[key];
          return (
            <div key={key} className="card">
              <p style={{ fontSize: 13, letterSpacing: 1, color: "var(--purple)" }}>
                {key === "analyst" ? "◼" : "○"} {meta.symbol}
              </p>
              <h2 style={{ fontSize: 18 }}>{meta.title}</h2>
              <p style={{ color: "var(--text)" }}>{meta.tagline}</p>
              <p style={{ fontSize: 14 }}>{meta.tags.join(" · ")}</p>
              <p>{meta.description}</p>
              <Link
                href="/chat"
                className="btn-primary"
                style={{ marginTop: 8, textAlign: "center" }}
                onClick={() => select(key)}
              >
                이 상담가 선택
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
