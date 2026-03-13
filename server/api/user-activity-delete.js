import { promises as fs } from 'fs';
import { getCookie } from 'h3';
import { join } from 'path';
import { isValidSession } from '../utils/userStore.js';

const ACTIVITY_FILE = join(process.cwd(), 'server/api/user-activity.json');

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'admin_session');
  if (!(await isValidSession(session))) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await fs.writeFile(ACTIVITY_FILE, JSON.stringify([], null, 2), 'utf-8');
    return { success: true, message: 'Brukerloggen ble slettet' };
  } catch (error) {
    console.error('Feil ved sletting av brukerlogg:', error);
    return { success: false, error: error.message };
  }
});
