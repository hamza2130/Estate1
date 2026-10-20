import { Pool } from 'pg';

const globalForDb = globalThis;

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
  }
  const ssl = /sslmode=require|neon\.tech|supabase\.co/.test(connectionString)
    ? { rejectUnauthorized: false }
    : undefined;
  return new Pool({ connectionString, ssl, max: 5 });
}

export function getPool() {
  if (!globalForDb.__autostackPool) {
    globalForDb.__autostackPool = createPool();
  }
  return globalForDb.__autostackPool;
}

export async function query(text, params = []) {
  const result = await getPool().query(text, params);
  return result.rows;
}

export async function queryOne(text, params = []) {
  const rows = await query(text, params);
  return rows[0] ?? null;
}
