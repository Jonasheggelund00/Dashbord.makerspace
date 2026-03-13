export default defineEventHandler(async (event) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxZmVlNTU3OGRmODg0MmEzODE4MzhjODA2ZjEyNjYzYiIsImlhdCI6MTc2MTc0NDczOCwiZXhwIjoyMDc3MTA0NzM4fQ.pVtFPYynPhypCZRqlWymkAvqlqpyNqtIR15-KILzer8';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const baseUrl = 'http://homeassistant.local:8123/api/states';

  // Simple in-memory cache to avoid hitting ESP32 too often
  // Cached for CACHE_TTL ms between actual ESP32 requests
  // NOTE: module-level in-memory cache is fine for single-process dev server
  if (typeof globalThis.__thermalCache === 'undefined') {
    globalThis.__thermalCache = {
      timestamp: 0,
      pixels1: '',
      pixels2: '',
      pixels3: '',
      pixels4: '',
      thermalMin: '0.0',
      thermalMax: '0.0',
      thermalAvg: '0.0'
    };
  }
  const CACHE_TTL = 100; // ms, match faster ESP32 update_interval (e.g. 100ms -> ~10 FPS)
  // Definer alle sensorer - hent alt fra Home Assistant (unngå å overbelaste ESP32)
  const sensors = {
    vibration: 'binary_sensor.vibrasjon_sensor_2_stabil', // (stabil) template sensor
    tilt: 'binary_sensor.vibration_sensors_2_tilt',      // Tuya
    drop: 'binary_sensor.vibration_sensors_2_drop',      // Tuya
    battery: 'sensor.vibration_sensors_2_batteri',        // Tuya
    thermalMin: 'sensor.thermal_camera_thermal_min',
    thermalMax: 'sensor.thermal_camera_thermal_max',
    thermalAvg: 'sensor.thermal_camera_thermal_average'
  };

  try {
    // Hent vibrasjon data fra Home Assistant
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

    const sensorDataMap = Object.fromEntries(responses);

    // Hent kun pixel data fra ESP32 - gjør SEKVENSIELT, ikke parallelt!
    let pixels1 = '', pixels2 = '', pixels3 = '', pixels4 = '';
    let thermalStale = false;
    const prevCache = globalThis.__thermalCache;
    
    // If cache is fresh, use cached pixel values and skip ESP32 requests
    const now = Date.now();
    if (now - globalThis.__thermalCache.timestamp < CACHE_TTL) {
      pixels1 = globalThis.__thermalCache.pixels1 || '';
      pixels2 = globalThis.__thermalCache.pixels2 || '';
      pixels3 = globalThis.__thermalCache.pixels3 || '';
      pixels4 = globalThis.__thermalCache.pixels4 || '';
      // Also copy min/max/avg from cache so UI stays consistent
      sensorDataMap.thermalMin = { state: globalThis.__thermalCache.thermalMin };
      sensorDataMap.thermalMax = { state: globalThis.__thermalCache.thermalMax };
      sensorDataMap.thermalAvg = { state: globalThis.__thermalCache.thermalAvg };
    } else {
      try {
      const esp32Auth = 'Basic ' + Buffer.from('admin:admin').toString('base64');
      const esp32Headers = { 'Authorization': esp32Auth };

      // Helper: fetch with timeout and simple retry logic
      async function fetchWithTimeoutRetry(url, options = {}, timeout = 5000, retries = 2, retryDelay = 200) {
        for (let attempt = 1; attempt <= retries + 1; attempt++) {
          try {
            const res = await fetch(url, { ...options, signal: AbortSignal.timeout(timeout) });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
          } catch (err) {
            console.error(`ESP32 fetch failed (${url}) attempt ${attempt}:`, err.message);
            if (attempt <= retries) await new Promise(r => setTimeout(r, retryDelay));
            else throw err;
          }
        }
      }

      // Hent pixel data sekvensielt med litt større delay mellom requests
      try {
        const d1 = await fetchWithTimeoutRetry('http://thermal-camera.local/text_sensor/thermal_pixels_1', { headers: esp32Headers }, 5000, 2, 200);
        pixels1 = d1?.value || '';
      } catch (e) { pixels1 = ''; }

          // small gaps between requests (20ms) to avoid hammering ESP32, but keep low for high FPS
          await new Promise(resolve => setTimeout(resolve, 20));

      try {
        const d2 = await fetchWithTimeoutRetry('http://thermal-camera.local/text_sensor/thermal_pixels_2', { headers: esp32Headers }, 5000, 2, 200);
        pixels2 = d2?.value || '';
      } catch (e) { pixels2 = ''; }

          await new Promise(resolve => setTimeout(resolve, 20));

      try {
        const d3 = await fetchWithTimeoutRetry('http://thermal-camera.local/text_sensor/thermal_pixels_3', { headers: esp32Headers }, 5000, 2, 200);
        pixels3 = d3?.value || '';
      } catch (e) { pixels3 = ''; }

          await new Promise(resolve => setTimeout(resolve, 20));

      try {
        const d4 = await fetchWithTimeoutRetry('http://thermal-camera.local/text_sensor/thermal_pixels_4', { headers: esp32Headers }, 5000, 2, 200);
        pixels4 = d4?.value || '';
      } catch (e) { pixels4 = ''; }

      console.log('ESP32 pixel data fetched (with retries)');

      // Determine which parts actually fetched; if none fetched, fallback to previous cache
      const anyFetched = Boolean(pixels1 || pixels2 || pixels3 || pixels4);

      if (!anyFetched) {
        // No fresh data — fallback to previous cache
        pixels1 = prevCache.pixels1 || '';
        pixels2 = prevCache.pixels2 || '';
        pixels3 = prevCache.pixels3 || '';
        pixels4 = prevCache.pixels4 || '';
        thermalStale = true;
      } else {
        // Merge: for any empty part, keep previous cache part
        if (!pixels1 && prevCache.pixels1) pixels1 = prevCache.pixels1;
        if (!pixels2 && prevCache.pixels2) pixels2 = prevCache.pixels2;
        if (!pixels3 && prevCache.pixels3) pixels3 = prevCache.pixels3;
        if (!pixels4 && prevCache.pixels4) pixels4 = prevCache.pixels4;

        // Update cache timestamp and values for parts we have
        globalThis.__thermalCache.timestamp = Date.now();
        if (pixels1) globalThis.__thermalCache.pixels1 = pixels1;
        if (pixels2) globalThis.__thermalCache.pixels2 = pixels2;
        if (pixels3) globalThis.__thermalCache.pixels3 = pixels3;
        if (pixels4) globalThis.__thermalCache.pixels4 = pixels4;
        globalThis.__thermalCache.thermalMin = sensorDataMap.thermalMin?.state || globalThis.__thermalCache.thermalMin;
        globalThis.__thermalCache.thermalMax = sensorDataMap.thermalMax?.state || globalThis.__thermalCache.thermalMax;
        globalThis.__thermalCache.thermalAvg = sensorDataMap.thermalAvg?.state || globalThis.__thermalCache.thermalAvg;
      }
      
      } catch (esp32Error) {
        console.error('ESP32 fetch error:', esp32Error.message);
        // On error, fallback to previous cache values and mark stale
        pixels1 = prevCache.pixels1 || '';
        pixels2 = prevCache.pixels2 || '';
        pixels3 = prevCache.pixels3 || '';
        pixels4 = prevCache.pixels4 || '';
        thermalStale = true;
      }
    }

    const errorMessages = [];
    for (const [key, val] of Object.entries(sensorDataMap)) {
      if (val && val.error) errorMessages.push(val.error);
    }

    return {
      // Vibrasjon fra Home Assistant
      vibration: sensorDataMap.vibration?.state === 'on' || false,
      tilt: sensorDataMap.tilt?.state === 'on' || false,
      drop: sensorDataMap.drop?.state === 'on' || false,
      battery: sensorDataMap.battery?.state ? parseInt(sensorDataMap.battery.state) : 0,
      
      // Thermal min/max/avg fra Home Assistant (cached fra ESP32)
      thermalMin: sensorDataMap.thermalMin?.state ? parseFloat(sensorDataMap.thermalMin.state).toFixed(1) : '0.0',
      thermalMax: sensorDataMap.thermalMax?.state ? parseFloat(sensorDataMap.thermalMax.state).toFixed(1) : '0.0',
      thermalAvg: sensorDataMap.thermalAvg?.state ? parseFloat(sensorDataMap.thermalAvg.state).toFixed(1) : '0.0',
      
      // Pixel data direkte fra ESP32 (sekvensielt)
      thermalPixels1: pixels1,
      thermalPixels2: pixels2,
      thermalPixels3: pixels3,
      thermalPixels4: pixels4,
      thermalStale,
      
      last_updated: sensorDataMap.vibration?.last_updated || new Date().toISOString(),
      error: errorMessages.length > 0 ? errorMessages.join('; ') : undefined
    };
  } catch (error) {
    console.error('Feil ved henting av loddestasjon sensor data:', error.message);
    // Returner default verdier i stedet for error objekt
    return {
      vibration: false,
      tilt: false,
      drop: false,
      battery: 0,
      thermalMin: '0.0',
      thermalMax: '0.0',
      thermalAvg: '0.0',
      thermalPixels1: '',
      thermalPixels2: '',
      thermalPixels3: '',
      thermalPixels4: '',
      last_updated: new Date().toISOString(),
      error: error.message
    };
  }
});