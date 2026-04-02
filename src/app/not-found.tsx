export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 72, fontWeight: 700, color: '#ddd', margin: 0 }}>404</h1>
        <p style={{ fontSize: 20, color: '#888', marginTop: 8 }}>Tenant not found or inactive.</p>
      </div>
    </div>
  )
}
