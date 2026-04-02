import { headers } from 'next/headers'

export function getSubdomain(): string | null {
  const headersList = headers()
  const host = headersList.get('host') || ''
  const rootDomain = process.env.ROOT_DOMAIN || 'localhost:3000'

  // Strip port for comparison
  const hostWithoutPort = host.split(':')[0]
  const rootWithoutPort = rootDomain.split(':')[0]

  if (hostWithoutPort === rootWithoutPort || hostWithoutPort === `www.${rootWithoutPort}`) {
    return null
  }

  if (hostWithoutPort.endsWith(`.${rootWithoutPort}`)) {
    return hostWithoutPort.replace(`.${rootWithoutPort}`, '')
  }

  return null
}
