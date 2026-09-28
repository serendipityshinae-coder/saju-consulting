# Vector Store 업로드 안내

1. OpenAI Dashboard에서 Vector Store를 생성합니다.
2. `data/knowledge/` 아래 Markdown 파일을 업로드합니다.
3. 생성된 Vector Store ID를 `.env.local`의 `OPENAI_VECTOR_STORE_ID`에 설정합니다.

File Search가 연결되면 `/api/chat`에서 해당 지식을 검색합니다.
Vector Store가 없어도 SAJU_DATA 기반 상담은 동작합니다.
