import { getCookie } from 'h3';
import bcrypt from 'bcrypt';
import { getUsers, saveUsers, isValidSession } from '../utils/userStore.js';

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'admin_session');
  if (!(await isValidSession(session))) {
    return { success: false, error: 'Unauthorized' };
  }

  const body = await readBody(event);
  const { username, password } = body;

  if (!username || username.trim().length < 2) {
    return { success: false, error: 'Brukernavn må ha minst 2 tegn' };
  }
  if (!password || password.length < 4) {
    return { success: false, error: 'Passord må ha minst 4 tegn' };
  }

  const users = await getUsers();
  if (users.some(u => u.username === username.trim())) {
    return { success: false, error: 'Brukernavnet er allerede i bruk' };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    username: username.trim(),
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  await saveUsers(users);

  return { success: true, user: { id: newUser.id, username: newUser.username, createdAt: newUser.createdAt } };
});
