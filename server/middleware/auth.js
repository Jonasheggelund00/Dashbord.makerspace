
import bcrypt from 'bcrypt';
import { getCookie, setCookie } from 'h3';
import { getUsers, isValidSession } from '../utils/userStore.js';

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'admin_session');
  event.context.isAdmin = await isValidSession(session);
});

export async function login(username, password) {
  const users = await getUsers();
  const user = users.find(u => u.username === username);
  if (!user) return false;
  return await bcrypt.compare(password, user.passwordHash);
}

export function setSession(event, username) {
  setCookie(event, 'admin_session', username, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: false,
  });
}

export function clearSession(event) {
  setCookie(event, 'admin_session', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: false,
  });
}
