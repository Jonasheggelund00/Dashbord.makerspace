import { getQuery, readBody } from 'h3';
import { logActivity } from '../utils/logger.js';

export default defineEventHandler(async (event) => {
  // Hent token og headers
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzNDMwYWY3MzAwMTI0MzI5ODU4YmVhODUxZGIzNzI4YiIsImlhdCI6MTc1ODcxMjcyMSwiZXhwIjoyMDc0MDcyNzIxfQ.EDfb-UUMrArWIneQtdVLeWlAJlOR62dLFiCkQZppKu0';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Les body for device
  const body = await readBody(event);
  const device = body?.device;

  let switchEntity;
  let deviceName;
  if (device === 'laserkutter') {
    switchEntity = 'switch.laserkutter_wall_plug';
    deviceName = 'Laserkutter';
  } else {
    switchEntity = 'switch.metered_wall_plug_switch';
    deviceName = 'Loddestasjon';
  }

  // Hent nåværende status først for å vite om vi slår på eller av
  const statusRes = await fetch(`http://homeassistant.local:8123/api/states/${switchEntity}`, {
    headers
  });
  
  let currentState = 'unknown';
  if (statusRes.ok) {
    const stateData = await statusRes.json();
    currentState = stateData.state;
  }

  // Toggle switch
  const res = await fetch('http://homeassistant.local:8123/api/services/switch/toggle', {
    method: 'POST',
    headers,
    body: JSON.stringify({ entity_id: switchEntity })
  });

  if (!res.ok) {
    return { success: false, error: 'Kunne ikke endre status', status: res.status };
  }

  // Logg hendelsen basert på hva som skjedde
  // Hvis den var "off", blir den nå "on", og omvendt
  const newState = currentState === 'on' ? 'off' : 'on';
  const logType = device === 'laserkutter' 
    ? (newState === 'on' ? 'laserkutter_on' : 'laserkutter_off')
    : (newState === 'on' ? 'loddestasjon_on' : 'loddestasjon_off');

  // Logg hendelsen, men ikke la logging-feil stoppe responsen
  try {
    await logActivity({
      type: logType,
      device: deviceName,
      metadata: {
        action: newState === 'on' ? 'Slått på' : 'Slått av',
        previousState: currentState
      }
    });
  } catch (logError) {
    console.error('Feil ved logging av hendelse:', logError);
  }

  return { success: true };
});
