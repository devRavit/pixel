import { NextResponse } from 'next/server'
import { checkStashHealth, getOverallStatus, getPixelVersion } from '@/app/lib/health'

export const dynamic = 'force-dynamic'

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
