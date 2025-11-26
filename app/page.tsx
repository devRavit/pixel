async function getHealth() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STASH_API_URL}/health`,
      { cache: 'no-store' }
    )
    if (!res.ok) throw new Error('API error')
    return await res.json()
  } catch (error) {
    return { status: 'ERROR', error: String(error) }
  }
}

export default async function Home() {
  const health = await getHealth()

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Pixel</h1>
      <p>Frontend for Stash API</p>

      <hr style={{ margin: '2rem 0' }} />

      <h2>API Health Check</h2>
      <pre style={{
        background: '#f4f4f4',
        padding: '1rem',
        borderRadius: '8px'
      }}>
        {JSON.stringify(health, null, 2)}
      </pre>
    </main>
  )
}
