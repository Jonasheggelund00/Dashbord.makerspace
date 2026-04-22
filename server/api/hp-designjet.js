import { logActivity } from '../utils/logger.js';

const HP_IP = '192.168.1.11';
const TIMEOUT_MS = 10000;
const DESIGNJET_DEVICE_NAME = 'HP DesignJet T630';
let lastDesignjetInUse = null;

async function maybeLogDesignjetUsage(isPrinting, statusOk, statusData, jobsData) {
  if (!statusOk) return;
  if (typeof isPrinting !== 'boolean') return;

  if (lastDesignjetInUse === null) {
    lastDesignjetInUse = isPrinting;
    return;
  }

  if (lastDesignjetInUse === isPrinting) return;

  lastDesignjetInUse = isPrinting;
  const logType = isPrinting ? 'storformat_in_use' : 'storformat_idle';

  try {
    await logActivity({
      type: logType,
      device: DESIGNJET_DEVICE_NAME,
      metadata: {
        isPrinting,
        statusCategory: statusData?.category,
        statusMessage: statusData?.message,
        jobCount: Array.isArray(jobsData) ? jobsData.length : 0
      }
    });
  } catch (e) {
    console.error('Feil ved logging av storformatsskriver bruk:', e);
  }
}

// Hjelpefunksjon for fetch med timeout
async function fetchWithTimeout(url, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// Hent innhold mellom XML-tagger (returnerer alle forekomster)
function getAllTagValues(xml, tag) {
  const results = [];
  const regex = new RegExp(`<[^>]*:?${tag}[^>]*>([\\s\\S]*?)<\\/[^>]*:?${tag}>`, 'gi');
  let match;
  while ((match = regex.exec(xml)) !== null) {
    results.push(match[1].trim());
  }
  return results;
}

// Hent første forekomst av en tagg
function getTagValue(xml, tag) {
  const all = getAllTagValues(xml, tag);
  return all.length > 0 ? all[0] : null;
}

// Parse blekknivåer fra ConsumableConfigDyn.xml
function parseInkLevels(xml) {
  const inks = [];

  // HP DesignJet bruker <ccdyn:ConsumableInfo> blokker (ikke <Consumable>)
  const blockRegex = /<ccdyn:ConsumableInfo[\s\S]*?<\/ccdyn:ConsumableInfo>/gi;
  const blocks = xml.match(blockRegex) || [];

  for (const block of blocks) {
    const type = getTagValue(block, 'ConsumableTypeEnum');
    if (!type || type.toLowerCase() !== 'ink') continue; // Filtrer ut printhead etc.

    // Farge: dd:ConsumableLabelCode (Y, M, C, K)
    const labelCode = getTagValue(block, 'ConsumableLabelCode') || 'Ukjent';

    // Nivå: dd:ConsumablePercentageLevelRemaining
    const levelRaw = getTagValue(block, 'ConsumablePercentageLevelRemaining');
    const level = levelRaw !== null ? parseInt(levelRaw, 10) : null;

    // Status: første dd:ConsumableState (inne i dd:ConsumableLifeState)
    const state = getTagValue(block, 'ConsumableState') || 'ok';

    inks.push({
      color: normalizeColor(labelCode),
      colorCode: labelCode,
      level,
      status: translateConsumableState(state),
      hex: inkColor(labelCode),
    });
  }

  return inks;
}

function translateConsumableState(state) {
  const s = (state || '').toLowerCase();
  if (s === 'ok' || s === 'newgenuinehp') return 'OK';
  if (s === 'used') return 'I bruk';
  if (s === 'low') return 'Lavt';
  if (s === 'verylow') return 'Svært lavt';
  if (s === 'empty') return 'Tom';
  if (s === 'missing') return 'Mangler';
  if (s === 'error') return 'Feil';
  return state || 'OK';
}

// Normaliser fargenavn til norsk
function normalizeColor(code) {
  const map = {
    'MK': 'Matt svart',
    'K': 'Svart',
    'PK': 'Foto svart',
    'C': 'Cyan',
    'M': 'Magenta',
    'Y': 'Gul',
    'LC': 'Lys cyan',
    'LM': 'Lys magenta',
    'GY': 'Grå',
    'LK': 'Lys svart',
    'DGY': 'Mørk grå',
    'B': 'Blå',
    'G': 'Grønn',
    'R': 'Rød',
  };
  return map[code?.toUpperCase()] || code || 'Ukjent';
}

// Farge for blekknivå (CSS-klasse-hint)
function inkColor(colorCode) {
  const map = {
    'MK': '#1a1a1a',
    'K': '#1a1a1a',
    'PK': '#333333',
    'C': '#00bcd4',
    'M': '#e91e63',
    'Y': '#ffc107',
    'LC': '#80deea',
    'LM': '#f48fb1',
    'GY': '#9e9e9e',
    'LK': '#757575',
    'DGY': '#616161',
    'B': '#2196f3',
    'G': '#4caf50',
    'R': '#f44336',
  };
  return map[colorCode?.toUpperCase()] || '#9e9e9e';
}

// Parse skrivestatus fra ProductStatusDyn.xml
function parseStatus(xml) {
  // HP rapporterer flere <psdyn:Status> blokker samtidig – hent alle StatusCategory-verdier
  const allCategories = getAllTagValues(xml, 'StatusCategory');

  // Prioritetsrekkefølge: velg den mest relevante statusen
  // trayEmpty ignoreres fordi T630 primært bruker rull, ikke arkkassett
  const priority = [
    'printing', 'processing',
    'ready', 'idle',
    'inpowersave', 'sleep', 'powersave',
    'dooropen', 'mediaout', 'medialow',
    'warning', 'error',
  ];

  const ignored = ['trayempty']; // Arkkassett er ikke relevant for rulleprinter

  // Filtrer bort ignorerte statuser
  const relevant = allCategories.filter(c => !ignored.includes(c.toLowerCase()));

  // Sorter etter prioritet
  const sorted = relevant.sort((a, b) => {
    const ai = priority.indexOf(a.toLowerCase());
    const bi = priority.indexOf(b.toLowerCase());
    const av = ai === -1 ? 99 : ai;
    const bv = bi === -1 ? 99 : bi;
    return av - bv;
  });

  const chosen = sorted[0] || allCategories[0] || 'unknown';

  return {
    category: chosen.toLowerCase(),
    message: translateStatus(chosen),
    raw: chosen,
    allStatuses: allCategories,
  };
}

function translateStatus(category) {
  const s = (category || '').toLowerCase();
  const normalized = s.replace(/[^a-z]/g, '');

  if (normalized === 'ready' || normalized === 'idle') return 'Klar';
  if (normalized === 'unknown') return 'Ukjent';
  if (normalized === 'processing' || normalized === 'printing' || normalized.includes('printing')) return 'Skriver ut';
  if (normalized === 'inpowersave' || normalized === 'sleep' || normalized === 'powersave') return 'Energisparing';
  if (normalized.includes('replacecartridge') || normalized.includes('replacecartarage')) return 'Bytt blekkpatron';
  if (normalized.includes('cartridgeout') || normalized.includes('inkout') || normalized.includes('inkempty')) return 'Blekkpatron tom';
  if (normalized.includes('cartridgelow') || normalized.includes('inklow') || normalized.includes('inkverylow')) return 'Lite blekk';
  if (normalized.includes('trayempty')) return 'Papirkassett tom';
  if (normalized.includes('mediaout')) return 'Papir tomt';
  if (normalized.includes('dooropen')) return 'Deksel åpent';
  if (normalized.includes('medialow')) return 'Lite papir';
  if (normalized.includes('calibrating')) return 'Kalibrerer';
  if (normalized.includes('warmingup') || normalized.includes('warming')) return 'Varmer opp';
  if (normalized.includes('cleaning')) return 'Rengjør';
  if (normalized.includes('maintenance')) return 'Vedlikehold';
  if (normalized.includes('attention')) return 'Trenger oppmerksomhet';
  if (normalized.includes('error')) return 'Feil';
  if (normalized.includes('warning')) return 'Advarsel';
  if (normalized.includes('cancelled')) return 'Kansellert';
  if (normalized.includes('offline')) return 'Frakoblet';
  if (normalized.includes('standby')) return 'Standby';
  return 'Ukjent status';
}

// Parse jobbkø fra jobs/jobs.xml
function parseJobs(xml) {
  const jobs = [];
  const jobBlocks = xml.match(/<[^>]*:?Job[ >][\s\S]*?<\/[^>]*:?Job>/gi) || [];

  for (const block of jobBlocks) {
    const name = getTagValue(block, 'JobName') || 'Ukjent jobb';
    const user = getTagValue(block, 'JobOriginatingUserName') || null;
    const state = getTagValue(block, 'JobState') || getTagValue(block, 'JobStatus') || 'ukjent';
    const stateReason = getTagValue(block, 'JobStateReason') || null;
    const id = getTagValue(block, 'JobId') || null;
    const pagesCompleted = getTagValue(block, 'PrintsCompleted') || '0';
    const pagesRequested = getTagValue(block, 'PrintsRequested') || null;

    jobs.push({
      id,
      name,
      user,
      state: translateJobState(state),
      stateRaw: state,
      stateReason,
      pagesCompleted: parseInt(pagesCompleted, 10) || 0,
      pagesRequested: pagesRequested !== null ? parseInt(pagesRequested, 10) : null,
    });
  }

  return jobs;
}

function translateJobState(state) {
  const s = (state || '').toLowerCase();
  if (s.includes('processing') || s.includes('printing')) return 'Skriver ut';
  if (s.includes('pending') || s.includes('queue')) return 'Venter';
  if (s.includes('completed') || s.includes('finished')) return 'Fullført';
  if (s.includes('cancelled') || s.includes('aborted')) return 'Kansellert';
  if (s.includes('stopped') || s.includes('paused')) return 'Pauset';
  return state || 'Ukjent';
}

// Parse papirinnskuff/rull fra MediaHandlingDyn.xml
function parseMedia(xml) {
  const trays = [];
  const trayBlocks = xml.match(/<mhdyn:InputTray[\s\S]*?<\/mhdyn:InputTray>/gi) || [];

  for (const block of trayBlocks) {
    const bin     = getTagValue(block, 'InputBin') || 'Ukjent';
    const state   = (getTagValue(block, 'TrayState') || '').toLowerCase();
    const media   = (getTagValue(block, 'MediaState') || '').toLowerCase();
    const widthRaw = getTagValue(block, 'Width');
    const width   = widthRaw ? parseInt(widthRaw, 10) : null;

    if (bin.toLowerCase().startsWith('roll')) {
      trays.push({
        bin,
        isRoll: true,
        loaded: state === 'engaged',
        trayState: state,
        mediaState: media,
        widthMm: width && width > 0 ? width : null,
        widthLabel: width && width > 0 ? `${width} mm (${rollWidthLabel(width)})` : null,
      });
    }
  }
  return trays;
}

function rollWidthLabel(mm) {
  if (mm >= 910 && mm <= 920) return 'A0/36"';
  if (mm >= 630 && mm <= 640) return 'A1/24"';
  if (mm >= 590 && mm <= 600) return '23"';
  if (mm >= 430 && mm <= 440) return 'A2/17"';
  if (mm >= 300 && mm <= 320) return 'A3/12"';
  return `${mm} mm`;
}

export default defineEventHandler(async () => {
  const base = `http://${HP_IP}`;

  const [statusResult, inkResult, jobsResult, mediaResult] = await Promise.allSettled([
    fetchWithTimeout(`${base}/DevMgmt/ProductStatusDyn.xml`),
    fetchWithTimeout(`${base}/DevMgmt/ConsumableConfigDyn.xml`),
    fetchWithTimeout(`${base}/jobs/jobs.xml`),
    fetchWithTimeout(`${base}/DevMgmt/MediaHandlingDyn.xml`),
  ]);

  // Skrivestatus
  let statusData = { category: 'offline', message: 'Frakoblet', raw: null };
  let statusOk = false;
  if (statusResult.status === 'fulfilled' && statusResult.value.ok) {
    try {
      const xml = await statusResult.value.text();
      statusData = parseStatus(xml);
      statusOk = true;
    } catch {}
  }

  // Blekknivåer
  let inkData = [];
  if (inkResult.status === 'fulfilled' && inkResult.value.ok) {
    try {
      const xml = await inkResult.value.text();
      inkData = parseInkLevels(xml);
    } catch {}
  }

  // Jobbkø
  let jobsData = [];
  if (jobsResult.status === 'fulfilled' && jobsResult.value.ok) {
    try {
      const xml = await jobsResult.value.text();
      jobsData = parseJobs(xml);
    } catch {}
  }

  // Papir/rull
  let mediaData = [];
  if (mediaResult.status === 'fulfilled' && mediaResult.value.ok) {
    try {
      const xml = await mediaResult.value.text();
      mediaData = parseMedia(xml);
    } catch {}
  }

  const roll = mediaData.find(t => t.isRoll) || null;

  const isPrinting = statusData.category === 'processing'
    || jobsData.some(j => j.stateRaw?.toLowerCase().includes('processing'));

  await maybeLogDesignjetUsage(isPrinting, statusOk, statusData, jobsData);

  return {
    online: statusOk,
    isPrinting,
    status: statusData,
    ink: inkData,
    jobs: jobsData,
    roll,
    ip: HP_IP,
    model: 'HP DesignJet T630',
    lastFetched: new Date().toISOString(),
  };
});
