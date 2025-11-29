import type { Metadata } from 'next'
import './globals.css'
import StatusBar from './components/StatusBar'
import { checkStashHealth, getOverallStatus } from './lib/health'

export const metadata: Metadata = {
  title: 'Pixel',
  description: 'Pixel - Frontend for Stash',
}

// ISR: 5분마다 갱신
export const revalidate = 300

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 서버에서 상태 조회 후 렌더링
  const stashHealth = await checkStashHealth()
  const status = getOverallStatus([stashHealth])

  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <StatusBar status={status} />
        {children}
      </body>
    </html>
  )
}
