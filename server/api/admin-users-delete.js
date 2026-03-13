import { getCookie } from 'h3';
import { getUsers, saveUsers, isValidSession } from '../utils/userStore.js';

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'admin_session');
  if (!(await isValidSession(session))) {
    return { success: false, error: 'Unauthorized' };
  }

  const body = await readBody(event);
  const { id } = body;

  if (!id) {
    return { success: false, error: 'Bruker-ID mangler' };
  }

  const users = await getUsers();

  if (users.length <= 1) {
    return { success: false, error: 'Kan ikke slette den eneste brukeren' };
  }

  const userToDelete = users.find(u => u.id === id);
  if (!userToDelete) {
    return { success: false, error: 'Brukeren finnes ikke' };
  }

  // Prevent deleting the currently logged-in user
  if (userToDelete.username === session) {
    return { success: false, error: 'Du kan ikke slette din egen bruker' };
  }

  const updated = users.filter(u => u.id !== id);
  await saveUsers(updated);

  return { success: true };
});
