# Pixel

stash 프로젝트의 프론트엔드 애플리케이션

## Recent Changes

[![v0.0.6](https://img.shields.io/badge/v0.0.6-purple)](./docs/CHANGELOG.md#v006) `2025.11.30 15:00`
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

[![v0.0.4](https://img.shields.io/badge/v0.0.4-gray)](./docs/CHANGELOG.md#v004) `2025.11.30 04:00`
- DEGRADED 상태 UI 추가 (노란색 배지)
- MongoDB 노드 상태 표시 (PRIMARY/SECONDARY/ARBITER)
- `DependencyCard` 컴포넌트로 dependency 상태 표시


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
