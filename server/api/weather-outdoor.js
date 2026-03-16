export default defineEventHandler(async () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxZmVlNTU3OGRmODg0MmEzODE4MzhjODA2ZjEyNjYzYiIsImlhdCI6MTc2MTc0NDczOCwiZXhwIjoyMDc3MTA0NzM4fQ.pVtFPYynPhypCZRqlWymkAvqlqpyNqtIR15-KILzer8';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    const res = await fetch('http://homeassistant.local:8123/api/states/weather.forecast_hjem', { headers });
    if (!res.ok) {
      return {
        success: false,
        error: `Status ${res.status}`,
        weather: {
          state: 'unknown',
          temperature: null,
          humidity: null,
          windSpeed: null,
          forecast: '—'
        }
      };
    }

    const data = await res.json();
    const attributes = data?.attributes || {};

    return {
      success: true,
      weather: {
        state: data?.state || 'unknown',
        temperature: attributes.temperature ?? null,
        humidity: attributes.humidity ?? null,
        windSpeed: attributes.wind_speed ?? null,
        forecast: attributes.friendly_name || 'Hjem'
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Kunne ikke hente værdata',
      weather: {
        state: 'unknown',
        temperature: null,
        humidity: null,
        windSpeed: null,
        forecast: '—'
      }
    };
  }
});
