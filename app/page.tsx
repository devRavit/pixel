async function getHealth() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STASH_API_URL}/health`,
      { cache: 'no-store' }
    )
    if (!res.ok) throw new Error('API error')
    return await res.json()
  } catch (error) {
    return { status: 'ERROR', error: String(error) }
  }
}

export default async function Home() {
  const health = await getHealth()
  const isHealthy = health.status === 'UP'

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Pixel</span>
          </div>
          <nav className="flex items-center gap-4 sm:gap-6">
            <a
              href="https://github.com/devRavit/pixel/pulls"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              PRs
            </a>
            <a
              href="https://github.com/devRavit/stash/pulls"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              Stash PRs
            </a>
            <a
              href="https://github.com/devRavit/pixel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Pixel
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 sm:mt-6 sm:text-xl">
            Stash API를 위한 프론트엔드 애플리케이션
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com/devRavit/stash"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Stash API 보기
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Status Card */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Health Check Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500">API 상태</h3>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isHealthy
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isHealthy ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  {isHealthy ? 'Online' : 'Offline'}
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {health.service || 'Unknown'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                서비스가 {isHealthy ? '정상 작동 중입니다' : '응답하지 않습니다'}
              </p>
            </div>

            {/* Tech Stack Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="text-sm font-medium text-slate-500">프론트엔드</h3>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Next.js 15</p>
              <p className="mt-1 text-sm text-slate-500">
                React 19 + TypeScript + Tailwind
              </p>
            </div>

            {/* Backend Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
              <h3 className="text-sm font-medium text-slate-500">백엔드</h3>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Spring Boot 4</p>
              <p className="mt-1 text-sm text-slate-500">
                Kotlin + MongoDB + AWS App Runner
              </p>
            </div>
          </div>

          {/* API Response */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-500">API Response</h3>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600">
                GET /health
              </span>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
              <code>{JSON.stringify(health, null, 2)}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              &copy; 2025 Pixel. Built with Next.js
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/devRavit/pixel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-500 transition-colors hover:text-slate-700"
              >
                GitHub
              </a>
              <a
                href="https://github.com/devRavit/stash"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-500 transition-colors hover:text-slate-700"
              >
                Stash API
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
