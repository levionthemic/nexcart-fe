import http from '@/lib/http'
import { User } from '@/types/entities/user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value
  const sessionId = req.cookies.get('session_id')?.value

  if (!accessToken && !sessionId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const response = await http.get<User>('/users/profile', {
    headers: {
      Cookie: `access_token=${accessToken}; session_id=${sessionId}`
    }
  })

  console.log('Response:', response)

  if (response.status !== 200)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: response.status }
    )

  return NextResponse.json(response.data)
}
