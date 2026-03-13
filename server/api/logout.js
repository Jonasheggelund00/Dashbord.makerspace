import { clearSession } from '../middleware/auth.js';
import { promises as fs } from 'fs';
import { getCookie } from 'h3';

const ACTIVITY_FILE = 'server/api/user-activity.json';

async function logUserActivity(username, action, ip) {
  try {
    let logs = [];
    try {
      const data = await fs.readFile(ACTIVITY_FILE, 'utf-8');
      logs = JSON.parse(data);
    } catch (e) {
      logs = [];
    }
    
    const activity = {
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      username,
      action,
      ip
    };
    
    logs.unshift(activity);
    
    // Behold kun de siste 500 loggene
    if (logs.length > 500) {
      logs = logs.slice(0, 500);
    }
    
    await fs.writeFile(ACTIVITY_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (e) {
    console.error('Feil ved logging av brukeraktivitet:', e);
  }
}

export default defineEventHandler(async (event) => {
  // Hent brukernavn før vi sletter sesjonen
  const username = getCookie(event, 'admin_session') || 'Ukjent';
  const ip = event.node.req.headers['x-forwarded-for'] || 
             event.node.req.socket.remoteAddress || 
             'unknown';
  
  clearSession(event);
  
  // Logg utlogging
  await logUserActivity(username, 'logout', ip);
  
  return { status: 200 };
});
