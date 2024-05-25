import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname
    const search = req.nextUrl.searchParams.get(process.env.SECRET_HEADER_KEY as string)

    if (url.startsWith('/check') && search !== process.env.SECRET_HEADER_VALUE) {
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