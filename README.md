# Pixel

stash 프로젝트의 프론트엔드 애플리케이션

## Recent Changes

[![v0.0.8](https://img.shields.io/badge/v0.0.8-purple)](./docs/CHANGELOG.md#v008) `2025.12.03 01:30`
- `resume` 명령어 추가 (vim 스타일 이력서 뷰어)
- VimViewer 컴포넌트 구현 (j/k, ↑/↓, PgUp/Dn, Home/End 키보드 네비게이션)
- 한글 입력 상태에서도 단축키 동작하도록 `e.code` 사용
- 회사명 브랜드 컬러 그라데이션 적용 (NOL Universe, 미네르바소프트)
- 파비콘 추가 (`{/}` 코드 아이콘)
- 메타데이터 업데이트 (title: ravit.run, description 변경)

[![v0.0.7](https://img.shields.io/badge/v0.0.7-gray)](./docs/CHANGELOG.md#v007) `2025.11.30 16:30`
- 404 Not Found 페이지 추가 (터미널 스타일 UI)
- 500 Error 페이지 추가 (retry 버튼, 5초 카운트다운)
- Global Error 페이지 추가 (root layout 에러 처리)
- 에러 발생 시 자동 리다이렉트 (같은 도메인이면 뒤로가기, 아니면 홈으로)
- 터미널 한글 입력 시 너비 계산 수정 (charCode > 127 = 2ch)

[![v0.0.6](https://img.shields.io/badge/v0.0.6-gray)](./docs/CHANGELOG.md#v006) `2025.11.30 15:00`
- Tab/→/Enter 키로 명령어 자동완성
- 힌트 목록 세로 표시 (여러 개일 때)
- ↑/↓ 키로 힌트 목록 탐색
- 1글자: 단일 매칭만 힌트 표시, 2글자+: 모든 매칭 표시
- status 명령어 API 파싱 수정 (`services` 배열 순회)
- 힌트 표시 시 터미널 자동 스크롤


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
