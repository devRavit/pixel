import { checkStashHealth, getOverallStatus, getPixelVersion, ServiceHealth } from '@/app/lib/health'
import Link from 'next/link'

// ISR: 5분마다 서버에서 자동 갱신
export const revalidate = 300

export const metadata = {
  title: 'Status - Pixel',
  description: 'System status for Pixel and connected services',
}

const statusStyles = {
  UP: {
    bg: 'bg-green-500',
    text: 'text-green-700',
    bgLight: 'bg-green-50',
    label: 'Operational',
  },
  DOWN: {
    bg: 'bg-red-500',
    text: 'text-red-700',
    bgLight: 'bg-red-50',
    label: 'Outage',
  },
  UNKNOWN: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-700',
    bgLight: 'bg-yellow-50',
    label: 'Unknown',
  },
}

const overallStyles = {
  operational: {
    bg: 'bg-green-500',
    text: 'text-green-800',
    bgLight: 'bg-green-100',
    label: 'All Systems Operational',
    icon: '✓',
  },
  degraded: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-800',
    bgLight: 'bg-yellow-100',
    label: 'Partial System Outage',
    icon: '!',
  },
  outage: {
    bg: 'bg-red-500',
    text: 'text-red-800',
    bgLight: 'bg-red-100',
    label: 'Major System Outage',
    icon: '✕',
  },
}

interface ServiceCardProps {
  service: ServiceHealth
  techStack?: string
}

function ServiceCard({ service, techStack }: ServiceCardProps) {
  const style = statusStyles[service.status]

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${style.bg}`} />
        <div>
          <h3 className="font-medium text-slate-900">{service.name}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {service.version && <span>v{service.version}</span>}
            {techStack && <span className="text-slate-400">({techStack})</span>}
          </div>
        </div>
      </div>
      <div className="text-right">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bgLight} ${style.text}`}>
          {style.label}
        </span>
        {service.responseTime !== undefined && (
          <p className="mt-1 text-xs text-slate-400">{service.responseTime}ms</p>
        )}
      </div>
    </div>
  )
}

export default async function StatusPage() {
  const stashHealth = await checkStashHealth()
  const pixelVersion = getPixelVersion()

  const overall = getOverallStatus([stashHealth])
  const overallStyle = overallStyles[overall]

  // ISR이 페이지 생성 시점을 기록
  const lastUpdated = new Date().toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Pixel Status</span>
          </Link>
          <a
            href="https://github.com/devRavit/pixel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Overall Status Banner */}
      <div className={`${overallStyle.bgLight}`}>
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${overallStyle.bg} text-xl font-bold text-white`}>
              {overallStyle.icon}
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${overallStyle.text}`}>
                {overallStyle.label}
              </h1>
              <p className="text-sm text-slate-600">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Services</h2>
        <div className="space-y-3">
          <ServiceCard
            service={{
              name: 'Pixel (Frontend)',
              status: 'UP',
              version: pixelVersion,
            }}
            techStack="Next.js 15, React 19"
          />
          <ServiceCard
            service={stashHealth}
            techStack="Spring Boot 4, Kotlin"
          />
        </div>

        {/* Error Details */}
        {stashHealth.error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="font-medium text-red-800">Error Details</h3>
            <p className="mt-1 text-sm text-red-700">{stashHealth.error}</p>
            {stashHealth.url && (
              <p className="mt-1 text-xs text-red-500">Endpoint: {stashHealth.url}/internal/status</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Powered by Pixel</span>
            <Link href="/" className="hover:text-slate-700">
              Back to Home
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
