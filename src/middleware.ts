import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const rootDomain = process.env.ROOT_DOMAIN || 'localhost:3000'

  const hostWithoutPort = host.split(':')[0]
  const rootWithoutPort = rootDomain.split(':')[0]

  // Skip for root domain and www
  if (
    hostWithoutPort === rootWithoutPort ||
    hostWithoutPort === `www.${rootWithoutPort}`
  ) {
    return NextResponse.next()
  }

  // Extract subdomain
  if (hostWithoutPort.endsWith(`.${rootWithoutPort}`)) {
    const subdomain = hostWithoutPort.replace(`.${rootWithoutPort}`, '')

    // Skip internal Next.js paths
    if (req.nextUrl.pathname.startsWith('/_next') || req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.next()
    }

    const url = req.nextUrl.clone()
    url.pathname = `/tenant/${subdomain}${url.pathname === '/' ? '' : url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
