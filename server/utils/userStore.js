import { promises as fs } from 'fs';
import { readFileSync } from 'fs';
import { join } from 'path';

const USERS_FILE = join(process.cwd(), 'server/config/users.json');
const ENV_FILE = join(process.cwd(), 'user.env');

async function migrateFromEnv() {
  try {
    const env = Object.fromEntries(
      readFileSync(ENV_FILE, 'utf-8')
        .split('\n')
        .filter(Boolean)
        .map(line => {
          const idx = line.indexOf('=');
          return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
        })
    );
    const users = [{
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      username: env.ADMIN_USERNAME,
      passwordHash: env.ADMIN_PASSWORD_HASH,
      createdAt: new Date().toISOString()
    }];
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    console.log('Migrerte bruker fra user.env til users.json');
    return users;
  } catch (e) {
    console.error('Feil ved migrering fra user.env:', e);
    return [];
  }
}

export async function getUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return await migrateFromEnv();
  }
}

export async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function isValidSession(session) {
  if (!session) return false;
  const users = await getUsers();
  return users.some(u => u.username === session);
}
