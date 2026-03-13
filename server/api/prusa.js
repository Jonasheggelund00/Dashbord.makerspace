import { promises as fs } from 'fs';
import { logActivity } from '../utils/logger.js';

const PRINTERS_FILE = 'server/api/printers.json';
const PRINTER_STATE_FILE = 'server/api/printer-states.json';

// In-memory cache for printer states (reduserer disk I/O)
let printerStatesCache = null;
let cacheLastLoaded = null;
const CACHE_PERSIST_INTERVAL = 30000; // Lagre til disk hver 30. sekund

// Hjelpefunksjon for å laste printer-states fra fil eller cache
async function loadPrinterStates() {
  // Hvis cache finnes og er nylig lastet, returner den
  if (printerStatesCache !== null && cacheLastLoaded && (Date.now() - cacheLastLoaded < CACHE_PERSIST_INTERVAL)) {
    return printerStatesCache;
  }

  // Last fra fil
  try {
    const data = await fs.readFile(PRINTER_STATE_FILE, 'utf-8');
    printerStatesCache = JSON.parse(data);
    cacheLastLoaded = Date.now();
  } catch (e) {
    printerStatesCache = {};
    cacheLastLoaded = Date.now();
  }
  
  return printerStatesCache;
}

// Hjelpefunksjon for å lagre printer-states (med throttling)
let saveTimeout = null;
async function savePrinterStates(states) {
  printerStatesCache = states;
  
  // Throttle: lagre kun til disk hvert 30. sekund
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(async () => {
    try {
      await fs.writeFile(PRINTER_STATE_FILE, JSON.stringify(states, null, 2), 'utf-8');
    } catch (e) {
      console.error('Feil ved lagring av printer-states:', e);
    }
  }, CACHE_PERSIST_INTERVAL);
}

