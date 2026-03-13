import { promises as fs } from 'fs';
import { join } from 'path';

const SETTINGS_FILE = join(process.cwd(), 'server/config/settings.json');

export default defineEventHandler(async (event) => {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    const settings = JSON.parse(data);
    return { success: true, settings };
  } catch (e) {
    // Return default settings if file doesn't exist
    return {
      success: true,
      settings: {
        polling: {
          printerInterval: 3000,
          sensorInterval: 10000
        },
        homeAssistant: {
          baseUrl: 'http://homeassistant.local:8123',
          token: ''
        },
        logs: {
          retentionDays: 90
        },
        ledThresholds: {
          green: 30,
          yellow: 40,
          orange: 50
        }
      }
    };
  }
});
