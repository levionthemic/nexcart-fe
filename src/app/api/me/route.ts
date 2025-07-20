import http from '@/lib/http'
import { User } from '@/types/entities/user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value
  const sessionId = req.cookies.get('sessionId')?.value
  const userAgent = req.headers.get('user-agent') || ''
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]

  if (!accessToken && !sessionId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const response = await http.get<User>('/users/profile', {
    headers: {
      cookie: `accessToken=${accessToken};sessionId=${sessionId}`,
      'User-Agent': userAgent,
      'X-Forwarded-For': ip!
    }
  })

  if (response.statusCode !== 200)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: response.statusCode }
    )

  return NextResponse.json(response.data)
}
