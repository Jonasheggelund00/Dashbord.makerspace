export default defineEventHandler(async (event) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxZmVlNTU3OGRmODg0MmEzODE4MzhjODA2ZjEyNjYzYiIsImlhdCI6MTc2MTc0NDczOCwiZXhwIjoyMDc3MTA0NzM4fQ.pVtFPYynPhypCZRqlWymkAvqlqpyNqtIR15-KILzer8';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const baseUrl = 'http://homeassistant.local:8123/api/states';

  // Definer alle sensorer med riktige entity IDs fra Home Assistant
  const sensors = {
    temperature: 'sensor.multisensor_2_air_temperature',
    humidity: 'sensor.multisensor_2_humidity',
    illuminance: 'sensor.multisensor_2_illuminance',
    motion: 'binary_sensor.multisensor_2_motion_detection',
    uv: 'sensor.multisensor_2_ultraviolet',
    vibration: 'binary_sensor.multisensor_2_tampering_product_cover_removed', // Tamper sensor (vibrasjon/tampering)
    battery: 'sensor.multisensor_2_battery_level',
    nodeStatus: 'sensor.multisensor_2_node_status'
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
          console.error(`Feil ved henting av ${entityId}:`, error);
          return [key, null];
        }
      })
    );

    // Konverter til objekt
    const sensorDataMap = Object.fromEntries(responses);

    // Finn den nyeste last_updated tidsstempelet fra alle sensorer
    let latestUpdate = null;
    Object.values(sensorDataMap).forEach(sensor => {
      if (sensor && sensor.last_updated) {
        const updateTime = new Date(sensor.last_updated);
        if (!latestUpdate || updateTime > latestUpdate) {
          latestUpdate = updateTime;
        }
      }
    });

    // Returner strukturert data med Home Assistant sitt timestamp
    return {
      temperature: sensorDataMap.temperature?.state || null,
      humidity: sensorDataMap.humidity?.state || null,
      illuminance: sensorDataMap.illuminance?.state || null,
      motion: sensorDataMap.motion?.state || 'off',
      uv: sensorDataMap.uv?.state || null,
      vibration: sensorDataMap.vibration?.state || null,
      battery: sensorDataMap.battery?.state || null,
      nodeStatus: sensorDataMap.nodeStatus?.state || null,
      last_updated: latestUpdate ? latestUpdate.toISOString() : null
    };
  } catch (error) {
    console.error('Feil ved henting av multisensor data:', error);
    return {
      error: 'Kunne ikke hente data fra Home Assistant',
      message: error.message
    };
  }
});
