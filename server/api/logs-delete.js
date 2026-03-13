import { deleteLog, clearAllLogs } from '../utils/logger.js';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  try {
    if (body.deleteAll) {
      // Slett alle logger
      await clearAllLogs();
      return { success: true, message: 'Alle logger ble slettet' };
    } else if (body.logId) {
      // Slett en spesifikk logg
      await deleteLog(body.logId);
      return { success: true, message: 'Loggen ble slettet' };
    } else {
      throw new Error('Ugyldig forespørsel');
    }
  } catch (error) {
    console.error('Feil ved sletting av logger:', error);
    return { success: false, error: error.message };
  }
});
