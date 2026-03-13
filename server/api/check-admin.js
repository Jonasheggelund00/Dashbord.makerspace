
import { defineEventHandler } from 'h3';
import { getCookie } from 'h3';
import { isValidSession } from '../utils/userStore.js';

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'admin_session');
  const isAdmin = await isValidSession(session);
  return { isAdmin, username: isAdmin ? session : null };
});
