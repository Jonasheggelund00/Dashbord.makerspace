import bcrypt from 'bcrypt';
import { getCookie } from 'h3';
import { getUsers, saveUsers, isValidSession } from '../utils/userStore.js';

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'admin_session');
  if (!(await isValidSession(session))) {
    return { status: 401, body: 'Unauthorized' };
  }

  const body = await readBody(event);
  if (!body.newPassword || body.newPassword.length < 4) {
    return { status: 400, body: 'Passordet er for kort' };
  }

  const users = await getUsers();
  const userIndex = users.findIndex(u => u.username === session);
  if (userIndex === -1) {
    return { status: 404, body: 'Bruker ikke funnet' };
  }

  users[userIndex].passwordHash = await bcrypt.hash(body.newPassword, 10);
  await saveUsers(users);
  return { status: 200 };
});
