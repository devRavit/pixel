import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ravit.run',
  description: 'RAVIT - Backend Developer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-[#0d1117] text-[#c9d1d9] antialiased">
        {children}
      </body>
    </html>
  )
}
