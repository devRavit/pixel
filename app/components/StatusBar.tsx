import Link from 'next/link'

type OverallStatus = 'operational' | 'degraded' | 'outage'

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
}

interface StatusBarProps {
  status: OverallStatus
}

export default function StatusBar({ status }: StatusBarProps) {
  // 정상이면 숨김
  if (status === 'operational') {
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
