import OpenAI from "openai";

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해주세요.");
  }
  return new OpenAI({ apiKey });
}

export function getVectorStoreId(): string | undefined {
  const id = process.env.OPENAI_VECTOR_STORE_ID;
  return id?.trim() || undefined;
}