// Hjelpefunksjon for fetch med timeout
async function fetchWithTimeout(resource, options = {}, timeout = 1000) {
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

// Hjelpefunksjon for å sjekke og logge printer-tilstandsendringer
async function checkAndLogPrinterState(ip, currentState, hostname, displayName, jobInfo) {
  try {
    // Les tidligere tilstander fra cache
    const states = await loadPrinterStates();

    const previousState = states[ip];
    
    // Bare logg hvis vi har en tidligere tilstand å sammenligne med
    const hasValidPreviousState = previousState !== undefined && previousState !== null;

    // Sjekk om tilstanden faktisk har endret seg siden forrige gang
    const stateHasChanged = !previousState || previousState.state !== currentState;

    // Logg kun hvis tilstanden har endret seg OG vi har en gyldig tidligere tilstand
    if (hasValidPreviousState && stateHasChanged && currentState) {
      const stateUpper = currentState.toUpperCase();
      
      // Definer hvilke tilstander som skal logges
      const loggableStates = ['PRINTING', 'FINISHED', 'STOPPED', 'ERROR', 'ATTENTION'];
      
      if (loggableStates.includes(stateUpper)) {
        // VIKTIG: Oppdater cache FØRST for å forhindre duplikater
        states[ip] = {
          state: currentState,
          lastUpdate: new Date().toISOString(),
          logged: true
        };
        
        const metadata = {
          state: currentState,
          hostname: hostname,
          ip: ip
        };

        // Legg til filnavn hvis tilgjengelig
        if (jobInfo?.filename) {
          metadata.filename = jobInfo.filename;
        }

        // Bestem log-type basert på tilstand
        let logType = 'printer_state_change'; // default
        
        if (stateUpper === 'PRINTING') {
          logType = 'printer_start';
        } else if (stateUpper === 'FINISHED') {
          logType = 'printer_end';
        } else if (stateUpper === 'STOPPED') {
          logType = 'printer_stopped';
        } else if (stateUpper === 'ERROR') {
          logType = 'printer_error';
        } else if (stateUpper === 'ATTENTION') {
          logType = 'printer_attention';
        }

        await logActivity({
          type: logType,
          device: displayName || hostname || ip,
          metadata: metadata
        });
        
        // Lagre til disk (throttled)
        await savePrinterStates(states);
      } else {
        // Oppdater tilstand i cache selv om vi ikke logger
        states[ip] = {
          state: currentState,
          lastUpdate: new Date().toISOString(),
          logged: false
        };
        await savePrinterStates(states);
      }
    } else if (stateHasChanged) {
      // Tilstanden har endret seg, men vi logger ikke (første gang eller ikke loggbar tilstand)
      states[ip] = {
        state: currentState,
        lastUpdate: new Date().toISOString(),
        logged: false
      };
      await savePrinterStates(states);
    }
  } catch (e) {
    console.error('Feil ved sjekk av printer-tilstand:', e);
  }
}

export default defineEventHandler(async (event) => {
  // Hent printere fra fil
  let PRINTERS = [];
  try {
    const data = await fs.readFile(PRINTERS_FILE, 'utf-8');
    PRINTERS = JSON.parse(data);
  } catch (e) {
    PRINTERS = [];
  }


  // Hvis ?ip=... er satt, filtrer på denne
  const query = getQuery(event);
  let printersToFetch = PRINTERS;
  if (query && query.ip) {
    printersToFetch = PRINTERS.filter(p => p.ip === query.ip);
  }



  // Hent status for alle printere parallelt, men vis alltid alle printere uansett feil
  const results = await Promise.all(printersToFetch.map(async ({ ip, apiKey, hostname, displayName }) => {
    let info = {};
    let status = {};
    let error = null;
    let filament_type = null;
    let jobInfo = null;
    
    // Hent alle 3 endpoints samtidig for maksimal hastighet
    const [infoRes, statusRes, jobRes] = await Promise.allSettled([
      fetchWithTimeout(`http://${ip}/api/v1/info`, {
        headers: { 'X-Api-Key': apiKey }
      }, 1000),
      fetchWithTimeout(`http://${ip}/api/v1/status`, {
        headers: { 'X-Api-Key': apiKey }
      }, 1000),
      fetchWithTimeout(`http://${ip}/api/v1/job`, {
        headers: { 'X-Api-Key': apiKey }
      }, 1000)
    ]);
    
    // Process info response
    if (infoRes.status === 'fulfilled' && infoRes.value.ok) {
      try {
        info = await infoRes.value.json();
      } catch (e) {
        error = 'Feil ved parsing av info';
      }
    } else if (infoRes.status === 'rejected') {
      error = infoRes.reason?.name === 'AbortError' ? 'Timeout ved henting info' : infoRes.reason?.message;
    }
    
    // Process status response
    if (statusRes.status === 'fulfilled' && statusRes.value.ok) {
      try {
        status = await statusRes.value.json();
      } catch (e) {
        error = error || 'Feil ved parsing av status';
      }
    } else if (statusRes.status === 'rejected' && !error) {
      error = statusRes.reason?.name === 'AbortError' ? 'Timeout ved henting status' : statusRes.reason?.message;
    }
    
    // Process job response
    if (jobRes.status === 'fulfilled' && jobRes.value.ok) {
      try {
        const job = await jobRes.value.json();
        // Hvis job har .job, bruk den, ellers bruk hele job-objektet
        jobInfo = job?.job ? job.job : job;
        // Filament-type
        if (jobInfo?.filament_type) {
          filament_type = jobInfo.filament_type;
        } else if (jobInfo?.filename) {
          const match = jobInfo.filename.match(/(PLA|PETG|ABS|ASA|PC|Nylon|TPU|PP|HIPS|PVA|BVOH|Wood|Carbon)/i);
          if (match) filament_type = match[0].toUpperCase();
        }
      } catch (e) {
        // ignorer feil her
      }
    }
    // Prøv å tolke om det er filament tilstede
    let filament_present = null;
    // PrusaLink rapporterer noen ganger dette direkte
    if (typeof status?.printer?.filament_sensor !== 'undefined') {
      filament_present = status.printer.filament_sensor;
    } else if (status?.printer?.state && typeof status.printer.state === 'string') {
      // Hvis state inneholder "NO_FILAMENT" eller lignende
      if (status.printer.state.toUpperCase().includes('FILAMENT')) {
        filament_present = !status.printer.state.toUpperCase().includes('NO_FILAMENT');
      }
    }
    // Kan også tolke fra error-meldinger
    if (error && typeof error === 'string' && error.toLowerCase().includes('filament')) {
      filament_present = false;
    }

    const printerState = status?.printer?.state;
    const printerHostname = info.hostname || hostname || '-';
    const printerDisplayName = displayName || '';

    // Sjekk om printeren har endret tilstand (startet eller avsluttet print)
    if (printerState) {
      await checkAndLogPrinterState(ip, printerState, printerHostname, printerDisplayName, jobInfo);
    }

    return {
      nozzle_diameter: info.nozzle_diameter,
      mmu: info.mmu,
      serial: info.serial,
      hostname: printerHostname,
      displayName: printerDisplayName,
      min_extrusion_temp: info.min_extrusion_temp,
      state: printerState,
      temp_bed: status?.printer?.temp_bed,
      target_bed: status?.printer?.target_bed,
      temp_nozzle: status?.printer?.temp_nozzle,
      target_nozzle: status?.printer?.target_nozzle,
      is_printing: printerState !== 'IDLE',
      ip,
      apiKey,
      filament_type,
      filament_present,
      error,
      job: jobInfo || null // Legg til ALLE job-parametere fra PrusaLink, uansett struktur
    };
  }));

  // Returner alltid en array for konsistens
  return results;
});