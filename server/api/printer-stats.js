import { promises as fs } from 'fs';

const PRINTERS_FILE = 'server/api/printers.json';

// Hjelpefunksjon for fetch med timeout
async function fetchWithTimeout(resource, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Les printer-liste
    const data = await fs.readFile(PRINTERS_FILE, 'utf-8');
    const printers = JSON.parse(data);
    
    // Hent live status for alle printere
    const results = await Promise.all(printers.map(async ({ ip, apiKey }) => {
      let state = null;
      let hasError = false;
      
      try {
        const statusRes = await fetchWithTimeout(`http://${ip}/api/v1/status`, {
          headers: { 'X-Api-Key': apiKey }
        }, 1000);
        
        if (statusRes.ok) {
          const status = await statusRes.json();
          state = status?.printer?.state;
        } else {
          hasError = true;
        }
      } catch (e) {
        hasError = true;
      }
      
      return { state, hasError };
    }));
    
    // Tell antall printere i hver kategori
    let printing = 0;
    let idle = 0;
    let finished = 0;
    let attention = 0;
    let error = 0;
    
    results.forEach((printer) => {
      if (printer.hasError) {
        error++;
        return;
      }
      
      const state = printer.state?.toUpperCase();
      switch (state) {
        case 'PRINTING':
          printing++;
          break;
        case 'IDLE':
        case 'READY':
          idle++;
          break;
        case 'FINISHED':
          finished++;
          break;
        case 'ATTENTION':
        case 'BUSY':
          attention++;
          break;
        case 'STOPPED':
        case 'ERROR':
          error++;
          break;
        default:
          idle++; // Default til idle hvis ukjent state
      }
    });
    
    return {
      success: true,
      stats: {
        printing,
        idle,
        finished,
        attention,
        error,
        total: printers.length
      }
    };
  } catch (e) {
    return {
      success: false,
      error: 'Kunne ikke hente printer-statistikk',
      stats: {
        printing: 0,
        idle: 0,
        finished: 0,
        attention: 0,
        error: 0,
        total: 0
      }
    };
  }
});
