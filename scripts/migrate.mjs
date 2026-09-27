import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');

const migrationUrl = new URL('../db/migrations/001_auth.sql', import.meta.url);
const sql = await readFile(fileURLToPath(migrationUrl), 'utf8');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  await client.query(sql);
  console.log('Applied 001_auth.sql');
} finally {
  await client.end();
}
