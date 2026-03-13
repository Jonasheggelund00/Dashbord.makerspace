import { promises as fs } from 'fs';

const PRINTERS_FILE = 'server/api/printers.json';

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return { error: 'Kun POST støttes' };
  }
  const body = await readBody(event);
  const { ip } = body || {};
  if (!ip) {
    return { error: 'IP må oppgis' };
  }
  try {
    let printers = [];
    try {
      const data = await fs.readFile(PRINTERS_FILE, 'utf-8');
      printers = JSON.parse(data);
    } catch (e) {
      printers = [];
    }
    const newPrinters = printers.filter((p) => p.ip !== ip);
    await fs.writeFile(PRINTERS_FILE, JSON.stringify(newPrinters, null, 2), 'utf-8');
    return { success: true };
  } catch (e) {
    return { error: 'Kunne ikke slette printer' };
  }
});
