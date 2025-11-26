# Pixel

stash 프로젝트의 프론트엔드 애플리케이션

## Recent Changes

| Version | Date | Description |
|:-------:|:----:|:------------|
| ![v0.0.2](https://img.shields.io/badge/v0.0.2-purple) | 2025-11-27 | Next.js 15 마이그레이션 |
| ![v0.0.1](https://img.shields.io/badge/v0.0.1-gray) | 2025-11-26 | React 19 + Vite 7 프로젝트 생성 |

> 전체 변경 내역은 [CHANGELOG](./docs/CHANGELOG.md)를 참조하세요.

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
