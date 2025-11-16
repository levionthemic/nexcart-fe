import http from '@/lib/http'
import { User } from '@/types/entities/user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const response = await http.get<User>('/users/profile', {
    headers: {
      'x-session-id': req.cookies.get('session_id')?.value || '',
      Authorization: `Bearer ${req.cookies.get('access_token')?.value || ''}`
    }
  })

  if (response.status !== 200)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: response.status }
    )

  return NextResponse.json(response.data)
}
