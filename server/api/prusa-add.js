import { promises as fs } from 'fs';

const PRINTERS_FILE = 'server/api/printers.json';

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    setResponseStatus(event, 400);
    return { error: 'Kun POST støttes' };
  }
  const body = await readBody(event);
  const { ip, apiKey, displayName } = body || {};
  if (!ip || !apiKey) {
    setResponseStatus(event, 400);
    return { error: 'IP og API Key må fylles ut' };
  }

  // Sjekk at printeren svarer på /api/v1/info
  try {
    console.log(`Prøver å kontakte printer på http://${ip}/api/v1/info`);
    const infoRes = await fetch(`http://${ip}/api/v1/info`, {
      headers: { 'X-Api-Key': apiKey },
      timeout: 3000
    });
    console.log('Response status:', infoRes.ok, infoRes.status);
    if (!infoRes.ok) {
      console.error('Fikk ikke ok respons fra printer');
      setResponseStatus(event, 400);
      return { error: 'Fikk ikke kontakt med printeren (info)' };
    }
    const info = await infoRes.json();
    console.log('Printer info:', info);
    
    // Les eksisterende printere fra fil
    let printers = [];
    try {
      const data = await fs.readFile(PRINTERS_FILE, 'utf-8');
      printers = JSON.parse(data);
    } catch (e) {
      // Filen finnes ikke, start med tom liste
      printers = [];
    }
    
    // Sjekk om IP allerede finnes
    if (printers.some((p) => p.ip === ip)) {
      setResponseStatus(event, 400);
      return { error: 'Printer med denne IP-en finnes allerede' };
    }
    
    // Legg til ny printer med displayName hvis satt
    const newPrinter = { ip, apiKey, hostname: info.hostname || '', displayName: displayName || '' };
    console.log('Legger til printer i liste:', newPrinter);
    printers.push(newPrinter);
    console.log('Totalt antall printere nå:', printers.length);
    
    // Skriv til fil og vent på at det er ferdig
    console.log('Skriver til fil:', PRINTERS_FILE);
    await fs.writeFile(PRINTERS_FILE, JSON.stringify(printers, null, 2), 'utf-8');
    console.log('Fil skrevet!');
    
    return { success: true };
  } catch (e) {
    console.error('Feil ved tillegging av printer:', e);
    setResponseStatus(event, 400);
    return { error: 'Fikk ikke kontakt med printeren (nettverk/API Key feil?)' };
  }
});
