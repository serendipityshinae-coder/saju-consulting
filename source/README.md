# source 미디어

이 폴더에 넣은 파일은 `npm run dev` / `npm run build` 시 `public/source/`로 복사됩니다.

| 파일 이름 (예) | 사용 위치 |
|----------------|-----------|
| `main_bg` (이미지 또는 mp4) | 메인 최상단 히어로 배경 |
| `하단_bg` / `하단bg` (이미지 또는 mp4) | 「지금 가장 궁금한 것은 무엇인가요?」 섹션 |
| `hero` (jpg/png…) | 「누구와 이야기하시겠어요?」 섹션 배경 이미지 |

영상은 음소거·자동 재생·무한 반복합니다.  
`sync:media` 시 `원본 + 역재생`을 이어 붙인 `*_loop.mp4`를 자동 생성합니다 (`ffmpeg-static` 포함). 화면에서는 이 파일만 `loop` 재생합니다 (원본→되감기→원본…).

수동 동기화: `npm run sync:media`  
loop 파일만 다시 만들기: `npm run build:loop-videos` (`--force`로 전부 재생성)
