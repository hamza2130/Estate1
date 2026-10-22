// Creates the tables, the admin account and demo content.
//   npm run db:setup         create tables, seed only if empty
//   npm run db:reset         drop everything and reseed
// The app also runs this automatically on first boot against an empty database.
import pg from 'pg';
import { setupDatabase } from '../lib/seed.mjs';

for (const file of ['.env.local', '.env']) {
  try { process.loadEnvFile(file); } catch {}
}

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env first.');
  process.exit(1);
}

const ssl = /sslmode=require|neon\.tech|supabase\.co/.test(url) ? { rejectUnauthorized: false } : undefined;
const db = new pg.Client({ connectionString: url, ssl });
await db.connect();
await setupDatabase(db, { reset: process.argv.includes('--reset'), log: console.log });
await db.end();
