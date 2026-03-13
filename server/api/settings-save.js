import { promises as fs } from 'fs';
import { join } from 'path';
import { getCookie } from 'h3';
import { isValidSession } from '../utils/userStore.js';

const SETTINGS_FILE = join(process.cwd(), 'server/config/settings.json');

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'admin_session');
  if (!(await isValidSession(session))) {
    return { success: false, error: 'Unauthorized' };
  }

  const body = await readBody(event);
  console.log('Received settings:', JSON.stringify(body, null, 2));
  
  try {
    // Valider og lagre innstillinger
    const settings = {
      polling: {
        printerInterval: Math.max(1000, Math.min(300000, body.polling?.printerInterval || 3000)),
        sensorInterval: Math.max(1000, Math.min(300000, body.polling?.sensorInterval || 10000))
      },
      homeAssistant: {
        baseUrl: body.homeAssistant?.baseUrl || 'http://homeassistant.local:8123',
        token: body.homeAssistant?.token || ''
      },
      logs: {
        retentionDays: Math.max(1, Math.min(365, body.logs?.retentionDays || 90))
      },
      ledThresholds: {
        green: Math.max(0, Math.min(100, body.ledThresholds?.green ?? 30)),
        yellow: Math.max(0, Math.min(100, body.ledThresholds?.yellow ?? 40)),
        orange: Math.max(0, Math.min(100, body.ledThresholds?.orange ?? 50))
      }
    };
    
    console.log('Saving settings to:', SETTINGS_FILE);
    console.log('Settings to save:', JSON.stringify(settings, null, 2));
    
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    
    console.log('Settings saved successfully');
    return { success: true, settings };
  } catch (e) {
    console.error('Error saving settings:', e);
    return { success: false, error: e.message || 'Kunne ikke lagre innstillinger' };
  }
});
