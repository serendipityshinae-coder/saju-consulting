"use client";

import { CalculationPolicyPanel } from "@/components/CalculationPolicyPanel";
import { SajuAnalysisSections } from "@/components/summary/SajuAnalysisSections";
import { readSession } from "@/lib/session/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SajuData } from "@/lib/saju/types";

export default function SummaryPage() {
  const router = useRouter();
  const [data, setData] = useState<SajuData | null>(null);
  const [nextHref, setNextHref] = useState("/topics");
  const [nextLabel, setNextLabel] = useState("상담 주제 선택하기");

  useEffect(() => {
    const session = readSession();
    if (!session.sajuData) {
      router.replace("/input");
      return;
    }
    setData(session.sajuData);
    if (session.consultationType && session.counselorPersonality) {
      setNextHref("/chat");
      setNextLabel("상담 시작하기");
    } else if (session.consultationType) {
      setNextHref("/counselor");
      setNextLabel("상담가 선택하기");
    }
  }, [router]);

  if (!data) return null;

  return (
    <main className="fade-in summary-page">
      <h1>당신의 사주</h1>
      <p style={{ fontSize: 14, marginBottom: 8 }}>
        계산된 사주팔자와 명리 구조를 정리했습니다.
      </p>

      <SajuAnalysisSections data={data} />

      <CalculationPolicyPanel data={data} />

      <Link href={nextHref} className="btn-primary" style={{ marginTop: 32, textAlign: "center" }}>
        {nextLabel}
      </Link>
    </main>
  );
}
