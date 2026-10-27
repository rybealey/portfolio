// Database connection for the command-line scripts (migrate, seed,
// previews). Run them with `node --env-file-if-exists=.env`, which the npm
// scripts do. The site itself connects through src/lib/db.ts.
import mysql from 'mysql2/promise';

export function connect() {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_NAME || !DB_USER) {
    console.error('Set DB_HOST, DB_PORT, DB_NAME, DB_USER and DB_PASSWORD (see .env.example).');
    process.exit(1);
  }
  return mysql.createConnection({
    host: DB_HOST ?? '127.0.0.1',
    port: Number(DB_PORT ?? 3306),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    charset: 'utf8mb4',
    multipleStatements: true,
  });
}
