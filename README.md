# 사주 상담소 (AI 사주 상담 MVP)

Next.js + TypeScript 사주 계산 엔진과 OpenAI 상담을 결합한 웹 서비스입니다.

## 실행

```bash
npm install
cp .env.local.example .env.local
# OPENAI_API_KEY, OPENAI_VECTOR_STORE_ID (선택) 설정
npm run dev
```

## 테스트

```bash
npm test
```

사주 엔진은 `lunar-javascript`와 교차 검증 테스트를 포함합니다. `tests/reference-saju.json`에 기준 케이스를 추가할 수 있습니다.

## Vector Store

`data/knowledge/` Markdown을 OpenAI Vector Store에 업로드한 뒤 `OPENAI_VECTOR_STORE_ID`를 설정하세요. 자세한 내용은 [scripts/upload-knowledge.md](scripts/upload-knowledge.md)를 참고하세요.

## 아키텍처

- 사주 계산: `lib/saju/*` (OpenAI는 계산하지 않음)
- 상담: `app/api/chat` → Responses API + File Search(선택)
