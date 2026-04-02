import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function TenantPage({ params }: { params: { slug: string } }) {
  const tenant = await prisma.tenant.findUnique({ where: { slug: params.slug } })

  if (!tenant || !tenant.active) notFound()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '48px 56px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxWidth: 480 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28, color: '#fff' }}>
          {tenant.name.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', marginBottom: 8 }}>{tenant.name}</h1>
        <p style={{ color: '#666', marginBottom: 24, fontSize: 16 }}>Welcome to your tenant workspace</p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
          <span style={{ background: '#f0f0f0', padding: '4px 14px', borderRadius: 20, fontSize: 13, color: '#555' }}>
            {tenant.slug}.{process.env.ROOT_DOMAIN || 'localhost:3000'}
          </span>
          <span style={{ background: tenant.plan === 'enterprise' ? '#7c3aed20' : tenant.plan === 'pro' ? '#0ea5e920' : '#6b728020', padding: '4px 14px', borderRadius: 20, fontSize: 13, color: tenant.plan === 'enterprise' ? '#7c3aed' : tenant.plan === 'pro' ? '#0284c7' : '#374151', fontWeight: 600 }}>
            {tenant.plan}
          </span>
        </div>

        <div style={{ background: '#f9fafb', borderRadius: 12, padding: '20px 24px', textAlign: 'left' }}>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Tenant Info</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Row label="ID" value={tenant.id} />
            <Row label="Created" value={new Date(tenant.createdAt).toLocaleDateString()} />
            <Row label="Status" value={tenant.active ? 'Active' : 'Inactive'} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
      <span style={{ color: '#666' }}>{label}</span>
      <span style={{ color: '#111', fontWeight: 500, fontFamily: label === 'ID' ? 'monospace' : 'inherit', fontSize: label === 'ID' ? 12 : 14 }}>{value}</span>
    </div>
  )
}
