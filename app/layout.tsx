import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pixel',
  description: 'Pixel - Frontend for Stash',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
