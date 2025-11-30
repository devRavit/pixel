'use client'

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ko">
      <body className="bg-[#0d1117]">
        <main className="flex h-screen items-center justify-center text-[#c9d1d9]">
          <div className="w-full max-w-md rounded-lg border border-[#30363d] bg-[#161b22] shadow-2xl sm:mx-4">
            <div className="flex items-center gap-2 border-b border-[#30363d] bg-[#21262d] px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
              <span className="ml-4 font-mono text-xs text-[#8b949e]">error — fatal</span>
            </div>
            <div className="p-6 font-mono text-sm">
              <div>
                <span className="text-[#7ee787]">~</span>
                <span className="text-[#8b949e]"> $ </span>
                <span>./init</span>
              </div>
              <div className="mt-2 text-[#f85149]">
                Fatal: Application crashed
              </div>
              <div className="mt-4">
                <button
                  onClick={reset}
                  className="text-[#58a6ff] hover:underline"
                >
                  [restart]
                </button>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
