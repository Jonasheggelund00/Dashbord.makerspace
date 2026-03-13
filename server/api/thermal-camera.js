export default defineEventHandler(async (event) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxZmVlNTU3OGRmODg0MmEzODE4MzhjODA2ZjEyNjYzYiIsImlhdCI6MTc2MTc0NDczOCwiZXhwIjoyMDc3MTA0NzM4fQ.pVtFPYynPhypCZRqlWymkAvqlqpyNqtIR15-KILzer8';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const baseUrl = 'http://homeassistant.local:8123/api/states';

  // Definer alle thermal camera sensorer
  const sensors = {
    min: 'sensor.thermal_camera_thermal_min',
    max: 'sensor.thermal_camera_thermal_max',
    average: 'sensor.thermal_camera_thermal_average',
    pixels: 'sensor.thermal_camera_thermal_pixels'
  };

  try {
    // Hent data fra alle sensorer parallelt
    const responses = await Promise.all(
      Object.entries(sensors).map(async ([key, entityId]) => {
        try {
          const res = await fetch(`${baseUrl}/${entityId}`, { headers });
          if (!res.ok) {
            console.error(`Feil ved henting av ${entityId}:`, res.status);
            return [key, { error: `Status ${res.status} for ${entityId}` }];
          }
          const data = await res.json();
          return [key, data];
        } catch (error) {
          console.error(`Feil ved henting av ${entityId}:`, error.message);
          return [key, { error: error.message }];
        }
      })
    );

    // Konverter til objekt
    const sensorDataMap = Object.fromEntries(responses);

    // Returner alltid 200 OK med feilmelding hvis mangler
    const errorMessages = [];
    for (const [key, val] of Object.entries(sensorDataMap)) {
      if (val && val.error) errorMessages.push(val.error);
    }

    return {
      min: sensorDataMap.min?.state ? parseFloat(sensorDataMap.min.state).toFixed(1) : null,
      max: sensorDataMap.max?.state ? parseFloat(sensorDataMap.max.state).toFixed(1) : null,
      average: sensorDataMap.average?.state ? parseFloat(sensorDataMap.average.state).toFixed(1) : null,
      pixels: sensorDataMap.pixels?.state || '',
      error: errorMessages.length > 0 ? errorMessages.join('; ') : null
    };
  } catch (error) {
    console.error('Ukjent feil ved henting av thermal camera data:', error.message);
    return {
      min: null,
      max: null,
      average: null,
      pixels: '',
      error: error.message || 'Ukjent feil'
    };
  }
});
