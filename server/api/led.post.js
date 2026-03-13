import { promises as fs } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const { temperature } = await readBody(event)

  // Les terskelverdier fra innstillinger, fall tilbake på standardverdier
  let thresholds = { green: 30, yellow: 40, orange: 50 }
  try {
    const settingsFile = join(process.cwd(), 'server/config/settings.json')
    const data = await fs.readFile(settingsFile, 'utf-8')
    const settings = JSON.parse(data)
    if (settings.ledThresholds) thresholds = settings.ledThresholds
  } catch (e) {
    // Bruk standardverdier ved feil
  }

  let rgb
  if (temperature <= thresholds.green)        rgb = [0, 255, 0]       // grønn
  else if (temperature <= thresholds.yellow)  rgb = [255, 200, 0]     // gul
  else if (temperature <= thresholds.orange)  rgb = [255, 80, 0]      // oransje
  else                                        rgb = [255, 0, 0]       // rød

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI5YWNiODU3NjkxM2Y0ZTcxYTA0NmQzOTM0MDE0ZDU1ZSIsImlhdCI6MTc3MjY0MDgwMCwiZXhwIjoyMDg4MDAwODAwfQ.kz4PJrvZN8hZHZw4MoQTjrKgMIYZWrJTFOEmeGU28go'
  const haUrl = 'http://homeassistant.local:8123/api/services/light/turn_on'

  try {
    const result = await fetch(haUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        entity_id: 'light.led_led_strip',
        rgb_color: rgb,
        brightness: 200,
        transition: 2
      })
    })
    const data = await result.json()
    return { ok: result.ok, haStatus: result.status, rgb, haBody: data }
  } catch (err) {
    return { ok: false, error: err?.message }
  }
})
