import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  // Public routes
  const publicPaths = ['/login', '/signup']
  if (publicPaths.includes(path)) return NextResponse.next()

  // Protected routes
  try {
    if (!token) throw new Error('No token')
    verifyToken(token)
    return NextResponse.next()
  } catch (error) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}