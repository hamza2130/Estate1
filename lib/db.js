import { Pool } from 'pg';
import { setupDatabase } from './seed.mjs';

const globalForDb = globalThis;

export function databaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

function createPool() {
  const connectionString = databaseUrl();
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

// Creates tables and demo content on first use, so a fresh database (e.g. a new
// Neon project attached in Vercel) works without running any setup command.
async function bootstrap() {
  const client = await getPool().connect();
  try {
    await client.query('SELECT pg_advisory_lock(424242)');
    await setupDatabase(client);
  } finally {
    await client.query('SELECT pg_advisory_unlock(424242)').catch(() => {});
    client.release();
  }
}

export function ready() {
  if (!globalForDb.__autostackReady) {
    globalForDb.__autostackReady = bootstrap().catch((err) => {
      globalForDb.__autostackReady = null;
      throw err;
    });
  }
  return globalForDb.__autostackReady;
}

export async function query(text, params = []) {
  await ready();
  const result = await getPool().query(text, params);
  return result.rows;
}

export async function queryOne(text, params = []) {
  const rows = await query(text, params);
  return rows[0] ?? null;
}
