import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/employee/dashboard')) {
    const token = request.cookies.get('employee_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/staff/login', request.url))
    }
    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'employee') {
      const response = NextResponse.redirect(new URL('/staff/login', request.url))
      response.cookies.delete('employee_token')
      return response
    }
    return NextResponse.next()
  }

  // Staff dashboard protection
  const token = request.cookies.get('staff_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/staff/login', request.url))
  }
  const payload = await verifyToken(token)
  if (!payload) {
    const response = NextResponse.redirect(new URL('/staff/login', request.url))
    response.cookies.delete('staff_token')
    return response
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/staff/dashboard/:path*', '/employee/dashboard/:path*'],
}
