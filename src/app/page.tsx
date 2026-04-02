'use client'

import { useState, useEffect } from 'react'

interface Tenant {
  id: string
  name: string
  slug: string
  plan: string
  active: boolean
  createdAt: string
}

export default function AdminPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [plan, setPlan] = useState('free')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'

  async function fetchTenants() {
    const res = await fetch('/api/tenants')
    const data = await res.json()
    setTenants(data)
  }

  useEffect(() => { fetchTenants() }, [])

  async function createTenant(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'), plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create tenant')
      setName('')
      setSlug('')
      setPlan('free')
      fetchTenants()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteTenant(id: string) {
    if (!confirm('Delete this tenant?')) return
    await fetch(`/api/tenants/${id}`, { method: 'DELETE' })
    fetchTenants()
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Tenant Admin</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>Manage all tenants and their subdomains.</p>

      {/* Create Form */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 28, marginBottom: 32, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Create New Tenant</h2>
        <form onSubmit={createTenant} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Company Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Acme Corp"
              required
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Subdomain</label>
            <input
              value={slug}
              onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="acme"
              required
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Plan</label>
            <select value={plan} onChange={e => setPlan(e.target.value)} style={{ ...inputStyle, background: '#fff' }}>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Creating...' : '+ Create Tenant'}
          </button>
        </form>
        {error && <p style={{ color: '#e53e3e', marginTop: 12, fontSize: 14 }}>{error}</p>}
      </div>

      {/* Tenants List */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
              {['Name', 'Subdomain', 'Plan', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#999' }}>No tenants yet. Create one above.</td></tr>
            ) : tenants.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={tdStyle}>{t.name}</td>
                <td style={tdStyle}>
                  <a
                    href={`http://${t.slug}.${rootDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#4f46e5', textDecoration: 'none', fontFamily: 'monospace', fontSize: 13 }}
                  >
                    {t.slug}.{rootDomain}
                  </a>
                </td>
                <td style={tdStyle}>
                  <span style={{ ...badge, background: t.plan === 'enterprise' ? '#7c3aed20' : t.plan === 'pro' ? '#0ea5e920' : '#6b728020', color: t.plan === 'enterprise' ? '#7c3aed' : t.plan === 'pro' ? '#0284c7' : '#374151' }}>
                    {t.plan}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{ ...badge, background: t.active ? '#16a34a20' : '#dc262620', color: t.active ? '#16a34a' : '#dc2626' }}>
                    {t.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ ...tdStyle, color: '#999', fontSize: 13 }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <button onClick={() => deleteTenant(t.id)} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd',
  fontSize: 14, outline: 'none', minWidth: 160,
}
const btnStyle: React.CSSProperties = {
  padding: '10px 20px', background: '#4f46e5', color: '#fff',
  border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
  cursor: 'pointer', whiteSpace: 'nowrap',
}
const tdStyle: React.CSSProperties = { padding: '14px 20px', fontSize: 14, color: '#333' }
const badge: React.CSSProperties = { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }
