import { getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  // Hent status og effekt fra Home Assistant via server-side proxy
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxZmVlNTU3OGRmODg0MmEzODE4MzhjODA2ZjEyNjYzYiIsImlhdCI6MTc2MTc0NDczOCwiZXhwIjoyMDc3MTA0NzM4fQ.pVtFPYynPhypCZRqlWymkAvqlqpyNqtIR15-KILzer8';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Hent device-type fra query (?device=laserkutter eller ?device=loddestasjon)
  const { device } = getQuery(event);

  // Sett entitetsnavn basert på valgt device
  let switchEntity, powerEntity;
  if (device === 'laserkutter') {
    switchEntity = 'switch.laserkutter_wall_plug';
    powerEntity = 'sensor.laserkutter_wall_plug_power'; // Sjekk at denne finnes, evt. endre
  } else {
    // Default til loddestasjon
    switchEntity = 'switch.metered_wall_plug_switch';
    powerEntity = 'sensor.metered_wall_plug_switch_power';
  }

  const resSwitch = await fetch(`http://homeassistant.local:8123/api/states/${switchEntity}`, { headers });
  const resPower = await fetch(`http://homeassistant.local:8123/api/states/${powerEntity}`, { headers });

  let dataSwitch, dataPower;
  try { dataSwitch = await resSwitch.json(); } catch (e) { dataSwitch = null; }
  try { dataPower = await resPower.json(); } catch (e) { dataPower = null; }

  if (!dataSwitch || !dataPower) {
    return { error: 'Kunne ikke hente data fra Home Assistant', status: resSwitch.status };
  }
  return {
    state: dataSwitch.state,
    friendly_name: dataSwitch.attributes.friendly_name,
    power: dataPower.state,
    power_unit: dataPower.attributes.unit_of_measurement
  };
});
