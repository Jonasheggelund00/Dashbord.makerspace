import { getCookie } from 'h3';
import bcrypt from 'bcrypt';
import { getUsers, saveUsers, isValidSession } from '../utils/userStore.js';

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'admin_session');
  if (!(await isValidSession(session))) {
    return { success: false, error: 'Unauthorized' };
  }

  const body = await readBody(event);
  const { id, username, password } = body;

  if (!id) {
    return { success: false, error: 'Bruker-ID mangler' };
  }

  const users = await getUsers();
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return { success: false, error: 'Brukeren finnes ikke' };
  }

  if (username !== undefined) {
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      return { success: false, error: 'Brukernavn må ha minst 2 tegn' };
    }
    // Check duplicate (ignore same user)
    if (users.some(u => u.username === trimmed && u.id !== id)) {
      return { success: false, error: 'Brukernavnet er allerede i bruk' };
    }
    users[userIndex].username = trimmed;
  }

  if (password) {
    if (password.length < 4) {
      return { success: false, error: 'Passord må ha minst 4 tegn' };
    }
    users[userIndex].passwordHash = await bcrypt.hash(password, 10);
  }

  await saveUsers(users);

  return {
    success: true,
    user: {
      id: users[userIndex].id,
      username: users[userIndex].username,
      createdAt: users[userIndex].createdAt
    }
  };
});
