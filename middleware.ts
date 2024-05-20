import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname
    const search = req.nextUrl.searchParams.get('sh')

    if (url.startsWith('/check') && search !== 'si') {
        return NextResponse.redirect(new URL('/', req.nextUrl).toString())
    }
    return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}