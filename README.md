# 사주 상담소 (AI 사주 상담 MVP)

Next.js + TypeScript 사주 계산 엔진과 OpenAI 상담을 결합한 웹 서비스입니다.

## 배포 (Vercel)

- GitHub 저장소: `serendipityshinae-coder/saju-consulting`
- Vercel **프로젝트 이름(권장)**: `saju-sangdamso-mvp`  
  → 배포 URL 예: `https://saju-sangdamso-mvp.vercel.app` 또는  
  `https://saju-sangdamso-mvp-serendipityshinae-coder.vercel.app`
- **`https://saju-consulting.vercel.app`는 다른 사람(팔자핏) 사이트**이므로 사용하지 마세요.

Vercel 대시보드 → 해당 프로젝트 → **Settings → General → Project Name**을 `saju-sangdamso-mvp`로 저장하면 도메인이 갱신됩니다.

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
