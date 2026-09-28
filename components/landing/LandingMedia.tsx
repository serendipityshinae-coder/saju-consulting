"use client";

import { useEffect, useState } from "react";
import { LoopRewindVideo } from "./LoopRewindVideo";

export interface LandingMediaManifest {
  mainBg: string | null;
  mainVideo: string | null;
  topicsBg: string | null;
  topicsVideo: string | null;
  heroBg: string | null;
}

export function useLandingMedia() {
  const [media, setMedia] = useState<LandingMediaManifest | null>(null);

  useEffect(() => {
    fetch("/source/manifest.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setMedia(data))
      .catch(() => setMedia(null));
  }, []);

  return media;
}

export function SectionImageBg({
  src,
  className = "",
  overlayClass = "landing-section-bg__overlay",
}: {
  src: string;
  className?: string;
  overlayClass?: string;
}) {
  return (
    <div
      className={`landing-section-bg ${className}`}
      style={{ backgroundImage: `url(${src})` }}
      aria-hidden
    >
      <div className={overlayClass} />
    </div>
  );
}

export function MainHeroMedia({ media }: { media: LandingMediaManifest | null }) {
  if (!media?.mainBg && !media?.mainVideo) return null;

  return (
    <div className="landing-hero__media" aria-hidden>
      {media.mainVideo && (
        <LoopRewindVideo
          src={media.mainVideo}
          className="landing-hero__video"
          poster={media.mainBg ?? undefined}
          loop
        />
      )}
      {media.mainBg && (
        <div
          className="landing-hero__main-bg"
          style={{ backgroundImage: `url(${media.mainBg})` }}
        />
      )}
      <div className="landing-hero__media-overlay" />
    </div>
  );
}

export function TopicsSectionMedia({ media }: { media: LandingMediaManifest | null }) {
  if (!media?.topicsBg && !media?.topicsVideo) return null;

  return (
    <>
      {media.topicsVideo && (
        <LoopRewindVideo
          src={media.topicsVideo}
          className="landing-topics-section__video"
          loop
        />
      )}
      {media.topicsBg && (
        <SectionImageBg
          src={media.topicsBg}
          className="landing-topics-section__bg"
          overlayClass="landing-topics-section__bg-overlay"
        />
      )}
    </>
  );
}

export function CounselorSectionMedia({ media }: { media: LandingMediaManifest | null }) {
  if (!media?.heroBg) return null;

  return (
    <SectionImageBg
      src={media.heroBg}
      className="landing-counselor-section__bg"
      overlayClass="landing-counselor-section__hero-overlay"
    />
  );
}
