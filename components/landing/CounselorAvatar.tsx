import type { CounselorPersonality } from "@/lib/session/types";

export function CounselorAvatar({ type }: { type: CounselorPersonality }) {
  if (type === "analyst") {
    return (
      <div
        aria-hidden
        style={{
          width: 88,
          height: 88,
          borderRadius: 20,
          background: "linear-gradient(145deg, #283244 0%, #3d4a5c 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "#eae5dc",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 14,
            width: 48,
            height: 3,
            background: "rgba(234,229,220,0.35)",
            borderRadius: 2,
          }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      style={{
        width: 88,
        height: 88,
        borderRadius: "50%",
        background: "linear-gradient(145deg, #67647c 0%, #8a8799 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.5)",
          background: "rgba(247,246,242,0.15)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 22,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#f7f6f2",
          boxShadow: "16px 0 0 #f7f6f2",
          opacity: 0.85,
        }}
      />
    </div>
  );
}
