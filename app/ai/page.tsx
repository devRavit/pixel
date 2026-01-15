'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isLoading?: boolean
  isError?: boolean
}

type OverallStatus = 'operational' | 'degraded' | 'outage' | 'loading'

const CLIENT_ID_KEY = 'ravit_client_id'

function generateDeviceHint(): string {
  const data = {
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
  }
  return btoa(JSON.stringify(data))
}

function getOrCreateClientId(): string {
  let clientId = localStorage.getItem(CLIENT_ID_KEY)
  if (!clientId) {
    clientId = crypto.randomUUID()
    localStorage.setItem(CLIENT_ID_KEY, clientId)
  }
  return clientId
}

function StatusIndicator() {
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
    <div className="flex items-center gap-2 font-mono text-xs text-[#8b949e]">
      <span className={`h-2 w-2 rounded-full ${color} ${status === 'loading' ? 'animate-pulse' : ''}`} />
      <span>{text}</span>
    </div>
  )
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const [isSessionReady, setIsSessionReady] = useState(false)
  const clientIdRef = useRef<string | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      const url = process.env.NEXT_PUBLIC_STASH_API_URL
      if (!url) {
        setIsSessionReady(true)
        return
      }

      const clientId = getOrCreateClientId()
      clientIdRef.current = clientId
      const deviceHint = generateDeviceHint()

      try {
        // Create or get session
        const sessionRes = await fetch(`${url}/externals/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId, deviceHint }),
        })

        if (sessionRes.ok) {
          const sessionData = await sessionRes.json()

          // If session has messages, fetch them
          if (sessionData.messageCount > 0) {
            const messagesRes = await fetch(`${url}/externals/sessions/messages?clientId=${clientId}`)
            if (messagesRes.ok) {
              const historyMessages = await messagesRes.json()
              const formattedMessages: Message[] = historyMessages.map((msg: { role: string; content: string }) => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content,
              }))
              setMessages(formattedMessages)
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize session:', error)
      } finally {
        setIsSessionReady(true)
      }
    }

    initSession()
  }, [])

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
  }, [messages, inputValue])

  // Focus input on mount and after loading
  useEffect(() => {
    if (!isLoading && isSessionReady) {
      inputRef.current?.focus()
    }
  }, [isLoading, isSessionReady])

  const sendMessage = useCallback(async () => {
    const message = inputValue.trim()
    if (!message || isLoading || !clientIdRef.current) return

    setInputValue('')
    setIsLoading(true)

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }])

    // Add loading assistant message
    setMessages(prev => [...prev, { role: 'assistant', content: '', isLoading: true }])

    try {
      const url = process.env.NEXT_PUBLIC_STASH_API_URL
      if (!url) throw new Error('API URL not configured')

      const res = await fetch(`${url}/externals/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientIdRef.current,
          message,
        }),
      })

      if (!res.ok) throw new Error('Failed to get response')

      const data = await res.json()

      // Update with response
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: data.response,
          isError: data.isError,
        }
        return newMessages
      })
      setIsLoading(false)
    } catch {
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: 'Failed to get response. Please try again.',
        }
        return newMessages
      })
      setIsLoading(false)
    }
  }, [inputValue, isLoading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-[#0d1117] text-[#c9d1d9] selection:bg-[#388bfd] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#21262d] bg-[#161b22]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="font-mono text-sm text-[#58a6ff] hover:text-[#79c0ff]">
            ravit.run
          </Link>
          <StatusIndicator />
        </div>
      </nav>

      {/* Terminal Section */}
      <section className="flex h-screen flex-col pt-[57px]">
        <div className="relative flex min-h-0 flex-1 flex-col bg-[#161b22] sm:m-6 sm:rounded-lg sm:border sm:border-[#30363d] sm:shadow-2xl">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 border-b border-[#30363d] bg-[#21262d] px-3 py-2 sm:px-4 sm:py-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] sm:h-3 sm:w-3" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] sm:h-3 sm:w-3" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f] sm:h-3 sm:w-3" />
            <span className="ml-2 font-mono text-[10px] text-[#8b949e] sm:ml-4 sm:text-xs">ai — chat</span>
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            onClick={() => inputRef.current?.focus()}
            className="flex-1 cursor-text overflow-y-auto scrollbar-terminal p-4 font-mono text-xs leading-relaxed sm:p-6 sm:text-sm"
          >
            {/* Welcome Banner */}
            {messages.length === 0 && !isLoading && isSessionReady && (
              <div className="mb-4">
                <div className="flex items-start gap-4">
                  <pre className="text-[#58a6ff] leading-none text-[10px] sm:text-xs">
{` ▗▄▄▄▄▄▄▄▖
▐█▀▀▀▀▀▀█▌
▐█ ◠  ◠ █▌
▐█  ▽   █▌
▐█▄▄▄▄▄▄█▌
 ▝▀▀▀▀▀▀▘`}
                  </pre>
                  <div className="pt-1">
                    <div className="text-[#7ee787] font-bold">RAVIT AI</div>
                    <div className="text-[#8b949e] text-[10px] sm:text-xs mt-0.5">v0.1.0 · gemini-2.5-flash</div>
                    <div className="text-[#6e7681] text-[10px] sm:text-xs mt-0.5">Your personal AI assistant</div>
                  </div>
                </div>
                <div className="mt-4 text-[#8b949e] border-t border-[#21262d] pt-3">
                  <span className="text-[#3fb950]">●</span> Ready. Type your message to start.
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i} className={i > 0 || messages.length > 0 ? 'mt-2' : ''}>
                {msg.role === 'user' ? (
                  <div>
                    <div>
                      <span className="text-[#7ee787]">~</span>
                      <span className="text-[#8b949e]"> $ </span>
                      <span className="text-[#c9d1d9]">{msg.content}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-[#c9d1d9]">
                    {msg.isLoading ? (
                      <span className="text-[#8b949e]">thinking...</span>
                    ) : msg.isError ? (
                      <div className="text-[#f0883e] whitespace-pre-wrap">{msg.content}</div>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-2 prose-code:bg-[#21262d] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-transparent prose-pre:p-0">
                        <ReactMarkdown
                          components={{
                            code({ className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '')
                              const isInline = !match
                              return isInline ? (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              ) : (
                                <SyntaxHighlighter
                                  style={{
                                    ...vscDarkPlus,
                                    'pre[class*="language-"]': {
                                      ...vscDarkPlus['pre[class*="language-"]'],
                                      background: '#0d1117',
                                    },
                                    'code[class*="language-"]': {
                                      ...vscDarkPlus['code[class*="language-"]'],
                                      background: '#0d1117',
                                    },
                                  }}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{
                                    margin: 0,
                                    padding: '12px',
                                    borderRadius: '6px',
                                    border: '1px solid #30363d',
                                    background: '#0d1117',
                                    fontSize: '12px',
                                  }}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              )
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Input Prompt */}
            {!isLoading && isSessionReady && (
              <div className={messages.length > 0 ? 'mt-2' : ''}>
                <span className="text-[#7ee787]">~</span>
                <span className="text-[#8b949e]"> $ </span>
                <span className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent outline-none caret-transparent"
                    style={{ width: inputValue ? `${[...inputValue].reduce((w, c) => w + (c.charCodeAt(0) > 127 ? 2 : 1), 0)}ch` : '1ch' }}
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <span className="text-[#c9d1d9]">{showCursor ? '▋' : ' '}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
