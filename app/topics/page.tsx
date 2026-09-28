"use client";

import { CONSULTATION_META } from "@/lib/consultation";
import { readSession, writeSession } from "@/lib/session/storage";
import type { ConsultationType } from "@/lib/session/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ORDER: ConsultationType[] = ["basic", "love", "career"];

export default function TopicsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!readSession().sajuData) router.replace("/input");
  }, [router]);

  function select(type: ConsultationType) {
    writeSession({ consultationType: type });
  }

  return (
    <main className="fade-in">
      <h1>지금 가장 궁금한 것은 무엇인가요?</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
        {ORDER.map((type) => {
          const meta = CONSULTATION_META[type];
          return (
            <div key={type} className="card">
              <h2 style={{ fontSize: 18 }}>{meta.title}</h2>
              <p style={{ color: "var(--text)", fontWeight: 500 }}>{meta.subtitle}</p>
              <p>{meta.description}</p>
              <Link
                href="/counselor"
                className="btn-secondary"
                style={{ width: "100%", marginTop: 8 }}
                onClick={() => select(type)}
              >
                상담하기
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
