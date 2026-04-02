import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const tenants = await prisma.tenant.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(tenants)
}

export async function POST(req: Request) {
  try {
    const { name, slug, plan } = await req.json()

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Slug can only contain lowercase letters, numbers, and hyphens' }, { status: 400 })
    }

    const reserved = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'localhost']
    if (reserved.includes(slug)) {
      return NextResponse.json({ error: 'This subdomain is reserved' }, { status: 400 })
    }

    const tenant = await prisma.tenant.create({
      data: { name, slug, plan: plan || 'free' },
    })

    return NextResponse.json(tenant, { status: 201 })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Subdomain already taken' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
