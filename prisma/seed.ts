import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: { name: 'Demo Company', slug: 'demo', plan: 'pro' },
  })
  console.log('Seed complete.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
