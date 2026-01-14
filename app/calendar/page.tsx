'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'

interface GoogleOAuthResponse {
  access_token: string
}

interface GoogleTokenClient {
  requestAccessToken: () => void
}

interface GoogleTokenClientConfig {
  client_id: string
  scope: string
  callback: (response: GoogleOAuthResponse) => void
}

interface CalendarEventResponse {
  id: string
  summary: string
  htmlLink: string
  startDateTime: string
  endDateTime: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: GoogleTokenClientConfig) => GoogleTokenClient
        }
      }
    }
  }
}

export default function CalendarPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // 기본값: 현재 시간과 1시간 후
  const getDefaultDateTime = () => {
    const now = new Date()
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

    const formatDateTime = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    return {
      start: formatDateTime(now),
      end: formatDateTime(oneHourLater)
    }
  }

  const defaultTimes = getDefaultDateTime()

  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    location: '',
    startDateTime: defaultTimes.start,
    endDateTime: defaultTimes.end,
    calendarId: 'primary',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CalendarEventResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [googleLoaded, setGoogleLoaded] = useState(false)

  useEffect(() => {
    if (googleLoaded && window.google) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        scope: 'https://www.googleapis.com/auth/calendar',
        callback: (response: GoogleOAuthResponse) => {
          if (response.access_token) {
            setAccessToken(response.access_token)
            setError(null)
          }
        },
      })

      const button = document.getElementById('google-signin-button')
      if (button) {
        button.onclick = () => {
          client.requestAccessToken()
        }
      }
    }
  }, [googleLoaded])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken) {
      setError('먼저 Google 로그인이 필요합니다')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_STASH_API_URL
      const response = await fetch(`${apiUrl}/externals/calendar/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: formData.summary,
          description: formData.description || null,
          location: formData.location || null,
          startDateTime: formData.startDateTime,
          endDateTime: formData.endDateTime,
          timeZone: 'Asia/Seoul',
          attendees: [],
          calendarId: formData.calendarId || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '캘린더 이벤트 생성 실패')
      }

      const data = await response.json()
      setResult(data)
      // 폼 초기화 (새로운 기본값으로)
      const newDefaultTimes = getDefaultDateTime()
      setFormData({
        summary: '',
        description: '',
        location: '',
        startDateTime: newDefaultTimes.start,
        endDateTime: newDefaultTimes.end,
        calendarId: 'primary',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => setGoogleLoaded(true)}
      />

      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Google Calendar 이벤트 생성</h1>

          {/* Google 로그인 */}
          {!accessToken ? (
            <div className="mb-8 p-6 bg-[#161b22] rounded-lg border border-[#30363d]">
              <p className="mb-4 text-[#8b949e]">
                Google Calendar에 이벤트를 추가하려면 로그인이 필요합니다.
              </p>
              <button
                id="google-signin-button"
                disabled={!googleLoaded}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px 12px 12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #747775',
                  borderRadius: '4px',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  color: '#1F1F1F',
                  cursor: googleLoaded ? 'pointer' : 'not-allowed',
                  opacity: googleLoaded ? 1 : 0.5,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (googleLoaded) {
                    e.currentTarget.style.backgroundColor = '#F7F7F7'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          ) : (
            <div className="mb-8 p-6 bg-[#161b22] rounded-lg border border-[#30363d]">
              <p className="text-[#58a6ff]">✓ Google 로그인 완료</p>
              <button
                onClick={() => setAccessToken(null)}
                className="mt-2 text-sm text-[#8b949e] hover:text-[#c9d1d9]"
              >
                로그아웃
              </button>
            </div>
          )}

          {/* 이벤트 생성 폼 */}
          {accessToken && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:border-[#58a6ff]"
                  placeholder="회의 제목"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:border-[#58a6ff]"
                  placeholder="이벤트 설명"
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">위치</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:border-[#58a6ff]"
                  placeholder="서울시 강남구"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    시작 시간 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDateTime}
                    onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    종료 시간 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDateTime}
                    onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">캘린더 ID</label>
                <input
                  type="text"
                  value={formData.calendarId}
                  onChange={(e) => setFormData({ ...formData, calendarId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:border-[#58a6ff]"
                  placeholder="primary"
                />
                <p className="mt-1 text-xs text-[#8b949e]">
                  기본값: primary (본인의 기본 캘린더)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#21262d] disabled:text-[#484f58] rounded-md font-medium transition-colors"
              >
                {loading ? '생성 중...' : '이벤트 생성'}
              </button>
            </form>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="mt-6 p-4 bg-[#da3633]/10 border border-[#da3633] rounded-md">
              <p className="text-[#ff7b72]">{error}</p>
            </div>
          )}

          {/* 성공 결과 */}
          {result && (
            <div className="mt-6 p-4 bg-[#238636]/10 border border-[#238636] rounded-md">
              <p className="text-[#3fb950] font-medium mb-2">✓ 이벤트가 생성되었습니다!</p>
              <div className="text-sm text-[#8b949e] space-y-1">
                <p>ID: {result.id}</p>
                <p>제목: {result.summary}</p>
                <p>
                  링크:{' '}
                  <a
                    href={result.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#58a6ff] hover:underline"
                  >
                    Google Calendar에서 보기
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
