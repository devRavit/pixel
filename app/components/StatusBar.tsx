'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

type OverallStatus = 'operational' | 'degraded' | 'outage' | 'loading'

// polling 주기: 정상이면 10분, 이슈 있으면 5분
const POLL_INTERVAL_HEALTHY = 10 * 60 * 1000 // 10분
const POLL_INTERVAL_UNHEALTHY = 5 * 60 * 1000 // 5분

const statusConfig = {
  operational: {
    bg: 'bg-green-500',
    text: 'text-green-700',
    bgLight: 'bg-green-50',
    label: 'All Systems Operational',
  },
  degraded: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-700',
    bgLight: 'bg-yellow-50',
    label: 'Partial System Outage',
  },
  outage: {
    bg: 'bg-red-500',
    text: 'text-red-700',
    bgLight: 'bg-red-50',
    label: 'Major System Outage',
  },
  loading: {
    bg: 'bg-slate-400',
    text: 'text-slate-600',
    bgLight: 'bg-slate-50',
    label: 'Checking Status...',
  },
}

interface StatusBarProps {
  initialStatus?: OverallStatus
}

export default function StatusBar({ initialStatus = 'loading' }: StatusBarProps) {
  const [status, setStatus] = useState<OverallStatus>(initialStatus)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/health', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const newStatus = data.overall as OverallStatus
        setStatus(newStatus)

        // 상태에 따라 다음 polling 주기 설정
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        const nextInterval = newStatus === 'operational' ? POLL_INTERVAL_HEALTHY : POLL_INTERVAL_UNHEALTHY
        intervalRef.current = setInterval(checkStatus, nextInterval)
      } catch {
        setStatus('degraded')
        // 에러 시 5분 주기로 재시도
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        intervalRef.current = setInterval(checkStatus, POLL_INTERVAL_UNHEALTHY)
      }
    }

    checkStatus()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // 정상이거나 로딩 중이면 숨김
  if (status === 'operational' || status === 'loading') {
    return null
  }

  const config = statusConfig[status]

  return (
    <Link href="/status" className="block">
      <div className={`${config.bgLight} border-b border-slate-200`}>
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 py-1.5 sm:px-6 lg:px-8">
          <span className={`h-2 w-2 rounded-full ${config.bg}`} />
          <span className={`text-xs font-medium ${config.text}`}>
            {config.label}
          </span>
          <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
