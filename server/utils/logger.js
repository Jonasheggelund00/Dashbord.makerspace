import { promises as fs } from 'fs';

const LOG_FILE = 'server/api/activity-log.json';

/**
 * Logger en hendelse til logg-filen
 * @param {Object} entry - Loggoppføring
 * @param {string} entry.type - Type hendelse: 'printer_start', 'printer_end', 'printer_stopped', 'printer_error',
 * 'printer_attention', 'laserkutter_on', 'laserkutter_off', 'laserkutter_in_use', 'laserkutter_idle',
 * 'loddestasjon_on', 'loddestasjon_off', 'loddestasjon_in_use', 'loddestasjon_idle', 'storformat_in_use', 'storformat_idle'
 * @param {string} entry.device - Enhetsnamn (f.eks. 'Prusa MK4S', 'Laserkutter', 'Loddestasjon')
 * @param {Object} entry.metadata - Ekstra data (f.eks. filnavn, filament type, osv.)
 */
export async function logActivity(entry) {
  try {
    // Les eksisterende logger
    let logs = [];
    try {
      const data = await fs.readFile(LOG_FILE, 'utf-8');
      logs = JSON.parse(data);
    } catch (e) {
      // Filen finnes ikke ennå, start med tom array
      logs = [];
    }

    // Legg til ny logg med timestamp
    const logEntry = {
      id: Date.now() + Math.random().toString(36).substr(2, 9), // Unik ID
      timestamp: new Date().toISOString(),
      ...entry
    };

    logs.unshift(logEntry); // Legg til først (nyeste først)

    // Behold bare de siste 1000 oppføringene for å ikke få for stor fil
    if (logs.length > 1000) {
      logs = logs.slice(0, 1000);
    }

    // Lagre tilbake til fil
    await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
    
    return { success: true, entry: logEntry };
  } catch (error) {
    console.error('Feil ved logging:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Henter aktivitetslogger, med valgfri filtrering
 * @param {Object} options - Filtreringsalternativer
 * @param {number} options.limit - Maks antall oppføringer
 * @param {string} options.type - Filtrer på type
 * @param {string} options.device - Filtrer på enhet
 */
export async function getActivityLogs(options = {}) {
  try {
    const data = await fs.readFile(LOG_FILE, 'utf-8');
    let logs = JSON.parse(data);

    // Filtrer hvis nødvendig
    if (options.type) {
      logs = logs.filter(log => log.type === options.type);
    }
    if (options.device) {
      logs = logs.filter(log => log.device === options.device);
    }

    // Begrens antall
    if (options.limit) {
      logs = logs.slice(0, options.limit);
    }

    return { success: true, logs };
  } catch (error) {
    // Hvis filen ikke finnes, returner tom array
    if (error.code === 'ENOENT') {
      return { success: true, logs: [] };
    }
    console.error('Feil ved henting av logger:', error);
    return { success: false, error: error.message, logs: [] };
  }
}

/**
 * Sletter en spesifikk logg basert på ID
 * @param {string} logId - ID til loggen som skal slettes
 */
export async function deleteLog(logId) {
  try {
    const data = await fs.readFile(LOG_FILE, 'utf-8');
    let logs = JSON.parse(data);

    // Filtrer ut loggen som skal slettes
    const originalLength = logs.length;
    logs = logs.filter(log => log.id !== logId);

    if (logs.length === originalLength) {
      throw new Error('Logg ikke funnet');
    }

    await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Feil ved sletting av logg:', error);
    throw error;
  }
}

/**
 * Sletter alle logger
 */
export async function clearAllLogs() {
  try {
    await fs.writeFile(LOG_FILE, JSON.stringify([], null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Feil ved sletting av alle logger:', error);
    throw error;
  }
}
