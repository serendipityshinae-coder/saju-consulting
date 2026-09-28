"use client";

import { CONSULTATION_META, COUNSELOR_META, SUGGESTED_QUESTIONS } from "@/lib/consultation";
import { readSession } from "@/lib/session/storage";
import type { ConsultationType, CounselorPersonality } from "@/lib/session/types";
import type { SajuData } from "@/lib/saju/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function consumeSse(
  response: Response,
  onDelta: (text: string) => void,
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("스트림을 읽을 수 없습니다.");
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return;
      const json = JSON.parse(payload) as { text?: string; error?: string };
      if (json.error) throw new Error(json.error);
      if (json.text) onDelta(json.text);
    }
  }
}

export default function ChatPage() {
  const router = useRouter();
  const [sajuData, setSajuData] = useState<SajuData | null>(null);
  const [consultationType, setConsultationType] = useState<ConsultationType>("basic");
  const [personality, setPersonality] = useState<CounselorPersonality>("counselor");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const greetedRef = useRef(false);

  useEffect(() => {
    const session = readSession();
    if (!session.sajuData) {
      router.replace("/input");
      return;
    }
    if (!session.consultationType || !session.counselorPersonality) {
      router.replace("/topics");
      return;
    }
    setSajuData(session.sajuData);
    setConsultationType(session.consultationType);
    setPersonality(session.counselorPersonality);
  }, [router]);

  const requestChat = useCallback(
    async (nextMessages: ChatMessage[], appendAssistant: (prev: string) => void) => {
      if (!sajuData) return;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sajuData,
          consultationType,
          personality,
          messages: nextMessages,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "상담 요청에 실패했습니다.");
      }

      await consumeSse(res, appendAssistant);
    },
    [consultationType, personality, sajuData],
  );

  useEffect(() => {
    if (!sajuData || greetedRef.current) return;
    greetedRef.current = true;
    setLoading(true);
    let greeting = "";
    requestChat([], (chunk) => {
      greeting += chunk;
      setMessages([{ role: "assistant", content: greeting }]);
    })
      .catch((e) => setError(e instanceof Error ? e.message : "인사말을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [requestChat, sajuData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading || !sajuData) return;
    setError("");
    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    const history = [...messages, userMessage];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      let assistant = "";
      await requestChat(history, (chunk) => {
        assistant += chunk;
        setMessages([...history, { role: "assistant", content: assistant }]);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  }

  if (!sajuData) return null;

  const counselorTitle = COUNSELOR_META[personality].title;
  const topicTitle = CONSULTATION_META[consultationType].title;

  return (
    <main className="fade-in" style={{ paddingBottom: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link href="/counselor" style={{ fontSize: 20, color: "var(--text-secondary)" }}>
          ←
        </Link>
        <div>
          <div style={{ fontWeight: 500 }}>{counselorTitle}</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{topicTitle} 상담</div>
        </div>
      </div>

      {sajuData.metadata.calculationCompleteness === "PARTIAL" && (
        <div className="card" style={{ marginBottom: 16, fontSize: 14 }}>
          출생시간이 없어 시주를 제외한 사주로 상담합니다. 시주 관련 해석은 제공하지 않습니다.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}`}
            className="card"
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "90%",
              background: msg.role === "user" ? "var(--beige)" : "var(--card)",
            }}
          >
            <p style={{ margin: 0, color: "var(--text)", whiteSpace: "pre-wrap" }}>{msg.content}</p>
          </div>
        ))}
      </div>

      {messages.length <= 1 && !loading && (
        <div style={{ marginTop: 24 }}>
          <p className="label">추천 질문</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SUGGESTED_QUESTIONS[consultationType].map((q) => (
              <button
                key={q}
                type="button"
                className="btn-secondary"
                style={{ width: "100%", height: "auto", padding: "12px 16px", textAlign: "left" }}
                onClick={() => setInput(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: "#b44", marginTop: 16, fontSize: 14 }} role="alert">
          {error}
        </p>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "var(--bg)",
          borderTop: "1px solid var(--border)",
          padding: "12px 20px 20px",
        }}
      >
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="질문을 입력해주세요..."
            aria-label="질문 입력"
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              border: "1px solid var(--border)",
              padding: "0 14px",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
          />
          <button
            type="button"
            className="btn-primary"
            style={{ width: 72, flexShrink: 0 }}
            disabled={loading || !input.trim()}
            onClick={() => sendMessage(input)}
          >
            ↑
          </button>
        </div>
      </div>
      <div ref={bottomRef} />
    </main>
  );
}
