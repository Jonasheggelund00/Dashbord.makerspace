import { logActivity } from '../utils/logger.js';

const LASERKUTTER_DEVICE_NAME = 'Laserkutter';
let lastLaserInUse = null;

async function maybeLogLaserkutterUsage(inUse, sensorUpdated) {
  if (typeof inUse !== 'boolean') return;

  if (lastLaserInUse === null) {
    lastLaserInUse = inUse;
    return;
  }

  if (lastLaserInUse === inUse) return;

  lastLaserInUse = inUse;
  const logType = inUse ? 'laserkutter_in_use' : 'laserkutter_idle';

  try {
    const metadata = { inUse };
    if (sensorUpdated) {
      metadata.sensorUpdated = sensorUpdated;
    }

    await logActivity({
      type: logType,
      device: LASERKUTTER_DEVICE_NAME,
      metadata
    });
  } catch (e) {
    console.error('Feil ved logging av laserkutter bruk:', e);
  }
}

export default defineEventHandler(async (event) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxZmVlNTU3OGRmODg0MmEzODE4MzhjODA2ZjEyNjYzYiIsImlhdCI6MTc2MTc0NDczOCwiZXhwIjoyMDc3MTA0NzM4fQ.pVtFPYynPhypCZRqlWymkAvqlqpyNqtIR15-KILzer8';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const baseUrl = 'http://homeassistant.local:8123/api/states';

  // Definer alle sensorer (fra Home Assistant - ADXL345)
  const sensors = {
    x: 'sensor.adxl345_sensor_laserkutter_x_akse',
    y: 'sensor.adxl345_sensor_laserkutter_y_akse',
    z: 'sensor.adxl345_sensor_laserkutter_z_akse',
    total: 'sensor.adxl345_sensor_laserkutter_total_bevegelse',
    inUse: 'binary_sensor.adxl345_sensor_laserkutter_i_bruk'
  };

  try {
    // Hent data fra alle sensorer parallelt
    const responses = await Promise.all(
      Object.entries(sensors).map(async ([key, entityId]) => {
        try {
          const res = await fetch(`${baseUrl}/${entityId}`, { headers });
          if (!res.ok) {
            console.error(`Feil ved henting av ${entityId}:`, res.status);
            return [key, null];
          }
          const data = await res.json();
          return [key, data];
        } catch (error) {
          console.error(`Feil ved henting av ${entityId}:`, error.message);
          return [key, null];
        }
      })
    );

    // Konverter til objekt
    const sensorDataMap = Object.fromEntries(responses);

    // Hvis ingen data hentet, returner feilmelding
    if (!sensorDataMap.x && !sensorDataMap.inUse) {
      console.error('Ingen sensordata mottatt');
      return {
        error: 'Kunne ikke hente sensordata',
        x: 0,
        y: 0,
        z: 0,
        total: 0,
        inUse: false,
        last_updated: new Date().toISOString()
      };
    }

    // Parse tallverdier og boolean
    const parseNumber = (val) => {
      if (!val || typeof val.state === 'undefined') return 0
      const n = parseFloat(val.state)
      return Number.isFinite(n) ? Number(n.toFixed(2)) : 0
    }

    const hasInUseData = sensorDataMap.inUse && typeof sensorDataMap.inUse.state !== 'undefined'
    const inUse = hasInUseData ? sensorDataMap.inUse.state === 'on' : null

    if (inUse !== null) {
      await maybeLogLaserkutterUsage(inUse, sensorDataMap.inUse?.last_updated)
    }

    return {
      x: parseNumber(sensorDataMap.x),
      y: parseNumber(sensorDataMap.y),
      z: parseNumber(sensorDataMap.z),
      total: parseNumber(sensorDataMap.total),
      inUse: inUse === null ? false : inUse,
      last_updated: sensorDataMap.inUse?.last_updated || new Date().toISOString()
    };
  } catch (error) {
    console.error('Feil ved henting av laserkutter sensor data:', error.message);
    // Returner default verdier i stedet for error objekt
    return {
      vibration: false,
      tilt: false,
      drop: false,
      battery: 0,
      last_updated: new Date().toISOString(),
      error: error.message
    };
  }
});
