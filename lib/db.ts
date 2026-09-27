import 'server-only';
import { Pool } from 'pg';

declare global {
  var edgesyncPool: Pool | undefined;
}

function createPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  return new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
}

export const db = globalThis.edgesyncPool ?? createPool();

if (process.env.NODE_ENV !== 'production') globalThis.edgesyncPool = db;
