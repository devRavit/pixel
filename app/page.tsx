'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Project,
  companyDisplayName,
  taskTypeDisplayName,
  formatPeriod,
} from './lib/portfolio'

type OverallStatus = 'operational' | 'degraded' | 'outage' | 'loading'

function StatusIndicator({ onClick }: { onClick?: () => void }) {
  const [status, setStatus] = useState<OverallStatus>('loading')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.overall))
      .catch(() => setStatus('outage'))
  }, [])

  const config = {
    loading: { color: 'bg-[#8b949e]', text: 'checking...' },
    operational: { color: 'bg-[#3fb950]', text: 'operational' },
    degraded: { color: 'bg-[#d29922]', text: 'degraded' },
    outage: { color: 'bg-[#f85149]', text: 'outage' },
  }

  const { color, text } = config[status]

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 font-mono text-xs text-[#8b949e] transition-colors hover:text-[#c9d1d9]"
    >
      <span className={`h-2 w-2 rounded-full ${color} ${status === 'loading' ? 'animate-pulse' : ''}`} />
      <span>{text}</span>
    </button>
  )
}

const BRAND_COLORS: Record<string, string | [string, string]> = {
  'Nol Universe': ['#3549FF', '#5085FF'],
  '미네르바소프트': ['#3B82F6', '#EF4444'],
  'Kotlin': '#7F52FF',
  'C#': '#68217A',
  'TypeScript': '#3178C6',
  'Spring Boot': '#6DB33F',
  '.NET': '#512BD4',
  'Next.js': '#FFFFFF',
  'MSSQL': '#CC2927',
  'MongoDB': '#47A248',
  'MySQL': '#4479A1',
  'Docker': '#2496ED',
  'GitHub Actions': '#2088FF',
  'Vercel': '#FFFFFF',
}

