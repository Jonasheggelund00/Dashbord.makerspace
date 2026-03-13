import { promises as fs } from 'fs';

const PRINTERS_FILE = 'server/api/printers.json';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { ip, path, filename } = query;

  if (!ip || !path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing ip or path parameter'
    });
  }

  // Hent printer info for å få API-nøkkel
  let PRINTERS = [];
  try {
    const data = await fs.readFile(PRINTERS_FILE, 'utf-8');
    PRINTERS = JSON.parse(data);
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not read printers file'
    });
  }

  const printer = PRINTERS.find(p => p.ip === ip);
  if (!printer) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Printer not found'
    });
  }

  try {
    // Last ned filen fra printeren
    const response = await fetch(`http://${ip}${path}`, {
      headers: {
        'X-Api-Key': printer.apiKey
      }
    });

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to download file from printer'
      });
    }

    // Få filnavn - bruk det som er sendt med, eller fall tilbake til path
    const displayFilename = filename || decodeURIComponent(path.split('/').pop());

    // Sett riktige headers for nedlasting
    setResponseHeaders(event, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(displayFilename)}`,
    });

    // Stream filen direkte
    return sendStream(event, response.body);
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to download file'
    });
  }
});
