export interface ServiceHealth {
  name: string
  status: 'UP' | 'DOWN' | 'UNKNOWN'
  version?: string
  responseTime?: number
  url?: string
  error?: string
}

export interface HealthResponse {
  status: string
  service?: string
  version?: string
  [key: string]: unknown
}

// 서버 메모리 캐시
let healthCache: {
  data: ServiceHealth | null
  timestamp: number
} = {
  data: null,
  timestamp: 0,
}

// 캐시 TTL: 정상이면 10분, 이슈 있으면 5분
const CACHE_TTL_HEALTHY = 10 * 60 * 1000 // 10분
const CACHE_TTL_UNHEALTHY = 5 * 60 * 1000 // 5분

export async function checkStashHealth(): Promise<ServiceHealth> {
  // 캐시가 유효하면 캐시된 데이터 반환
  const now = Date.now()
  if (healthCache.data) {
    const ttl = healthCache.data.status === 'UP' ? CACHE_TTL_HEALTHY : CACHE_TTL_UNHEALTHY
    if (now - healthCache.timestamp < ttl) {
      return healthCache.data
    }
  }

  const url = process.env.NEXT_PUBLIC_STASH_API_URL
  const startTime = Date.now()

  if (!url) {
    return {
      name: 'Stash API',
      status: 'UNKNOWN',
      error: 'API URL not configured',
    }
  }

  try {
    const res = await fetch(`${url}/internal/status`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    })

    const responseTime = Date.now() - startTime

    if (!res.ok) {
      return {
        name: 'Stash API',
        status: 'DOWN',
        responseTime,
        url,
        error: `HTTP ${res.status}`,
      }
    }

    const data: HealthResponse = await res.json()

    const result: ServiceHealth = {
      name: data.service || 'Stash API',
      status: data.status === 'UP' ? 'UP' : 'DOWN',
      version: data.version,
      responseTime,
      url,
    }

    // 캐시 저장
    healthCache = { data: result, timestamp: Date.now() }

    return result
  } catch (error) {
    return {
      name: 'Stash API',
      status: 'DOWN',
      responseTime: Date.now() - startTime,
      url,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export function getPixelVersion(): string {
  return process.env.npm_package_version || '0.0.2'
}

export function getLastUpdatedTimestamp(): number {
  return healthCache.timestamp
}

export function getOverallStatus(services: ServiceHealth[]): 'operational' | 'degraded' | 'outage' {
  const downCount = services.filter(s => s.status === 'DOWN').length
  const unknownCount = services.filter(s => s.status === 'UNKNOWN').length

  if (downCount === services.length) return 'outage'
  if (downCount > 0 || unknownCount > 0) return 'degraded'
  return 'operational'
}
