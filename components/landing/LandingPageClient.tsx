"use client";

import { LandingScrollSections } from "@/components/landing/LandingScrollSections";
import { MainHeroMedia, useLandingMedia } from "@/components/landing/LandingMedia";
import Link from "next/link";

export function LandingPageClient() {
  const media = useLandingMedia();

  return (
    <div className="landing-page fade-in">
      <section
        className={`landing-hero${media?.mainVideo || media?.mainBg ? " landing-hero--has-media" : ""}`}
      >
        <MainHeroMedia media={media} />
        <div className="landing-hero__content">
          <p className="landing-hero__badge">🌙 사주 상담소</p>
          <h1 className="landing-hero__title">
            운명을 맞히는 것이 아니라,
            <br />
            나를 이해하는 사주.
          </h1>
          <p className="landing-hero__lead">
            사주를 통해 당신의 성향과 반복되는 패턴을
            <br />
            조금 더 깊이 들여다봅니다.
          </p>
          <Link href="/input" className="btn-primary landing-hero__cta">
            ✨ 내 사주 보기
          </Link>
          <p className="landing-hero__hint">👇 아래로 스크롤해 상담 주제와 상담가를 만나보세요</p>
        </div>
      </section>

      <main className="landing-main">
        <LandingScrollSections media={media} />
      </main>
    </div>
  );
}
