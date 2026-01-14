# Pixel

stash 프로젝트의 프론트엔드 애플리케이션

## Recent Changes

[![v0.0.11](https://img.shields.io/badge/v0.0.11-purple)](./docs/CHANGELOG.md#v0011) `2026.01.15 01:30`
- `portfolio` 명령어 추가 (stash API 연동)
- lib/portfolio.ts 추가 (타입 정의 및 API 함수)
- 회사별 프로젝트 그룹핑 및 Task 목록 표시
- fetchProjects, fetchProjectById API 함수 구현

[![v0.0.10](https://img.shields.io/badge/v0.0.10-gray)](./docs/CHANGELOG.md#v0010) `2026.01.15 00:30`
- Health API: `/internal/status` → `/internals/status`
- Calendar API: `/api/calendar/events` → `/externals/calendar/events`

[![v0.0.9](https://img.shields.io/badge/v0.0.9-gray)](./docs/CHANGELOG.md#v009) `2026.01.14 17:30`
- `data/resume.json` 추가 (정적 이력서 데이터)
- 프로필, 경력, 기술 스택, 학력, 자격증, 활동 정보 포함
- 동적 작업 이력은 stash 백엔드(MongoDB)에서 관리


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
