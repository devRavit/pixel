export type HealthStatusType = 'UP' | 'DEGRADED' | 'DOWN'
export type DependencyType = 'MONGODB' | 'JIRA' | 'SLACK'
export type MongoNodeStateType = 'PRIMARY' | 'SECONDARY' | 'ARBITER' | 'UNKNOWN'

export interface MongoNodeHealth {
  state: MongoNodeStateType
  healthy: boolean
}

export interface MongoReplicaSetDetails {
  nodes: MongoNodeHealth[]
}

export interface MongoDBDetails {
  replicaSet: MongoReplicaSetDetails | null
}

export interface DependencyHealth {
  type: DependencyType
  status: HealthStatusType
  details?: MongoDBDetails
}

export interface StashHealthResponse {
  service: string
  version: string
  status: HealthStatusType
  dependencies: DependencyHealth[]
}

export interface ServiceHealth {
  name: string
  status: 'UP' | 'DOWN' | 'UNKNOWN'
  version?: string
  responseTime?: number
  url?: string
  error?: string
  dependencies?: DependencyHealth[]
}

export async function checkStashHealth(): Promise<ServiceHealth> {
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
    const res = await fetch(`${url}/internals/status`, {
      next: { revalidate: 300 },
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

    const data: StashHealthResponse = await res.json()

    return {
      name: data.service || 'Stash API',
      status: data.status === 'UP' ? 'UP' : 'DOWN',
      version: data.version,
      responseTime,
      url,
      dependencies: data.dependencies,
    }
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

export function getOverallStatus(services: ServiceHealth[]): 'operational' | 'degraded' | 'outage' {
  const downCount = services.filter(s => s.status === 'DOWN').length
  const unknownCount = services.filter(s => s.status === 'UNKNOWN').length

  if (downCount === services.length) return 'outage'
  if (downCount > 0 || unknownCount > 0) return 'degraded'
  return 'operational'
}
