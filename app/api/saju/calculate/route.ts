import { calculateSaju } from "@/lib/saju/calculator";
import { parseBirthInput } from "@/lib/saju/validate";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = parseBirthInput(body);
    const data = calculateSaju(input);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "사주 계산에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
