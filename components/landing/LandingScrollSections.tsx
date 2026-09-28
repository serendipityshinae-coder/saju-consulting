"use client";

import { CONSULTATION_META, COUNSELOR_META } from "@/lib/consultation";
import { writeSession } from "@/lib/session/storage";
import type { ConsultationType, CounselorPersonality } from "@/lib/session/types";
import { useRouter } from "next/navigation";
import type { LandingMediaManifest } from "./LandingMedia";
import { CounselorSectionMedia, TopicsSectionMedia } from "./LandingMedia";
import { ScrollReveal } from "./ScrollReveal";

const TOPIC_ORDER: ConsultationType[] = ["basic", "love", "career"];
const COUNSELOR_ORDER: CounselorPersonality[] = ["analyst", "counselor"];

const TOPIC_EMOJI: Record<ConsultationType, string> = {
  basic: "🌿",
  love: "💞",
  career: "📈",
};

const COUNSELOR_EMOJI: Record<CounselorPersonality, string> = {
  analyst: "◼️",
  counselor: "💬",
};

export function LandingScrollSections({ media }: { media: LandingMediaManifest | null }) {
  const router = useRouter();

  function selectTopic(type: ConsultationType) {
    writeSession({ consultationType: type });
    router.push("/input");
  }

  function selectCounselor(personality: CounselorPersonality) {
    writeSession({ counselorPersonality: personality });
    router.push("/input");
  }

  return (
    <>
      <section
        className={`landing-topics-section landing-section-with-bg${media?.topicsVideo || media?.topicsBg ? " landing-topics-section--has-media" : ""}`}
      >
        <TopicsSectionMedia media={media} />
        <div className="landing-section-with-bg__content">
        <ScrollReveal>
          <div className="landing-topics-section__header">
            <p className="landing-topics-section__eyebrow">💬 상담 주제</p>
            <h2>지금 가장 궁금한 것은 무엇인가요?</h2>
            <p>궁금한 주제를 선택하고 사주 상담을 시작해 보세요.</p>
          </div>
        </ScrollReveal>

        <div className="landing-topic-list">
          {TOPIC_ORDER.map((type, index) => {
            const meta = CONSULTATION_META[type];
            const emoji = TOPIC_EMOJI[type];
            return (
              <ScrollReveal key={type}>
                <button
                  type="button"
                  className="landing-topic-btn"
                  onClick={() => selectTopic(type)}
                  aria-label={`${meta.title} 상담하기`}
                >
                  <span className="landing-topic-btn__emoji" aria-hidden>
                    {emoji}
                  </span>
                  <span className="landing-topic-btn__index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="landing-topic-btn__body">
                    <span className="landing-topic-btn__title">
                      {meta.title}
                    </span>
                    <span className="landing-topic-btn__subtitle">{meta.subtitle}</span>
                    <span className="landing-topic-btn__desc">{meta.description}</span>
                  </span>
                  <span className="landing-topic-btn__cta">상담하기 →</span>
                </button>
              </ScrollReveal>
            );
          })}
        </div>
        </div>
      </section>

      <section
        className={`landing-topics-section landing-section-with-bg landing-counselor-section${media?.heroBg ? " landing-topics-section--has-media" : ""}`}
      >
        <CounselorSectionMedia media={media} />
        <div className="landing-section-with-bg__content">
          <ScrollReveal>
            <div className="landing-topics-section__header">
              <p className="landing-topics-section__eyebrow">🎭 상담가</p>
              <h2>누구와 이야기하시겠어요?</h2>
              <p>같은 사주 데이터, 다른 상담 스타일.</p>
            </div>
          </ScrollReveal>

          <div className="landing-topic-list">
            {COUNSELOR_ORDER.map((key, index) => {
              const meta = COUNSELOR_META[key];
              return (
                <ScrollReveal key={key}>
                  <button
                    type="button"
                    className="landing-topic-btn"
                    onClick={() => selectCounselor(key)}
                    aria-label={`${meta.title} 선택`}
                  >
                    <span className="landing-topic-btn__emoji" aria-hidden>
                      {COUNSELOR_EMOJI[key]}
                    </span>
                    <span className="landing-topic-btn__index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="landing-topic-btn__body">
                      <span className="landing-topic-btn__title">{meta.title}</span>
                      <span className="landing-topic-btn__subtitle">{meta.tagline}</span>
                      <span className="landing-topic-btn__desc">
                        {meta.tags.join(" · ")}
                        <br />
                        {meta.description}
                      </span>
                    </span>
                    <span className="landing-topic-btn__cta">선택하기 →</span>
                  </button>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
