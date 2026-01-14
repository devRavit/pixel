export type CompanyType = 'NOL_UNIVERSE' | 'MINERVA_SOFT' | 'PERSONAL'
export type TaskType = 'FEATURE' | 'IMPROVEMENT' | 'BUG_FIX' | 'REFACTORING' | 'RESEARCH' | 'DOCUMENTATION'

export interface Period {
  startedAt: string | null
  endedAt: string | null
}

export interface TaskDetails {
  background: string | null
  solution: string | null
  impact: string | null
}

export interface Task {
  id: string
  projectId: string
  type: TaskType
  title: string
  description: string | null
  period: Period | null
  workingDays: number | null
  details: TaskDetails | null
  keywords: string[]
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  company: CompanyType
  name: string
  summary: string
  period: Period | null
  techStack: string[]
  achievements: string[]
  teamSize: number | null
  role: string | null
  tasks: Task[] | null
  createdAt: string
  updatedAt: string
}

export const companyDisplayName: Record<CompanyType, string> = {
  NOL_UNIVERSE: 'NOL Universe (인터파크트리플)',
  MINERVA_SOFT: '미네르바소프트',
  PERSONAL: '개인 프로젝트',
}

export const taskTypeDisplayName: Record<TaskType, string> = {
  FEATURE: '신규 기능',
  IMPROVEMENT: '개선',
  BUG_FIX: '버그 수정',
  REFACTORING: '리팩토링',
  RESEARCH: '조사/분석',
  DOCUMENTATION: '문서화',
}

export async function fetchProjects(includeTasks = true): Promise<Project[]> {
  const url = process.env.NEXT_PUBLIC_STASH_API_URL

  if (!url) {
    throw new Error('STASH_API_URL is not configured')
  }

  const res = await fetch(`${url}/externals/projects?includeTasks=${includeTasks}`, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status}`)
  }

  return res.json()
}

export async function fetchProjectById(id: string, includeTasks = true): Promise<Project | null> {
  const url = process.env.NEXT_PUBLIC_STASH_API_URL

  if (!url) {
    throw new Error('STASH_API_URL is not configured')
  }

  const res = await fetch(`${url}/externals/projects/${id}?includeTasks=${includeTasks}`, {
    next: { revalidate: 300 },
  })

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch project: ${res.status}`)
  }

  return res.json()
}

export function formatPeriod(period: Period | null): string {
  if (!period) return ''
  const start = period.startedAt ? period.startedAt.substring(0, 7).replace('-', '.') : ''
  const end = period.endedAt ? period.endedAt.substring(0, 7).replace('-', '.') : '현재'
  return `${start} ~ ${end}`
}