function getColorStyle(text: string): React.CSSProperties | undefined {
  // Check exact match first
  let color = BRAND_COLORS[text]

  // Check partial match
  if (!color) {
    const key = Object.keys(BRAND_COLORS).find(k => text.includes(k))
    if (key) color = BRAND_COLORS[key]
  }

  if (!color) return undefined

  const [c1, c2] = Array.isArray(color) ? color : [color, color]
  return {
    background: `linear-gradient(135deg, ${c1}, ${c2})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }
}

function JsonValue({ value }: { value: string }) {
  const style = getColorStyle(value)
  if (style) {
    return <span style={style}>&quot;{value}&quot;</span>
  }
  return <span style={{ color: '#a5d6ff' }}>&quot;{value}&quot;</span>
}

function JsonArray({ items }: { items: string[] }) {
  return (
    <>
      <span style={{ color: '#ffa657' }}>[</span>
      {items.map((item, i) => (
        <span key={i}>
          <JsonValue value={item} />
          {i < items.length - 1 && <span style={{ color: '#8b949e' }}>, </span>}
        </span>
      ))}
      <span style={{ color: '#ffa657' }}>]</span>
    </>
  )
}

type IntroPhase = 'typing-whoami' | 'show-whoami' | 'typing-cat' | 'show-json' | 'done'

interface HistoryEntry {
  command: string
  output: React.ReactNode
  isTyping?: boolean
}

// Vim-style Resume Viewer
function VimViewer({ onClose }: { onClose: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Focus container on mount
  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // e.code는 물리적 키 위치 (한영 상관없이 동작)
    if (e.code === 'KeyQ' || e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if ((e.code === 'KeyJ' || e.key === 'ArrowDown') && contentRef.current) {
      e.preventDefault()
      contentRef.current.scrollBy({ top: 80, behavior: 'smooth' })
    } else if ((e.code === 'KeyK' || e.key === 'ArrowUp') && contentRef.current) {
      e.preventDefault()
      contentRef.current.scrollBy({ top: -80, behavior: 'smooth' })
    } else if (e.code === 'KeyD' && e.ctrlKey && contentRef.current) {
      e.preventDefault()
      contentRef.current.scrollBy({ top: 300, behavior: 'smooth' })
    } else if (e.code === 'KeyU' && e.ctrlKey && contentRef.current) {
      e.preventDefault()
      contentRef.current.scrollBy({ top: -300, behavior: 'smooth' })
    } else if (e.code === 'KeyG' && !e.shiftKey && contentRef.current) {
      e.preventDefault()
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (e.code === 'KeyG' && e.shiftKey && contentRef.current) {
      e.preventDefault()
      contentRef.current.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' })
    } else if (e.key === 'PageDown' && contentRef.current) {
      e.preventDefault()
      contentRef.current.scrollBy({ top: 300, behavior: 'smooth' })
    } else if (e.key === 'PageUp' && contentRef.current) {
      e.preventDefault()
      contentRef.current.scrollBy({ top: -300, behavior: 'smooth' })
    } else if (e.key === 'Home' && contentRef.current) {
      e.preventDefault()
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (e.key === 'End' && contentRef.current) {
      e.preventDefault()
      contentRef.current.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="absolute inset-0 z-10 flex flex-col bg-[#0d1117] font-mono text-sm outline-none"
    >
      {/* Vim Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2">
        <span className="text-[#8b949e]">resume.md</span>
        <span className="text-[#8b949e]">[readonly]</span>
      </div>

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-terminal p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#58a6ff]"># RAVIT</h1>
          <p className="mt-1 text-[#8b949e]">Backend Developer · 5+ years experience</p>
        </div>

        {/* Experience */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-[#7ee787]">## Experience</h2>

          {/* Nol Universe */}
          <div className="mb-4 border-l-2 border-[#238636] pl-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #3549FF, #5085FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                NOL Universe
              </span>
              <span className="text-[#8b949e]">(구 인터파크)</span>
              <span className="rounded bg-[#238636] px-2 py-0.5 text-xs text-white">current</span>
            </div>
            <div className="mt-1 text-[#8b949e]">Backend Developer · 2022.04 ~ present</div>
            <ul className="mt-2 space-y-1 text-[#c9d1d9]">
              <li><span className="text-[#8b949e]">-</span> 패키지 투어 서비스 백엔드 개발</li>
              <li><span className="text-[#8b949e]">-</span> Spring Boot, Kotlin, MSSQL 기반 시스템 구축</li>
              <li><span className="text-[#8b949e]">-</span> 예약/결제 시스템 설계 및 운영</li>
              <li><span className="text-[#8b949e]">-</span> 레거시 .NET 시스템 유지보수</li>
            </ul>
          </div>

          {/* Minerva Soft */}
          <div className="mb-4 border-l-2 border-[#30363d] pl-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #EF4444)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                미네르바소프트
              </span>
            </div>
            <div className="mt-1 text-[#8b949e]">사원 · 2020.09 ~ 2022.03</div>
            <ul className="mt-2 space-y-1 text-[#c9d1d9]">
              <li><span className="text-[#8b949e]">-</span> 플랫폼 개발 및 응용 프로그램 개발</li>
              <li><span className="text-[#8b949e]">-</span> 동의서 인식기 API Backend (Manager-Agent 병렬처리)</li>
              <li><span className="text-[#8b949e]">-</span> 통합 모듈 플랫폼 관리 서비스 (Blazor, Socket)</li>
              <li><span className="text-[#8b949e]">-</span> SQL 구문 분석기 개발 (Oracle, MSSQL, MySQL, PostgreSQL)</li>
            </ul>
          </div>

          {/* KITA */}
          <div className="mb-4 border-l-2 border-[#30363d] pl-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#c9d1d9]">한국무역협회 KITA 아카데미</span>
            </div>
            <div className="mt-1 text-[#8b949e]">프리랜서 · 2020.05 ~ 2020.08</div>
            <ul className="mt-2 space-y-1 text-[#c9d1d9]">
              <li><span className="text-[#8b949e]">-</span> LMS 관리 Web 프로그램 개발</li>
            </ul>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-[#7ee787]">## Skills</h2>

          <div className="space-y-3">
            <div>
              <span className="text-[#ffa657]">Languages:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className="rounded bg-[#7F52FF]/20 px-2 py-1 text-xs text-[#7F52FF]">Kotlin</span>
                <span className="rounded bg-[#68217A]/20 px-2 py-1 text-xs text-[#68217A]">C#</span>
                <span className="rounded bg-[#3178C6]/20 px-2 py-1 text-xs text-[#3178C6]">TypeScript</span>
                <span className="rounded bg-[#b07219]/20 px-2 py-1 text-xs text-[#b07219]">Java</span>
              </div>
            </div>

            <div>
              <span className="text-[#ffa657]">Frameworks:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className="rounded bg-[#6DB33F]/20 px-2 py-1 text-xs text-[#6DB33F]">Spring Boot</span>
                <span className="rounded bg-[#512BD4]/20 px-2 py-1 text-xs text-[#512BD4]">.NET / Blazor</span>
                <span className="rounded bg-[#ffffff]/20 px-2 py-1 text-xs text-[#ffffff]">Next.js</span>
              </div>
            </div>

            <div>
              <span className="text-[#ffa657]">Database:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className="rounded bg-[#CC2927]/20 px-2 py-1 text-xs text-[#CC2927]">MSSQL</span>
                <span className="rounded bg-[#47A248]/20 px-2 py-1 text-xs text-[#47A248]">MongoDB</span>
                <span className="rounded bg-[#4479A1]/20 px-2 py-1 text-xs text-[#4479A1]">MySQL</span>
                <span className="rounded bg-[#F80000]/20 px-2 py-1 text-xs text-[#F80000]">Oracle</span>
              </div>
            </div>

            <div>
              <span className="text-[#ffa657]">DevOps:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className="rounded bg-[#2496ED]/20 px-2 py-1 text-xs text-[#2496ED]">Docker</span>
                <span className="rounded bg-[#2088FF]/20 px-2 py-1 text-xs text-[#2088FF]">GitHub Actions</span>
                <span className="rounded bg-[#ffffff]/20 px-2 py-1 text-xs text-[#ffffff]">Vercel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-[#7ee787]">## Education</h2>
          <div className="space-y-2">
            <div className="border-l-2 border-[#30363d] pl-4">
              <div className="font-semibold text-[#c9d1d9]">가천대학교</div>
              <div className="text-[#8b949e]">컴퓨터공학과 졸업 · 2010.03 ~ 2020.02</div>
            </div>
            <div className="border-l-2 border-[#30363d] pl-4">
              <div className="font-semibold text-[#c9d1d9]">SC IT MASTER</div>
              <div className="text-[#8b949e]">일본 IT 전문인재 양성 부트캠프 · 2019.03 ~ 2019.12</div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-[#7ee787]">## Certifications</h2>
          <div className="space-y-1 text-[#c9d1d9]">
            <div><span className="text-[#8b949e]">-</span> JLPT N1</div>
          </div>
        </div>

        {/* Links */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-[#7ee787]">## Links</h2>
          <div className="space-y-1 text-[#58a6ff]">
            <div><span className="text-[#8b949e]">→</span> github.com/devRavit</div>
            <div><span className="text-[#8b949e]">→</span> ravit.run</div>
          </div>
        </div>
      </div>

      {/* Vim Footer */}
      <div className="border-t border-[#30363d] bg-[#161b22] px-4 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#8b949e]">
          <span className="hidden sm:inline">
            <span className="text-[#ffa657]">↑↓</span> scroll
            <span className="mx-2">·</span>
            <span className="text-[#ffa657]">PgUp/Dn</span> page
            <span className="mx-2">·</span>
            <span className="text-[#ffa657]">Home/End</span> top/bottom
            <span className="mx-2">·</span>
            <span className="text-[#ffa657]">q</span> quit
          </span>
          <button onClick={onClose} className="text-[#ffa657] hover:text-[#c9d1d9] sm:hidden">
            [tap to close]
          </button>
          <span>:q</span>
        </div>
      </div>
    </div>
  )
}

const AboutJson = () => (
  <pre className="mt-1 text-xs leading-relaxed sm:text-sm">
    <code>
      <span style={{ color: '#ffa657' }}>{'{'}</span>{'\n'}
      {'  '}<span style={{ color: '#7ee787' }}>&quot;name&quot;</span>:        <JsonValue value="RAVIT" />,{'\n'}
      {'  '}<span style={{ color: '#7ee787' }}>&quot;company&quot;</span>:     <JsonValue value="Nol Universe (2022.04 ~)" />,{'\n'}
      {'  '}<span style={{ color: '#7ee787' }}>&quot;domain&quot;</span>:      <JsonValue value="Package Tours" />,{'\n'}
      {'  '}<span style={{ color: '#7ee787' }}>&quot;role&quot;</span>:        <JsonValue value="Backend Developer" />,{'\n'}
      {'  '}<span style={{ color: '#7ee787' }}>&quot;experience&quot;</span>:  <JsonValue value="5+ years" />,{'\n'}
      {'  '}<span style={{ color: '#7ee787' }}>&quot;languages&quot;</span>:   <JsonArray items={['Kotlin', 'C#', 'TypeScript']} />,{'\n'}
      {'  '}<span style={{ color: '#7ee787' }}>&quot;frameworks&quot;</span>:  <JsonArray items={['Spring Boot', '.NET', 'Next.js']} />,{'\n'}
      {'  '}<span style={{ color: '#7ee787' }}>&quot;database&quot;</span>:    <JsonArray items={['MSSQL', 'MongoDB', 'MySQL']} />,{'\n'}
      {'  '}<span style={{ color: '#7ee787' }}>&quot;tools&quot;</span>:       <JsonArray items={['Docker', 'GitHub Actions', 'Vercel']} />{'\n'}
      <span style={{ color: '#ffa657' }}>{'}'}</span>
    </code>
  </pre>
)

type CommandResult = React.ReactNode | 'OPEN_GITHUB' | 'OPEN_WORK' | 'CLEAR' | 'FETCH_STATUS' | 'FETCH_PORTFOLIO' | 'OPEN_RESUME'

const COMMANDS: Record<string, { description: string; action: () => CommandResult }> = {
  'help': {
    description: 'Show available commands',
    action: () => (
      <div className="text-[#8b949e]">
        <div>Available commands:</div>
        <div className="ml-2 mt-1">
          <div><span className="text-[#79c0ff]">help</span>          Show this help message</div>
          <div><span className="text-[#79c0ff]">whoami</span>        Display current user</div>
          <div><span className="text-[#79c0ff]">resume</span>        View resume (vim mode)</div>
          <div><span className="text-[#79c0ff]">portfolio</span>     View project portfolio</div>
          <div><span className="text-[#79c0ff]">status</span>        Check system status</div>
          <div><span className="text-[#79c0ff]">open --github</span> Open GitHub profile</div>
          <div><span className="text-[#79c0ff]">open --work</span>   Open work project</div>
          <div><span className="text-[#79c0ff]">clear</span>         Clear terminal</div>
        </div>
      </div>
    ),
  },
  'whoami': {
    description: 'Display current user',
    action: () => <div className="text-[#8b949e]">ravit</div>,
  },
  'resume': {
    description: 'View resume',
    action: () => 'OPEN_RESUME',
  },
  'status': {
    description: 'Check system status',
    action: () => 'FETCH_STATUS',
  },
  'portfolio': {
    description: 'View project portfolio',
    action: () => 'FETCH_PORTFOLIO',
  },
  'open --github': {
    description: 'Open GitHub profile',
    action: () => 'OPEN_GITHUB',
  },
  'open --work': {
    description: 'Open work project',
    action: () => 'OPEN_WORK',
  },
  'clear': {
    description: 'Clear terminal',
    action: () => 'CLEAR',
  },
}

export default function Home() {
  const [introPhase, setIntroPhase] = useState<IntroPhase>('typing-whoami')
  const [typedText, setTypedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [showVim, setShowVim] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 530)
    return () => clearInterval(interval)
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    requestAnimationFrame(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    })
  }, [introPhase, typedText, history, inputValue])

  // Focus input when done or loading finished
  useEffect(() => {
    if (introPhase === 'done' && !isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [introPhase, isLoading])

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      return data
    } catch {
      return null
    }
  }

  const fetchPortfolio = async (): Promise<Project[] | null> => {
    const url = process.env.NEXT_PUBLIC_STASH_API_URL
    if (!url) return null
    try {
      const res = await fetch(`${url}/externals/projects?includeTasks=true`)
      if (!res.ok) return null
      return res.json()
    } catch {
      return null
    }
  }

  const renderPortfolioOutput = (projects: Project[] | null) => {
    if (!projects) {
      return <div className="text-[#f85149]">Failed to fetch portfolio</div>
    }

    // Group by company
    const grouped = projects.reduce((acc, project) => {
      const company = project.company
      if (!acc[company]) acc[company] = []
      acc[company].push(project)
      return acc
    }, {} as Record<string, Project[]>)

    return (
      <div className="space-y-4">
        {Object.entries(grouped).map(([company, companyProjects]) => (
          <div key={company}>
            <div className="text-[#7ee787] font-semibold">
              ## {companyDisplayName[company as keyof typeof companyDisplayName] || company}
            </div>
            {companyProjects.map((project) => (
              <div key={project.id} className="mt-2 border-l-2 border-[#30363d] pl-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[#58a6ff] font-medium">{project.name}</span>
                  {project.period && (
                    <span className="text-[#8b949e] text-xs">{formatPeriod(project.period)}</span>
                  )}
                </div>
                <div className="text-[#8b949e] text-xs mt-1">{project.summary}</div>
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded bg-[#21262d] text-[#8b949e]">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 5 && (
                      <span className="text-[10px] text-[#8b949e]">+{project.techStack.length - 5}</span>
                    )}
                  </div>
                )}
                {project.tasks && project.tasks.length > 0 && (
                  <div className="mt-2 ml-2 space-y-1">
                    {project.tasks.map((task) => (
                      <div key={task.id} className="text-[#c9d1d9] text-xs">
                        <span className="text-[#8b949e]">└─ </span>
                        <span className="text-[#ffa657]">[{taskTypeDisplayName[task.type]}]</span>
                        <span> {task.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <div className="text-[#8b949e] text-xs mt-4">
          Total: {projects.length} projects, {projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0)} tasks
        </div>
      </div>
    )
  }

  const renderStatusOutput = (data: { services?: { name: string; version: string; status: string; responseTime: number; dependencies?: { type: string; status: string; details?: { replicaSet?: { nodes: { state: string; healthy: boolean }[] } } }[] }[] }) => {
    if (!data?.services?.length) {
      return <div className="text-[#f85149]">Failed to fetch status</div>
    }

    return (
      <div>
        {data.services.map((s, idx) => {
          const statusColor = s.status === 'UP' ? '#3fb950' : '#f85149'
          const mongoDep = s.dependencies?.find(d => d.type === 'MONGODB')
          const nodes = mongoDep?.details?.replicaSet?.nodes || []
          const sortedNodes = [...nodes].sort((a, b) => {
            const order: Record<string, number> = { PRIMARY: 0, SECONDARY: 1, ARBITER: 2, UNKNOWN: 3 }
            return (order[a.state] || 3) - (order[b.state] || 3)
          })

          return (
            <div key={idx} className={idx > 0 ? 'mt-2' : ''}>
              <div>
                <span style={{ color: statusColor }}>●</span>
                <span className="text-[#c9d1d9]"> {s.name}</span>
                <span className="text-[#8b949e]"> v{s.version}</span>
                <span style={{ color: statusColor }}> [{s.status}]</span>
                <span className="text-[#8b949e]"> {s.responseTime}ms</span>
              </div>
              {mongoDep && (
                <div className="ml-4">
                  <span className="text-[#8b949e]">└── </span>
                  <span style={{ color: mongoDep.status === 'UP' ? '#3fb950' : '#f85149' }}>●</span>
                  <span className="text-[#8b949e]"> mongodb</span>
                  <span style={{ color: mongoDep.status === 'UP' ? '#3fb950' : '#f85149' }}> [{mongoDep.status}]</span>
                </div>
              )}
              {sortedNodes.map((node, i) => {
                const nodeColor = node.healthy ? '#3fb950' : '#f85149'
                const stateColor: Record<string, string> = { PRIMARY: '#3fb950', SECONDARY: '#58a6ff', ARBITER: '#8b949e' }
                return (
                  <div key={i} className="ml-8">
                    <span className="text-[#8b949e]">{i === sortedNodes.length - 1 ? '└── ' : '├── '}</span>
                    <span style={{ color: nodeColor }}>●</span>
                    <span style={{ color: stateColor[node.state] || '#d29922' }}> {node.state}</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    // 히스토리에 추가
    setCommandHistory(prev => [...prev, trimmed])
    setHistoryIndex(-1)

    const command = COMMANDS[trimmed]
    if (command) {
      const result = command.action()
      if (result === 'OPEN_GITHUB') {
        window.open('https://github.com/devRavit', '_blank')
        setHistory(prev => [...prev, { command: cmd, output: <div className="text-[#8b949e]">Opening GitHub...</div> }])
      } else if (result === 'OPEN_WORK') {
        window.open('https://tour.yanolja.com/package-main', '_blank')
        setHistory(prev => [...prev, { command: cmd, output: <div className="text-[#8b949e]">Opening Package Tours...</div> }])
      } else if (result === 'FETCH_STATUS') {
        setIsLoading(true)
        setHistory(prev => [...prev, { command: cmd, output: <div className="text-[#8b949e]">Fetching status...</div> }])
        const data = await fetchStatus()
        setHistory(prev => {
          const newHistory = [...prev]
          newHistory[newHistory.length - 1] = { command: cmd, output: renderStatusOutput(data) }
          return newHistory
        })
        setIsLoading(false)
      } else if (result === 'FETCH_PORTFOLIO') {
        setIsLoading(true)
        setHistory(prev => [...prev, { command: cmd, output: <div className="text-[#8b949e]">Fetching portfolio...</div> }])
        const projects = await fetchPortfolio()
        setHistory(prev => {
          const newHistory = [...prev]
          newHistory[newHistory.length - 1] = { command: cmd, output: renderPortfolioOutput(projects) }
          return newHistory
        })
        setIsLoading(false)
      } else if (result === 'CLEAR') {
        setHistory([])
      } else if (result === 'OPEN_RESUME') {
        setHistory(prev => [...prev, { command: cmd, output: <div className="text-[#8b949e]">Opening resume.md...</div> }])
        setShowVim(true)
      } else {
        setHistory(prev => [...prev, { command: cmd, output: result }])
      }
    } else {
      setHistory(prev => [...prev, {
        command: cmd,
        output: <div className="text-[#f85149]">Command not found: {cmd}. Type <span className="text-[#79c0ff]">help</span> for available commands.</div>
      }])
    }
    setInputValue('')
  }

  const commandNames = Object.keys(COMMANDS)
  const [hintIndex, setHintIndex] = useState(0)

  // 입력값 변경 시 hintIndex 리셋
  useEffect(() => {
    setHintIndex(0)
  }, [inputValue])

  const getHints = (input: string): string[] => {
    if (!input) return []
    const lower = input.toLowerCase()
    const matches = commandNames.filter(cmd => cmd.startsWith(lower) && cmd !== lower)
    // 1글자: 매칭이 1개일 때만 힌트 표시
    // 2글자+: 매칭되면 모두 표시
    if (lower.length === 1 && matches.length > 1) return []
    return matches
  }

  const hints = getHints(inputValue)
  const hint = hints.length > 0 ? hints[hintIndex % hints.length] : null

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (hint) {
        e.preventDefault()
        setInputValue(hint)
        setHintIndex(0)
      } else {
        handleCommand(inputValue)
      }
    } else if ((e.key === 'Tab' || e.key === 'ArrowRight') && hint) {
      e.preventDefault()
      setInputValue(hint)
      setHintIndex(0)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (hints.length > 0) {
        setHintIndex(prev => (prev - 1 + hints.length) % hints.length)
      } else if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hints.length > 0) {
        setHintIndex(prev => (prev + 1) % hints.length)
      } else if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInputValue('')
        } else {
          setHistoryIndex(newIndex)
          setInputValue(commandHistory[newIndex])
        }
      }
    }
  }

  // Typing animation for intro
  useEffect(() => {
    if (introPhase === 'typing-whoami') {
      const cmd = 'whoami'
      if (typedText.length < cmd.length) {
        const timer = setTimeout(() => setTypedText(cmd.slice(0, typedText.length + 1)), 35)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setHistory([{ command: 'whoami', output: <div className="text-[#8b949e]">ravit</div> }])
          setIntroPhase('show-whoami')
          setTypedText('')
        }, 80)
        return () => clearTimeout(timer)
      }
    }

    if (introPhase === 'show-whoami') {
      const timer = setTimeout(() => setIntroPhase('typing-cat'), 150)
      return () => clearTimeout(timer)
    }

    if (introPhase === 'typing-cat') {
      const cmd = 'cat about.json'
      if (typedText.length < cmd.length) {
        const timer = setTimeout(() => setTypedText(cmd.slice(0, typedText.length + 1)), 25)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setHistory(prev => [...prev, { command: 'cat about.json', output: <AboutJson /> }])
          setIntroPhase('show-json')
          setTypedText('')
        }, 80)
        return () => clearTimeout(timer)
      }
    }

    if (introPhase === 'show-json') {
      const timer = setTimeout(() => setIntroPhase('done'), 50)
      return () => clearTimeout(timer)
    }
  }, [introPhase, typedText])

  const cursor = showCursor ? '▋' : ' '

  return (
    <main className="h-screen overflow-hidden bg-[#0d1117] text-[#c9d1d9] selection:bg-[#388bfd] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#21262d] bg-[#161b22]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <span className="font-mono text-sm text-[#58a6ff]">ravit.run</span>
          <StatusIndicator onClick={() => introPhase === 'done' && handleCommand('status')} />
        </div>
      </nav>

      {/* Terminal Section */}
      <section className="flex h-screen flex-col pt-[57px]">
        {/* Terminal Window - Full screen on mobile */}
        <div className="relative flex min-h-0 flex-1 flex-col bg-[#161b22] sm:m-6 sm:rounded-lg sm:border sm:border-[#30363d] sm:shadow-2xl">
          {/* Vim Viewer Overlay */}
          {showVim && <VimViewer onClose={() => { setShowVim(false); inputRef.current?.focus() }} />}

          {/* Terminal Header */}
          <div className="flex items-center gap-2 border-b border-[#30363d] bg-[#21262d] px-3 py-2 sm:px-4 sm:py-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] sm:h-3 sm:w-3" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] sm:h-3 sm:w-3" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f] sm:h-3 sm:w-3" />
            <span className="ml-2 font-mono text-[10px] text-[#8b949e] sm:ml-4 sm:text-xs">terminal — zsh</span>
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            onClick={() => introPhase === 'done' && inputRef.current?.focus()}
            className="flex-1 cursor-text overflow-y-auto scrollbar-terminal p-4 font-mono text-xs leading-relaxed sm:p-6 sm:text-sm"
          >
              {/* Typing animation for intro */}
              {introPhase === 'typing-whoami' && (
                <div>
                  <span className="text-[#7ee787]">~</span>
                  <span className="text-[#8b949e]"> $ </span>
                  <span>{typedText}</span>
                  <span className="text-[#c9d1d9]">{cursor}</span>
                </div>
              )}

              {introPhase === 'typing-cat' && (
                <>
                  {history.map((entry, i) => (
                    <div key={i} className={i > 0 ? 'mt-2' : ''}>
                      <div>
                        <span className="text-[#7ee787]">~</span>
                        <span className="text-[#8b949e]"> $ </span>
                        <span>{entry.command}</span>
                      </div>
                      {entry.output}
                    </div>
                  ))}
                  <div className="mt-2">
                    <span className="text-[#7ee787]">~</span>
                    <span className="text-[#8b949e]"> $ </span>
                    <span>{typedText}</span>
                    <span className="text-[#c9d1d9]">{cursor}</span>
                  </div>
                </>
              )}

              {/* Command history and interactive prompt */}
              {(introPhase === 'show-whoami' || introPhase === 'show-json' || introPhase === 'done') && (
                <>
                  {history.map((entry, i) => (
                    <div key={i} className={i > 0 ? 'mt-2' : ''}>
                      <div>
                        <span className="text-[#7ee787]">~</span>
                        <span className="text-[#8b949e]"> $ </span>
                        <span>{entry.command}</span>
                      </div>
                      {entry.output}
                    </div>
                  ))}
                  {introPhase === 'done' && !isLoading && (
                    <div className={history.length > 0 ? 'mt-2' : ''}>
                      <div>
                        <span className="text-[#7ee787]">~</span>
                        <span className="text-[#8b949e]"> $ </span>
                        <span className="relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent outline-none caret-[#c9d1d9] placeholder:text-[#484f58]"
                            style={{ width: inputValue ? `${[...inputValue].reduce((w, c) => w + (c.charCodeAt(0) > 127 ? 2 : 1), 0)}ch` : '22ch' }}
                            spellCheck={false}
                            autoComplete="off"
                            placeholder="type 'help' for commands"
                          />
                          {hint && hints.length === 1 && (
                            <span className="pointer-events-none text-[#484f58]">
                              {hint.slice(inputValue.length)}
                            </span>
                          )}
                        </span>
                      </div>
                      {hints.length > 1 && (
                        <div className="ml-6 mt-1 border-l border-[#30363d] pl-2 text-[#484f58]">
                          {hints.map((h, i) => (
                            <div key={h} className={i === hintIndex % hints.length ? 'text-[#c9d1d9]' : ''}>
                              {h}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
        </div>
      </section>
    </main>
  )
}
