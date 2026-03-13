export default defineEventHandler(async () => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 4000)

  try {
    const res = await fetch('http://192.168.1.248/sensor_data.json', {
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    console.log('[filament-cabinet] Data hentet:', JSON.stringify(data))

    return {
      temperature1: data.temperature1 ?? null,
      temperature2: data.temperature2 ?? null,
      averageTemp: data.average_temp ?? null,
      humidity1: data.humidity1 ?? null,
      humidity2: data.humidity2 ?? null,
      averageHumidity: data.average_humidity ?? null,
      online: true,
      error: null
    }
  } catch (err) {
    clearTimeout(timeout)
    console.error('[filament-cabinet] Feil:', err?.message)
    return {
      temperature1: null,
      temperature2: null,
      averageTemp: null,
      humidity1: null,
      humidity2: null,
      averageHumidity: null,
      online: false,
      error: err?.message || 'Ukjent feil'
    }
  }
})
