"use client";

import { writeSession } from "@/lib/session/storage";
import type { BirthInput } from "@/lib/saju/types";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const CITIES = [{ id: "Seoul", label: "서울", timezone: "Asia/Seoul" }];

export default function InputPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"female" | "male">("female");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [birthTimeKnown, setBirthTimeKnown] = useState(true);
  const [year, setYear] = useState("1990");
  const [month, setMonth] = useState("5");
  const [day, setDay] = useState("10");
  const [hour, setHour] = useState("14");
  const [minute, setMinute] = useState("30");
  const [city, setCity] = useState("Seoul");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const input: BirthInput = {
      calendarType,
      year: Number(year),
      month: Number(month),
      day: Number(day),
      isLeapMonth: calendarType === "lunar" ? isLeapMonth : undefined,
      birthTimeKnown,
      hour: birthTimeKnown ? Number(hour) : undefined,
      minute: birthTimeKnown ? Number(minute) : undefined,
      gender,
      birthCountry: "KR",
      birthCity: city,
      timezone: CITIES.find((c) => c.id === city)?.timezone ?? "Asia/Seoul",
    };

    writeSession({ birthInput: input });
    router.push("/analyzing");
  }

  return (
    <main className="fade-in">
      <h1>먼저 당신의 시간을 알려주세요.</h1>
      <p>정확한 사주 분석을 위해 태어난 날짜와 시간을 입력해주세요.</p>

      <form onSubmit={onSubmit} style={{ marginTop: 32 }}>
        <div className="field">
          <span className="label">성별</span>
          <div className="input-row">
            <button
              type="button"
              className={`btn-secondary ${gender === "female" ? "active" : ""}`}
              style={{ flex: 1 }}
              onClick={() => setGender("female")}
            >
              여성
            </button>
            <button
              type="button"
              className={`btn-secondary ${gender === "male" ? "active" : ""}`}
              style={{ flex: 1 }}
              onClick={() => setGender("male")}
            >
              남성
            </button>
          </div>
        </div>

        <div className="field">
          <span className="label">생년월일</span>
          <div className="input-row">
            <input required type="number" placeholder="YYYY" value={year} onChange={(e) => setYear(e.target.value)} />
            <input required type="number" placeholder="MM" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} />
            <input required type="number" placeholder="DD" min={1} max={31} value={day} onChange={(e) => setDay(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <span className="label">달력</span>
          <div className="input-row">
            <button
              type="button"
              className={`btn-secondary ${calendarType === "solar" ? "active" : ""}`}
              style={{ flex: 1 }}
              onClick={() => setCalendarType("solar")}
            >
              양력
            </button>
            <button
              type="button"
              className={`btn-secondary ${calendarType === "lunar" ? "active" : ""}`}
              style={{ flex: 1 }}
              onClick={() => setCalendarType("lunar")}
            >
              음력
            </button>
          </div>
          {calendarType === "lunar" && (
            <label style={{ display: "flex", gap: 8, marginTop: 12, fontSize: 14 }}>
              <input type="checkbox" checked={isLeapMonth} onChange={(e) => setIsLeapMonth(e.target.checked)} />
              윤달
            </label>
          )}
        </div>

        <div className="field">
          <span className="label">출생시간</span>
          <div className="input-row">
            <input
              type="number"
              min={0}
              max={23}
              disabled={!birthTimeKnown}
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            />
            <span style={{ alignSelf: "center" }}>:</span>
            <input
              type="number"
              min={0}
              max={59}
              disabled={!birthTimeKnown}
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
            />
          </div>
          <label style={{ display: "flex", gap: 8, marginTop: 12, fontSize: 14 }}>
            <input
              type="checkbox"
              checked={!birthTimeKnown}
              onChange={(e) => setBirthTimeKnown(!e.target.checked)}
            />
            출생시간을 몰라요
          </label>
        </div>

        <div className="field">
          <span className="label">출생지역</span>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {error && <p style={{ color: "#b44" }}>{error}</p>}

        <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
          내 사주 확인하기
        </button>
      </form>
    </main>
  );
}
