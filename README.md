# Pixel

stash 프로젝트의 프론트엔드 애플리케이션

## Recent Changes

[![v0.0.3](https://img.shields.io/badge/v0.0.3-purple)](./docs/CHANGELOG.md#v003) `2025.11.30 01:00`
- `/status` 페이지 추가 (GitHub Status 스타일 UI)
- `StatusBar` 컴포넌트 추가 (이슈 발생 시에만 상단에 노출)
- `/api/health` 엔드포인트 추가
- ISR(Incremental Static Regeneration) 적용 - 5분마다 서버 자동 갱신
- Stash API `/internal/status` 엔드포인트 연동

[![v0.0.2](https://img.shields.io/badge/v0.0.2-gray)](./docs/CHANGELOG.md#v002) `2025.11.27 01:00`
- Next.js 15 App Router 구조로 전환
- SSR 기반 Health Check API 호출 구현
- ESLint flat config (TypeScript) 적용

[![v0.0.1](https://img.shields.io/badge/v0.0.1-gray)](./docs/CHANGELOG.md#v001) `2025.11.26 22:00`
- Vite + React + TypeScript 템플릿 기반 생성
- Node.js 25.x 환경 설정
- README.md, CHANGELOG.md 작성


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
