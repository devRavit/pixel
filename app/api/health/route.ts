import { NextResponse } from 'next/server'
import { checkStashHealth, getOverallStatus, getPixelVersion } from '@/app/lib/health'

// ISR: 5분마다 서버에서 자동 갱신
export const revalidate = 300

export async function GET() {
  const stashHealth = await checkStashHealth()

  const services = [stashHealth]
  const overall = getOverallStatus(services)

  return NextResponse.json({
    overall,
    timestamp: new Date().toISOString(),
    pixel: {
      name: 'Pixel',
      version: getPixelVersion(),
      status: 'UP',
    },
    services,
  })
}
