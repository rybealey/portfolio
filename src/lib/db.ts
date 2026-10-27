// The site's MariaDB pool. On cPanel the database is on the same server, so
// DB_HOST is localhost; locally it is the Docker database (docker-compose.yml).
import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from 'astro:env/server';

let pool: Pool | undefined;

export function db(): Pool {
  pool ??= mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    charset: 'utf8mb4',
    // Shared hosting caps connections per user; a few is plenty here.
    connectionLimit: 5,
    dateStrings: ['DATE'],
  });
  return pool;
}

export async function rows<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [result] = await db().query<RowDataPacket[]>(sql, params);
  return result as T[];
}

// Content changes rarely, and every page reads the case studies (the ⌘K
// palette lists them), so lists are held in memory briefly. The posting API
// can call invalidate() to show a change at once.
const TTL_MS = 30_000;
const cache = new Map<string, { expires: number; value: Promise<unknown> }>();

export function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as Promise<T>;
  const value = load();
  cache.set(key, { expires: Date.now() + TTL_MS, value });
  value.catch(() => cache.delete(key));
  return value;
}

export function invalidate() {
  cache.clear();
}
