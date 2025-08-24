import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { Role } from '@/types/enums/role'

export async function middleware(request: NextRequest) {
  console.log('Middleware is running for:', request.nextUrl.pathname)

  const accessToken = request.cookies.get('access_token')?.value as string
  const sessionId = request.cookies.get('session_id')?.value

  if (!accessToken && !sessionId)
    return NextResponse.redirect(new URL('/login', request.url))

  try {
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET_SIGNATURE)
    )

    const role = payload.role
    const pathname = request.nextUrl.pathname
    if (pathname.startsWith('/seller') && role !== Role.SELLER)
      return NextResponse.redirect(new URL('/403', request.url))

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/seller/:path*', '/checkout/:path*', '/user/:path*']
}
