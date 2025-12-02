# Changelog

프로젝트 변경 내역 (최신순)

<!-- CHANGELOG_START -->

## v0.0.8
`2025.12.03 01:30`

resume 명령어 및 브랜딩 업데이트

- `resume` 명령어 추가 (vim 스타일 이력서 뷰어)
- VimViewer 컴포넌트 구현 (j/k, ↑/↓, PgUp/Dn, Home/End 키보드 네비게이션)
- 한글 입력 상태에서도 단축키 동작하도록 `e.code` 사용
- 회사명 브랜드 컬러 그라데이션 적용 (NOL Universe, 미네르바소프트)
- 파비콘 추가 (`{/}` 코드 아이콘)
- 메타데이터 업데이트 (title: ravit.run, description 변경)

---

## v0.0.7
`2025.11.30 16:30`

에러 페이지 추가 및 한글 입력 너비 수정

- 404 Not Found 페이지 추가 (터미널 스타일 UI)
- 500 Error 페이지 추가 (retry 버튼, 5초 카운트다운)
- Global Error 페이지 추가 (root layout 에러 처리)
- 에러 발생 시 자동 리다이렉트 (같은 도메인이면 뒤로가기, 아니면 홈으로)
- 터미널 한글 입력 시 너비 계산 수정 (charCode > 127 = 2ch)

---

## v0.0.6
`2025.11.30 15:00`

터미널 명령어 자동완성 기능 추가

- Tab/→/Enter 키로 명령어 자동완성
- 힌트 목록 세로 표시 (여러 개일 때)
- ↑/↓ 키로 힌트 목록 탐색
- 1글자: 단일 매칭만 힌트 표시, 2글자+: 모든 매칭 표시
- status 명령어 API 파싱 수정 (`services` 배열 순회)
- 힌트 표시 시 터미널 자동 스크롤

---

## v0.0.5
`2025.11.30 14:20`

인터랙티브 터미널 프롬프트 추가

- 터미널에서 명령어 입력 가능 (`help`, `whoami`, `status`, `open --github`, `open --work`, `clear`)
- `status` 명령어로 시스템 상태 인라인 표시 (MongoDB 노드 포함)
- 명령어 히스토리 저장 및 화살표 키(↑/↓)로 탐색
- 터미널 클릭 시 입력창 자동 포커스
- 터미널 내부 스크롤로 변경
- 비동기 명령어 실행 시 로딩 상태 표시
- StatusBar 컴포넌트 제거 (터미널로 통합)
- `/status` 페이지 제거 (터미널로 통합)

---

## v0.0.4
`2025.11.30 04:00`

Status 페이지 Health Check UI 개선

- DEGRADED 상태 UI 추가 (노란색 배지)
- MongoDB 노드 상태 표시 (PRIMARY/SECONDARY/ARBITER)
- `DependencyCard` 컴포넌트로 dependency 상태 표시
- 노드 상태 3열 그리드 레이아웃, PRIMARY 우선 정렬
- Health response 타입 정의 개선 (`StashHealthResponse`, `DependencyHealth`)

---

## v0.0.3
`2025.11.30 01:00`

Status 페이지 및 Health Check 모니터링 기능 추가

- `/status` 페이지 추가 (GitHub Status 스타일 UI)
- `StatusBar` 컴포넌트 추가 (이슈 발생 시에만 상단에 노출)
- `/api/health` 엔드포인트 추가
- ISR(Incremental Static Regeneration) 적용 - 5분마다 서버 자동 갱신
- Stash API `/internal/status` 엔드포인트 연동

---

## v0.0.2
`2025.11.27 01:00`

Next.js 15 마이그레이션

- Next.js 15 App Router 구조로 전환
- SSR 기반 Health Check API 호출 구현
- ESLint flat config (TypeScript) 적용

---

## v0.0.1
`2025.11.26 22:00`

프로젝트 초기 설정

- Vite + React + TypeScript 템플릿 기반 생성
- Node.js 25.x 환경 설정
- README.md, CHANGELOG.md 작성

<!-- CHANGELOG_END -->
