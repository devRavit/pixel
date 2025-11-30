# Pixel

stash 프로젝트의 프론트엔드 애플리케이션

## Recent Changes

[![v0.0.5](https://img.shields.io/badge/v0.0.5-purple)](./docs/CHANGELOG.md#v005) `2025.11.30 14:20`
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

[![v0.0.3](https://img.shields.io/badge/v0.0.3-gray)](./docs/CHANGELOG.md#v003) `2025.11.30 01:00`
- `/status` 페이지 추가 (GitHub Status 스타일 UI)
- `StatusBar` 컴포넌트 추가 (이슈 발생 시에만 상단에 노출)
- `/api/health` 엔드포인트 추가
- ISR(Incremental Static Regeneration) 적용 - 5분마다 서버 자동 갱신
- Stash API `/internal/status` 엔드포인트 연동


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
