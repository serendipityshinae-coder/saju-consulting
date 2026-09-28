# Vercel 도메인 이름 바꾸기

`saju-consulting.vercel.app` 은 다른 서비스(팔자핏)가 쓰는 주소입니다.  
아래처럼 **본인 프로젝트 이름만** 바꾸면 됩니다.

## 1. 프로젝트 이름 변경 (1분)

1. [Vercel Dashboard](https://vercel.com/dashboard) 로그인
2. GitHub **`saju-consulting`** 과 연결된 프로젝트 선택
3. **Settings** → **General**
4. **Project Name** → `saju-sangdamso-mvp` 입력 → **Save**

## 2. 새 주소 확인

**Settings → Domains** 또는 **Deployments → Production → Visit**

- `https://saju-sangdamso-mvp.vercel.app` (비어 있으면 팀 도메인 사용)
- `https://saju-sangdamso-mvp-serendipityshinae-coder.vercel.app`

맨 위 **「🌙 사주 상담소」**, **「내 사주 보기」** 가 보이면 성공입니다.

## 3. (선택) 배포 보호 끄기

Visit 시 Vercel 로그인만 나오면:

**Settings → Deployment Protection** → Production 보호 해제 또는 Preview만 보호

## 4. 환경 변수

**Settings → Environment Variables**

- `OPENAI_API_KEY` (Production) — AI 상담용

변경 후 **Deployments → Redeploy** 한 번 실행.
