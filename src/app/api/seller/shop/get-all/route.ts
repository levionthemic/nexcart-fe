import { NextRequest, NextResponse } from 'next/server'

import http from '@/lib/http'
import { Shop } from '@/types/entities/shop'

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value
  const sessionId = req.cookies.get('sessionId')?.value
  const userAgent = req.headers.get('user-agent') || ''
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]

  if (!accessToken && !sessionId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const response = await http.get<Shop>('/shop', {
    headers: {
      cookie: `accessToken=${accessToken};sessionId=${sessionId}`,
      'User-Agent': userAgent,
      'X-Forwarded-For': ip!
    }
  })

  if (response.status !== 200)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: response.status }
    )

  return NextResponse.json(response.data)
}
