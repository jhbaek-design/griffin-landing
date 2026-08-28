# GRIFFIN PMS by FASTFIVE — 헬스체크 랜딩페이지

단일 HTML 파일(`griffin_landing_v2_updated.html`)을 유지보수 가능한 정적 사이트 프로젝트로
리팩토링한 결과물입니다. 빌드 도구는 별도 프레임워크 없이 **Vite(정적 사이트 모드)** 를 사용해
"소스 분리 + public 폴더 자산 서빙"을 가장 단순하게 구현했습니다.

## 1. 디렉토리 구조

```
griffin-landing/
├── index.html                 # 본문 마크업만 존재 (CSS/JS는 외부 파일 참조)
├── src/
│   ├── css/style.css           # 원본 <style> 전체를 이관
│   └── js/main.js              # moveSlider / updateCounter 슬라이더 로직
├── public/
│   └── images/                 # 18개 원본 이미지 (README.md에 파일 목록 명시)
├── vite.config.js              # publicDir="public" → /images/* 로 자동 노출
├── package.json
├── vercel.json                 # Vercel 배포 설정
├── .github/workflows/deploy.yml# GitHub Actions → Vercel 자동 배포
└── .gitignore
```

## 2. 이미지 경로 처리

- `public/images/` 에 넣은 파일은 Vite 컨벤션에 따라 빌드 시 **그대로 `/images/파일명`** 경로로
  노출됩니다. 즉 `public/images/공실관리1.png` → 배포 후 `https://도메인/images/공실관리1.png`.
- `index.html`의 모든 `<img src="공실관리1.png">` 는 `<img src="/images/공실관리1.png">` 형태로
  일괄 수정했습니다.
- 슬라이드 카드(`.bs-card img`)는 요구사항대로 `height:auto`를 유지했고 `object-fit`은 추가하지
  않아 원본 종횡비가 그대로 보이도록 두었습니다. 세부 지침은 `public/images/README.md` 참고.
- CDN으로 전환 시에는 `src` 값만 CDN 절대경로로 교체하면 되고, 마크업/레이아웃 변경은 필요 없습니다.

## 3. 링크(URL) 점검 결과

| 위치 | URL | 처리 |
|---|---|---|
| 상단 내비게이션 "무료 진단 신청" | `#signup-form` | 내부 앵커 유지 (동일 페이지 내 `id="signup-form"` 섹션 추가 시 정상 스크롤) |
| Hero "로그인" | `https://griffin.fastfive.co.kr/` | 외부 링크 → `target="_blank" rel="noopener noreferrer"` 추가 |
| Track 01 "GRIFFIN 살펴보기" | `https://griffin.fastfive.co.kr/` | 동일 처리 |
| Track 02/03 "상담" 링크 | `https://buildingsolution.co.kr/contact` | 동일 처리 |
| GRIFFIN 솔루션 슬라이더 "GRIFFIN 도입 문의" | `https://griffin.fastfive.co.kr/` | 동일 처리 |
| 개발/자산 슬라이더 "무료 상담" | `https://buildingsolution.co.kr/contact` | 동일 처리 |
| Final CTA | `#signup-form` | 내부 앵커 유지 |

> ⚠️ 참고: 현재 마크업 어디에도 `id="signup-form"` 요소가 실제로 존재하지 않습니다.
> 버튼 4곳이 모두 `#signup-form`을 가리키고 있으므로, 실제 가입 폼 섹션(또는 모달)을 추가하고
> 해당 섹션에 `id="signup-form"`을 부여해야 앵커가 정상 동작합니다. 프로덕션 배포 전 확인이
> 필요한 유일한 기능적 이슈입니다.

## 4. 렌더링/반응형 점검

- 폰트: Pretendard(가변 폰트, jsDelivr subset), Noto Serif KR 모두 `rel="preconnect"` 유지.
  추가로 폰트 로딩 지연을 더 줄이려면 Noto Serif KR도 자체 subset(예: 한글 완성형 2,350자 대신
  실제 사용 글자만 subset)으로 교체하는 것을 권장합니다.
- 슬라이더: `.bs-track-container`에 `scroll-snap-type: x mandatory`, `.bs-card`에
  `scroll-snap-align: start`를 추가해 터치 스와이프 시 카드 단위로 자연스럽게 스냅되도록
  보정했습니다. 모바일(`max-width:560px`)에서는 카드 폭을 뷰포트의 84%로 재계산하여
  버튼 클릭 시 스크롤 이동량(`main.js`의 `getCardWidth()`)도 함께 대응하도록 처리했습니다.

## 5. 로컬 개발 / 빌드

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 에 정적 산출물 생성
npm run preview  # 빌드 결과 로컬 프리뷰
```

## 6. 배포 파이프라인 (GitHub Actions → Vercel)

`. github/workflows/deploy.yml` 은 다음과 같이 동작합니다.

- `main` 브랜치로 **push** → 프로덕션 배포
- `main`을 대상으로 한 **Pull Request** → 프리뷰 배포

### 사전 준비 (1회)

1. [Vercel](https://vercel.com)에서 새 프로젝트를 생성하고(로컬에서 `vercel link` 실행해도 됩니다),
   `Org ID` / `Project ID`를 확인합니다.
2. Vercel 계정 설정에서 **Personal Access Token** 발급.
3. GitHub 저장소 **Settings → Secrets and variables → Actions** 에 아래 3개 Secret 등록:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

이후 `main`에 push하면 워크플로우가 `npm ci → vercel build → vercel deploy --prod` 순서로
자동 실행되어 프로덕션에 반영됩니다.

### 대안: Netlify를 사용하는 경우

Vercel 대신 Netlify를 쓴다면 `vercel.json` 대신 아래와 같은 `netlify.toml`을 루트에 추가하고,
GitHub Actions 대신 Netlify의 Git 연동(Push 시 자동 빌드)을 사용하는 것이 더 간단합니다.

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 7. 배포 전 체크리스트

- [ ] `public/images/`에 실제 이미지 18개(파일명 정확히 일치) 업로드
- [ ] `#signup-form` 섹션(가입 폼) 실제 구현 후 앵커 연결 확인
- [ ] `VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` GitHub Secrets 등록
- [ ] `npm run build && npm run preview`로 로컬에서 최종 산출물 육안 점검
- [ ] 모바일(360px), 태블릿(768px), 데스크톱(1440px) 3개 뷰포트에서 슬라이더 스와이프 테스트
