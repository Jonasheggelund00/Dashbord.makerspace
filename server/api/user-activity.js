import { promises as fs } from 'fs';

const ACTIVITY_FILE = 'server/api/user-activity.json';

export default defineEventHandler(async (event) => {
  try {
    const data = await fs.readFile(ACTIVITY_FILE, 'utf-8');
    const logs = JSON.parse(data);
    return { logs };
  } catch (e) {
    // Hvis filen ikke finnes, returner tom liste
    return { logs: [] };
  }
});
