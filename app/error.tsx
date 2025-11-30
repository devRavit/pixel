'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    console.error(error)
  }, [error])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
            router.back()
          } else {
            router.push('/')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <main className="flex h-screen items-center justify-center bg-[#0d1117] text-[#c9d1d9]">
      <div className="w-full max-w-md rounded-lg border border-[#30363d] bg-[#161b22] shadow-2xl sm:mx-4">
        <div className="flex items-center gap-2 border-b border-[#30363d] bg-[#21262d] px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-4 font-mono text-xs text-[#8b949e]">error — 500</span>
        </div>
        <div className="p-6 font-mono text-sm">
          <div>
            <span className="text-[#7ee787]">~</span>
            <span className="text-[#8b949e]"> $ </span>
            <span>./run</span>
          </div>
          <div className="mt-2 text-[#f85149]">
            Error: Something went wrong
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={reset}
              className="text-[#58a6ff] hover:underline"
            >
              [retry]
            </button>
            <span className="text-[#8b949e]">Redirecting in {countdown}...</span>
          </div>
        </div>
      </div>
    </main>
  )
}
