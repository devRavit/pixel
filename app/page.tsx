'use client'

import { useEffect, useRef, useState } from 'react'

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

type Phase = 'typing-whoami' | 'show-whoami' | 'typing-cat' | 'show-json' | 'done'

interface HistoryEntry {
  command: string
  output: React.ReactNode
}

type CommandResult = React.ReactNode | 'OPEN_GITHUB' | 'OPEN_WORK' | 'CLEAR' | 'FETCH_STATUS'

const COMMANDS: Record<string, { description: string; action: () => CommandResult }> = {
  'help': {
    description: 'Show available commands',
    action: () => (
      <div className="text-[#8b949e]">
        <div>Available commands:</div>
        <div className="ml-2 mt-1">
          <div><span className="text-[#79c0ff]">help</span>          Show this help message</div>
          <div><span className="text-[#79c0ff]">whoami</span>        Display current user</div>
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
  'status': {
    description: 'Check system status',
    action: () => 'FETCH_STATUS',
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
  const [phase, setPhase] = useState<Phase>('typing-whoami')
  const [typedText, setTypedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
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
  }, [phase, typedText, history, inputValue])

  // Focus input when done or loading finished
  useEffect(() => {
    if (phase === 'done' && !isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [phase, isLoading])

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      return data
    } catch {
      return null
    }
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
      } else if (result === 'CLEAR') {
        setHistory([])
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

  // Typing animation
  useEffect(() => {
    if (phase === 'typing-whoami') {
      const cmd = 'whoami'
      if (typedText.length < cmd.length) {
        const timer = setTimeout(() => setTypedText(cmd.slice(0, typedText.length + 1)), 80)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setPhase('show-whoami')
          setTypedText('')
        }, 300)
        return () => clearTimeout(timer)
      }
    }

    if (phase === 'show-whoami') {
      const timer = setTimeout(() => setPhase('typing-cat'), 600)
      return () => clearTimeout(timer)
    }

    if (phase === 'typing-cat') {
      const cmd = 'cat about.json'
      if (typedText.length < cmd.length) {
        const timer = setTimeout(() => setTypedText(cmd.slice(0, typedText.length + 1)), 60)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setPhase('show-json')
          setTypedText('')
        }, 300)
        return () => clearTimeout(timer)
      }
    }

    if (phase === 'show-json') {
      const timer = setTimeout(() => setPhase('done'), 200)
      return () => clearTimeout(timer)
    }
  }, [phase, typedText])

  const cursor = showCursor ? '▋' : ' '

  return (
    <main className="h-screen overflow-hidden bg-[#0d1117] text-[#c9d1d9] selection:bg-[#388bfd] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#21262d] bg-[#161b22]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <span className="font-mono text-sm text-[#58a6ff]">ravit.run</span>
          <StatusIndicator onClick={() => phase === 'done' && handleCommand('status')} />
        </div>
      </nav>

      {/* Terminal Section */}
      <section className="flex h-screen flex-col pt-[57px]">
        {/* Terminal Window - Full screen on mobile */}
        <div className="flex min-h-0 flex-1 flex-col bg-[#161b22] sm:m-6 sm:rounded-lg sm:border sm:border-[#30363d] sm:shadow-2xl">
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
            onClick={() => phase === 'done' && inputRef.current?.focus()}
            className="flex-1 cursor-text overflow-y-auto scrollbar-terminal p-4 font-mono text-xs leading-relaxed sm:p-6 sm:text-sm"
          >
              {/* Line 1: whoami */}
              {phase === 'typing-whoami' && (
                <div>
                  <span className="text-[#7ee787]">~</span>
                  <span className="text-[#8b949e]"> $ </span>
                  <span>{typedText}</span>
                  <span className="text-[#c9d1d9]">{cursor}</span>
                </div>
              )}

              {(phase === 'show-whoami' || phase === 'typing-cat' || phase === 'show-json' || phase === 'done') && (
                <>
                  <div>
                    <span className="text-[#7ee787]">~</span>
                    <span className="text-[#8b949e]"> $ </span>
                    <span>whoami</span>
                  </div>
                  <div className="text-[#8b949e]">ravit</div>
                </>
              )}

              {/* Line 2: cat about.json */}
              {phase === 'typing-cat' && (
                <div className="mt-2">
                  <span className="text-[#7ee787]">~</span>
                  <span className="text-[#8b949e]"> $ </span>
                  <span>{typedText}</span>
                  <span className="text-[#c9d1d9]">{cursor}</span>
                </div>
              )}

              {(phase === 'show-json' || phase === 'done') && (
                <>
                  <div className="mt-2">
                    <span className="text-[#7ee787]">~</span>
                    <span className="text-[#8b949e]"> $ </span>
                    <span>cat about.json</span>
                  </div>
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
                </>
              )}

              {/* Command history and interactive prompt */}
              {phase === 'done' && (
                <>
                  {history.map((entry, i) => (
                    <div key={i} className="mt-2">
                      <div>
                        <span className="text-[#7ee787]">~</span>
                        <span className="text-[#8b949e]"> $ </span>
                        <span>{entry.command}</span>
                      </div>
                      {entry.output}
                    </div>
                  ))}
                  {!isLoading && (
                    <div className="mt-2">
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
