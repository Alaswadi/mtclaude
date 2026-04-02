import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.tenant.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const tenant = await prisma.tenant.update({
    where: { id: params.id },
    data: body,
  })
  return NextResponse.json(tenant)
}
