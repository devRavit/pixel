# Pixel

stash 프로젝트의 프론트엔드 애플리케이션

## Recent Changes

[![v0.0.7](https://img.shields.io/badge/v0.0.7-purple)](./docs/CHANGELOG.md#v007) `2025.11.30 16:30`
- 404 Not Found 페이지 추가 (터미널 스타일 UI)
- 500 Error 페이지 추가 (retry 버튼, 5초 카운트다운)
- Global Error 페이지 추가 (root layout 에러 처리)
- 에러 발생 시 자동 리다이렉트 (같은 도메인 = 뒤로가기, 외부 = 홈으로)
- 터미널 한글 입력 시 너비 계산 수정

[![v0.0.6](https://img.shields.io/badge/v0.0.6-gray)](./docs/CHANGELOG.md#v006) `2025.11.30 15:00`
- Tab/→/Enter 키로 명령어 자동완성
- 힌트 목록 세로 표시 (여러 개일 때)
- ↑/↓ 키로 힌트 목록 탐색
- 1글자: 단일 매칭만 힌트 표시, 2글자+: 모든 매칭 표시
- status 명령어 API 파싱 수정 (`services` 배열 순회)
- 힌트 표시 시 터미널 자동 스크롤

[![v0.0.5](https://img.shields.io/badge/v0.0.5-gray)](./docs/CHANGELOG.md#v005) `2025.11.30 14:20`
- 터미널에서 명령어 입력 가능 (`help`, `whoami`, `status`, `open --github`, `open --work`, `clear`)
- `status` 명령어로 시스템 상태 인라인 표시 (MongoDB 노드 포함)
- 명령어 히스토리 저장 및 화살표 키(↑/↓)로 탐색
- 터미널 클릭 시 입력창 자동 포커스
- 터미널 내부 스크롤로 변경
- 비동기 명령어 실행 시 로딩 상태 표시
- StatusBar 컴포넌트 제거 (터미널로 통합)
- `/status` 페이지 제거 (터미널로 통합)

[![v0.0.4](https://img.shields.io/badge/v0.0.4-gray)](./docs/CHANGELOG.md#v004) `2025.11.30 04:00`
- DEGRADED 상태 UI 추가 (노란색 배지)
- MongoDB 노드 상태 표시 (PRIMARY/SECONDARY/ARBITER)
- `DependencyCard` 컴포넌트로 dependency 상태 표시
- 노드 상태 3열 그리드 레이아웃, PRIMARY 우선 정렬
- Health response 타입 정의 개선 (`StashHealthResponse`, `DependencyHealth`)


[전체 변경 내역 →](./docs/CHANGELOG.md)

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript 5.9
- **Node.js**: 25.x
- **Deploy**: Vercel

## Getting Started

### Prerequisites

- Node.js 25.x

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Start

```bash
npm run start
```

## Project Structure

```
app/
├── layout.tsx       # 루트 레이아웃
├── page.tsx         # 메인 페이지
└── ...
```

## Environment Variables

| Name | Description |
|------|-------------|
| `NEXT_PUBLIC_STASH_API_URL` | Stash API URL |

## Related Projects

- [stash](https://github.com/devRavit/stash) - 백엔드 API 서비스
