import http from '@/lib/http'
import { User } from '@/types/entities/user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
 // Prefer header fallback because req.cookies may be undefined in some runtimes
  const cookieHeader =
    req.headers.get('cookie') ??
    (() => {
      const accessToken = req.cookies?.get?.('access_token')?.value
      const sessionId = req.cookies?.get?.('session_id')?.value
      if (!accessToken && !sessionId) return null
      return `access_token=${accessToken || ''}; session_id=${sessionId || ''}`
    })()

  if (!cookieHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const response = await http.get<User>('/users/profile', {
    headers: {
      Cookie: cookieHeader
    }
  })

  if (response.status !== 200)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: response.status }
    )

  return NextResponse.json(response.data)
}
