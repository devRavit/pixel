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
  const isHealthy = health.status === 'UP'

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900">Pixel</h1>
        <p className="mt-2 text-lg text-gray-600">Frontend for Stash API</p>

        <hr className="my-8 border-gray-200" />

        <section>
          <h2 className="text-2xl font-semibold text-gray-800">API Health Check</h2>
          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span
                className={`inline-block h-3 w-3 rounded-full ${
                  isHealthy ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className={`font-medium ${isHealthy ? 'text-green-700' : 'text-red-700'}`}>
                {health.status}
              </span>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-md bg-gray-100 p-4 text-sm text-gray-700">
              {JSON.stringify(health, null, 2)}
            </pre>
          </div>
        </section>
      </div>
    </main>
  )
}
