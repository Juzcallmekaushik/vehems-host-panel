import { NextResponse } from 'next/server'

export function middleware(request) {
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get('session')
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
