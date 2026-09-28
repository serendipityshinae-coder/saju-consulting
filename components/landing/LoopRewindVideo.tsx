"use client";

import { useCallback, useEffect, useRef } from "react";

type PlayMode = "forward" | "rewind";

export function LoopRewindVideo({
  src,
  className = "",
  poster,
  /** 되감기 속도 (1 = 실시간과 같은 속도로 역재생) */
  rewindSpeed = 1,
  /** false면 종료 시 즉시 처음으로 점프 (구 방식) */
  smoothRewind = true,
  /** true면 브라우저 기본 loop (끝→처음 무한 반복) */
  loop = false,
}: {
  src: string;
  className?: string;
  poster?: string;
  rewindSpeed?: number;
  smoothRewind?: boolean;
  loop?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const modeRef = useRef<PlayMode>("forward");
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);

  const stopRewindLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    lastTsRef.current = 0;
  }, []);

  const rewindFrame = useCallback(
    (ts: number) => {
      const el = ref.current;
      if (!el || modeRef.current !== "rewind") return;

      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;

      const next = el.currentTime - dt * rewindSpeed;
      if (next <= 0.04) {
        el.currentTime = 0;
        modeRef.current = "forward";
        stopRewindLoop();
        void el.play();
        return;
      }

      el.currentTime = next;
      rafRef.current = requestAnimationFrame(rewindFrame);
    },
    [rewindSpeed, stopRewindLoop],
  );

  const startSmoothRewind = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.pause();
    modeRef.current = "rewind";
    stopRewindLoop();
    rafRef.current = requestAnimationFrame(rewindFrame);
  }, [rewindFrame, stopRewindLoop]);

  const onEnded = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    if (!smoothRewind) {
      el.currentTime = 0;
      void el.play();
      return;
    }

    startSmoothRewind();
  }, [smoothRewind, startSmoothRewind]);

  useEffect(() => {
    return () => stopRewindLoop();
  }, [stopRewindLoop]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tryPlay = () => {
      if (modeRef.current !== "forward") return;
      void el.play().catch(() => {});
    };

    tryPlay();
    el.addEventListener("loadeddata", tryPlay);

    const onVisibility = () => {
      if (document.hidden || el.ended) return;
      if (modeRef.current === "forward" && el.paused) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      playsInline
      autoPlay
      loop={loop}
      preload="auto"
      onEnded={loop ? undefined : onEnded}
      aria-hidden
    />
  );
}
