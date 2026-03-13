import { getCookie } from 'h3';
import { getUsers, isValidSession } from '../utils/userStore.js';

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'admin_session');
  if (!(await isValidSession(session))) {
    return { success: false, error: 'Unauthorized' };
  }

  const users = await getUsers();
  // Returner brukere uten passord-hash
  return {
    success: true,
    users: users.map(({ id, username, createdAt }) => ({ id, username, createdAt }))
  };
});
