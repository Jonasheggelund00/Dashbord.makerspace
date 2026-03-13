import { getActivityLogs } from '../utils/logger.js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const options = {
    limit: query.limit ? parseInt(query.limit) : 100,
    type: query.type,
    device: query.device
  };

  const result = await getActivityLogs(options);
  
  if (!result.success) {
    return { error: result.error, logs: [], total: 0 };
  }

  return { logs: result.logs, total: result.logs.length };
});
