import { promises as fs } from 'fs';

const PRINTERS_FILE = 'server/api/printers.json';

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return { error: 'Kun POST støttes' };
  }
  const body = await readBody(event);
  const { ip, displayName } = body || {};
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
    const idx = printers.findIndex((p) => p.ip === ip);
    if (idx === -1) {
      return { error: 'Printer ikke funnet' };
    }
    printers[idx].displayName = displayName || '';
    await fs.writeFile(PRINTERS_FILE, JSON.stringify(printers, null, 2), 'utf-8');
    return { success: true };
  } catch (e) {
    return { error: 'Kunne ikke oppdatere navn' };
  }
});
