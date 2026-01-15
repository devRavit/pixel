# Pixel

stash 프로젝트의 프론트엔드 애플리케이션

## Recent Changes

[![v0.0.12](https://img.shields.io/badge/v0.0.12-purple)](./docs/CHANGELOG.md#v0012) `2026.01.16 00:30`
- `/ai` 라우트에 터미널 스타일 AI 채팅 인터페이스 추가
- Stash API 연동 (세션 관리, 대화 기록 유지)
- localStorage 기반 clientId로 세션 식별
- react-markdown + react-syntax-highlighter로 마크다운 렌더링
- 코드 블록 구문 강조 (vscDarkPlus 테마)
- 429 Rate Limit 에러 시 친근한 에러 메시지 표시
- Welcome 배너 ASCII 아트 추가

[![v0.0.11](https://img.shields.io/badge/v0.0.11-gray)](./docs/CHANGELOG.md#v0011) `2026.01.15 01:30`
- `portfolio` 명령어 추가 (stash API 연동)
- lib/portfolio.ts 추가 (타입 정의 및 API 함수)
- 회사별 프로젝트 그룹핑 및 Task 목록 표시
- fetchProjects, fetchProjectById API 함수 구현

[![v0.0.10](https://img.shields.io/badge/v0.0.10-gray)](./docs/CHANGELOG.md#v0010) `2026.01.15 00:30`
- Health API: `/internal/status` → `/internals/status`
- Calendar API: `/api/calendar/events` → `/externals/calendar/events`


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
